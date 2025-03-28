import type { Metadata } from "next"
import ProductDetail from "./product-detail"

export const metadata: Metadata = {
  title: "Product Details | Mohit Saree Center",
  description: "View detailed information about our premium products.",
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto px-4 py-8">
      <ProductDetail id={params.id} />
    </main>
  )
}

