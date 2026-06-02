import { getDashboardStats } from "@/app/actions/dashboard";
import DashboardClient from "./DashboardClient";

export default async function AdminDashboardPage() {
  const initialData = await getDashboardStats();

  return <DashboardClient initialData={initialData} />;
}
