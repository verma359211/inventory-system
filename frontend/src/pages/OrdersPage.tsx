import { useState } from "react";
import ConfirmDialog from "../components/common/ConfirmDialog";
import ErrorMessage from "../components/common/ErrorMessage";
import LoadingState from "../components/common/LoadingState";
import Modal from "../components/common/Modal";
import SuccessMessage from "../components/common/SuccessMessage";
import OrderForm from "../components/orders/OrderForm";
import OrderTable from "../components/orders/OrderTable";
import { useCustomers } from "../hooks/useCustomers";
import { useCreateOrder, useDeleteOrder, useOrders } from "../hooks/useOrders";
import { useProducts } from "../hooks/useProducts";
import type { Order } from "../types/order";
import type { OrderCreate } from "../types/order";
import { getErrorMessage } from "../utils/format";

export default function OrdersPage() {
  const { data: orders = [], isLoading, isError, error } = useOrders();
  const { data: customers = [], isLoading: customersLoading } = useCustomers();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const createMutation = useCreateOrder();
  const deleteMutation = useDeleteOrder();

  const [showCreate, setShowCreate] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleCreate(data: OrderCreate) {
    try {
      await createMutation.mutateAsync(data);
      setSuccessMessage("Order created successfully.");
      setShowCreate(false);
      setFormError(null);
    } catch (err) {
      setFormError(getErrorMessage(err));
      throw err;
    }
  }

  async function confirmDelete() {
    if (!deletingOrder) return;
    try {
      await deleteMutation.mutateAsync(deletingOrder.id);
      setSuccessMessage("Order deleted successfully.");
      setDeletingOrder(null);
    } catch (err) {
      setFormError(getErrorMessage(err));
      setDeletingOrder(null);
    }
  }

  const formDataLoading = customersLoading || productsLoading;

  return (
    <section className="page">
      <div className="page-header">
        <h2>Orders</h2>
        <button
          type="button"
          className="btn-primary"
          onClick={() => { setFormError(null); setShowCreate(true); }}
        >
          Create order
        </button>
      </div>

      {successMessage && (
        <SuccessMessage message={successMessage} onDismiss={() => setSuccessMessage(null)} />
      )}
      {formError && !showCreate && !deletingOrder && (
        <ErrorMessage message={formError} />
      )}

      {isLoading && <LoadingState message="Loading orders..." />}
      {isError && <ErrorMessage message={getErrorMessage(error)} />}
      {!isLoading && !isError && (
        <OrderTable orders={orders} onDelete={setDeletingOrder} />
      )}

      {showCreate && (
        <Modal title="Create order" onClose={() => { setShowCreate(false); setFormError(null); }}>
          {formDataLoading ? (
            <LoadingState message="Loading form data..." />
          ) : customers.length === 0 || products.length === 0 ? (
            <ErrorMessage message="Create at least one customer and one product before placing an order." />
          ) : (
            <OrderForm
              customers={customers}
              products={products}
              onSubmit={handleCreate}
              onCancel={() => { setShowCreate(false); setFormError(null); }}
              serverError={formError}
            />
          )}
        </Modal>
      )}

      {deletingOrder && (
        <ConfirmDialog
          title="Delete order"
          message={`Delete order #${deletingOrder.id}? This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingOrder(null)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </section>
  );
}
