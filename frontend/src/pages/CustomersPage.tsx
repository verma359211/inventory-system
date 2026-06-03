import { useState } from "react";
import ConfirmDialog from "../components/common/ConfirmDialog";
import ErrorMessage from "../components/common/ErrorMessage";
import LoadingState from "../components/common/LoadingState";
import Modal from "../components/common/Modal";
import SuccessMessage from "../components/common/SuccessMessage";
import CustomerForm from "../components/customers/CustomerForm";
import CustomerTable from "../components/customers/CustomerTable";
import { useCreateCustomer, useCustomers, useDeleteCustomer } from "../hooks/useCustomers";
import type { Customer } from "../types/customer";
import type { CustomerCreate } from "../types/customer";
import { getErrorMessage } from "../utils/format";

export default function CustomersPage() {
  const { data: customers = [], isLoading, isError, error } = useCustomers();
  const createMutation = useCreateCustomer();
  const deleteMutation = useDeleteCustomer();

  const [showCreate, setShowCreate] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleCreate(data: CustomerCreate) {
    try {
      await createMutation.mutateAsync(data);
      setSuccessMessage("Customer created successfully.");
      setShowCreate(false);
      setFormError(null);
    } catch (err) {
      setFormError(getErrorMessage(err));
      throw err;
    }
  }

  async function confirmDelete() {
    if (!deletingCustomer) return;
    try {
      await deleteMutation.mutateAsync(deletingCustomer.id);
      setSuccessMessage("Customer deleted successfully.");
      setDeletingCustomer(null);
    } catch (err) {
      setFormError(getErrorMessage(err));
      setDeletingCustomer(null);
    }
  }

  return (
    <section className="page">
      <div className="page-header">
        <h2>Customers</h2>
        <button type="button" className="btn-primary" onClick={() => { setFormError(null); setShowCreate(true); }}>
          Add customer
        </button>
      </div>

      {successMessage && (
        <SuccessMessage message={successMessage} onDismiss={() => setSuccessMessage(null)} />
      )}
      {formError && !showCreate && !deletingCustomer && (
        <ErrorMessage message={formError} />
      )}

      {isLoading && <LoadingState message="Loading customers..." />}
      {isError && <ErrorMessage message={getErrorMessage(error)} />}
      {!isLoading && !isError && (
        <CustomerTable customers={customers} onDelete={setDeletingCustomer} />
      )}

      {showCreate && (
        <Modal title="Create customer" onClose={() => { setShowCreate(false); setFormError(null); }}>
          <CustomerForm
            onSubmit={handleCreate}
            onCancel={() => { setShowCreate(false); setFormError(null); }}
            serverError={formError}
          />
        </Modal>
      )}

      {deletingCustomer && (
        <ConfirmDialog
          title="Delete customer"
          message={`Delete "${deletingCustomer.full_name}"? This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingCustomer(null)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </section>
  );
}
