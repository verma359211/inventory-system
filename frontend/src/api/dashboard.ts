import { apiRequest } from "./client";
import type { DashboardSummary } from "../types/dashboard";

export function fetchDashboardSummary(): Promise<DashboardSummary> {
  return apiRequest<DashboardSummary>("/dashboard/summary");
}
