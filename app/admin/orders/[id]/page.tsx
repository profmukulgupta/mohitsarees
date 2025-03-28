import type { Metadata } from "next"
import OrderDetail from "./order-detail"

export const metadata: Metadata = {
  title: "Order Details | Admin Dashboard",
  description: "View and manage order details, update status, and add tracking information",
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto px-4 py-8">
      <OrderDetail id={params.id} />
    </main>
  )
}

