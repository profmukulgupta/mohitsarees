import type { Metadata } from "next"
import CheckoutForm from "./checkout-form"

export const metadata: Metadata = {
  title: "Checkout | Mohit Saree Center",
  description: "Complete your purchase securely.",
}

export default function CheckoutPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <CheckoutForm />
    </main>
  )
}

