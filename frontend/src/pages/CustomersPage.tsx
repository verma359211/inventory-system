import { useState } from "react";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";
import Modal from "../components/common/Modal";
import PageHeader from "../components/common/PageHeader";
import SuccessMessage from "../components/common/SuccessMessage";
import { TableSkeleton } from "../components/common/Skeleton";
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

  function openCreate() {
    setFormError(null);
    setShowCreate(true);
  }

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
      <PageHeader
        title="Customers"
        description="Maintain customer records for order placement and fulfillment."
        actions={
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            Add customer
          </button>
        }
      />

      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onDismiss={() => setSuccessMessage(null)}
        />
      )}
      {formError && !showCreate && !deletingCustomer && (
        <ErrorMessage message={formError} />
      )}

      {isLoading && <TableSkeleton />}
      {isError && <ErrorMessage message={getErrorMessage(error)} />}

      {!isLoading && !isError && customers.length === 0 && (
        <EmptyState
          title="No customers yet"
          description="Create a customer before placing orders in the system."
          action={
            <button type="button" className="btn btn-primary" onClick={openCreate}>
              Add customer
            </button>
          }
        />
      )}

      {!isLoading && !isError && customers.length > 0 && (
        <CustomerTable customers={customers} onDelete={setDeletingCustomer} />
      )}

      {showCreate && (
        <Modal title="Add customer" onClose={() => { setShowCreate(false); setFormError(null); }}>
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
