import { useState } from "react";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";
import LoadingState from "../components/common/LoadingState";
import Modal from "../components/common/Modal";
import PageHeader from "../components/common/PageHeader";
import SuccessMessage from "../components/common/SuccessMessage";
import { TableSkeleton } from "../components/common/Skeleton";
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

  function openCreate() {
    setFormError(null);
    setShowCreate(true);
  }

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
      <PageHeader
        title="Orders"
        description="Create and review customer orders. Stock is reduced when an order is placed."
        actions={
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            Create order
          </button>
        }
      />

      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onDismiss={() => setSuccessMessage(null)}
        />
      )}
      {formError && !showCreate && !deletingOrder && (
        <ErrorMessage message={formError} />
      )}

      {isLoading && <TableSkeleton />}
      {isError && <ErrorMessage message={getErrorMessage(error)} />}

      {!isLoading && !isError && orders.length === 0 && (
        <EmptyState
          title="No orders yet"
          description="Create an order once you have at least one customer and product in the system."
          action={
            <button type="button" className="btn btn-primary" onClick={openCreate}>
              Create order
            </button>
          }
        />
      )}

      {!isLoading && !isError && orders.length > 0 && (
        <OrderTable orders={orders} onDelete={setDeletingOrder} />
      )}

      {showCreate && (
        <Modal title="Create order" onClose={() => { setShowCreate(false); setFormError(null); }} wide>
          {formDataLoading ? (
            <LoadingState message="Loading form data..." variant="centered" />
          ) : customers.length === 0 || products.length === 0 ? (
            <EmptyState
              title="Cannot create order"
              description="Add at least one customer and one product before placing an order."
            />
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
          message={`Delete order #${deletingOrder.id}? This cannot be undone. Stock will not be restored.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingOrder(null)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </section>
  );
}
