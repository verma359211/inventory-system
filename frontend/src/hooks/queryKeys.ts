export const queryKeys = {
  products: {
    all: ["products"] as const,
    detail: (id: number) => ["products", id] as const,
  },
  customers: {
    all: ["customers"] as const,
    detail: (id: number) => ["customers", id] as const,
  },
  orders: {
    all: ["orders"] as const,
    detail: (id: number) => ["orders", id] as const,
  },
  dashboard: {
    summary: ["dashboard", "summary"] as const,
  },
};
