import { useState } from "react";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";
import Modal from "../components/common/Modal";
import PageHeader from "../components/common/PageHeader";
import SuccessMessage from "../components/common/SuccessMessage";
import { TableSkeleton } from "../components/common/Skeleton";
import ProductForm from "../components/products/ProductForm";
import ProductTable from "../components/products/ProductTable";
import {
  useCreateProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from "../hooks/useProducts";
import type { Product, ProductCreate, ProductUpdate } from "../types/product";
import { getErrorMessage } from "../utils/format";

type ModalMode = "create" | "edit" | null;

export default function ProductsPage() {
  const { data: products = [], isLoading, isError, error } = useProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function openCreate() {
    setFormError(null);
    setEditingProduct(null);
    setModalMode("create");
  }

  function openEdit(product: Product) {
    setFormError(null);
    setEditingProduct(product);
    setModalMode("edit");
  }

  function closeModal() {
    setModalMode(null);
    setEditingProduct(null);
    setFormError(null);
  }

  async function handleCreate(data: ProductCreate) {
    try {
      await createMutation.mutateAsync(data);
      setSuccessMessage("Product created successfully.");
      closeModal();
    } catch (err) {
      setFormError(getErrorMessage(err));
      throw err;
    }
  }

  async function handleUpdate(data: ProductUpdate) {
    if (!editingProduct) return;
    try {
      await updateMutation.mutateAsync({ id: editingProduct.id, data });
      setSuccessMessage("Product updated successfully.");
      closeModal();
    } catch (err) {
      setFormError(getErrorMessage(err));
      throw err;
    }
  }

  async function confirmDelete() {
    if (!deletingProduct) return;
    try {
      await deleteMutation.mutateAsync(deletingProduct.id);
      setSuccessMessage("Product deleted successfully.");
      setDeletingProduct(null);
    } catch (err) {
      setFormError(getErrorMessage(err));
      setDeletingProduct(null);
    }
  }

  return (
    <section className="page">
      <PageHeader
        title="Products"
        description="Manage catalog items, pricing, and inventory levels."
        actions={
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            Add product
          </button>
        }
      />

      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onDismiss={() => setSuccessMessage(null)}
        />
      )}
      {formError && !modalMode && !deletingProduct && (
        <ErrorMessage message={formError} />
      )}

      {isLoading && <TableSkeleton />}
      {isError && <ErrorMessage message={getErrorMessage(error)} />}

      {!isLoading && !isError && products.length === 0 && (
        <EmptyState
          title="No products yet"
          description="Add your first product to start tracking inventory and fulfilling orders."
          action={
            <button type="button" className="btn btn-primary" onClick={openCreate}>
              Add product
            </button>
          }
        />
      )}

      {!isLoading && !isError && products.length > 0 && (
        <ProductTable
          products={products}
          onEdit={openEdit}
          onDelete={setDeletingProduct}
        />
      )}

      {modalMode === "create" && (
        <Modal title="Add product" onClose={closeModal}>
          <ProductForm
            submitLabel="Create product"
            onSubmit={handleCreate}
            onCancel={closeModal}
            serverError={formError}
          />
        </Modal>
      )}

      {modalMode === "edit" && editingProduct && (
        <Modal title="Edit product" onClose={closeModal}>
          <ProductForm
            initial={editingProduct}
            submitLabel="Save changes"
            onSubmit={handleUpdate}
            onCancel={closeModal}
            serverError={formError}
          />
        </Modal>
      )}

      {deletingProduct && (
        <ConfirmDialog
          title="Delete product"
          message={`Delete "${deletingProduct.name}"? This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingProduct(null)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </section>
  );
}
