import type { Metadata } from "next"
import OrderManagement from "./order-management"

export const metadata: Metadata = {
  title: "Order Management | Admin Dashboard",
  description: "Manage customer orders, update statuses, and track shipments",
}

export default function OrdersPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <OrderManagement />
    </main>
  )
}

