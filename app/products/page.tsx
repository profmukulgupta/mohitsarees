import type { Metadata } from "next"
import ProductListing from "./product-listing"

export const metadata: Metadata = {
  title: "Products | Mohit Saree Center",
  description: "Browse our collection of premium sarees and designer blouses.",
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const category = searchParams?.category as string | undefined
  const color = searchParams?.color as string | undefined
  const fabric = searchParams?.fabric as string | undefined
  const occasion = searchParams?.occasion as string | undefined
  const priceRange = searchParams?.price as string | undefined
  const sort = searchParams?.sort as string | undefined

  return (
    <main className="container mx-auto px-4 py-8">
      <ProductListing
        category={category}
        color={color}
        fabric={fabric}
        occasion={occasion}
        priceRange={priceRange}
        sort={sort}
      />
    </main>
  )
}

