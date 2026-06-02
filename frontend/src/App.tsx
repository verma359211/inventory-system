import { useState } from "react";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";

type Page = "home" | "products";

export default function App() {
  const [page, setPage] = useState<Page>("home");

  return (
    <div className="app">
      <header className="header">
        <h1>Inventory Management</h1>
        <nav>
          <button
            type="button"
            className={page === "home" ? "active" : ""}
            onClick={() => setPage("home")}
          >
            Home
          </button>
          <button
            type="button"
            className={page === "products" ? "active" : ""}
            onClick={() => setPage("products")}
          >
            Products
          </button>
        </nav>
      </header>
      <main>{page === "home" ? <HomePage /> : <ProductsPage />}</main>
    </div>
  );
}
