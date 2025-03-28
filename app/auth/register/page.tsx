import type { Metadata } from "next"
import RegisterForm from "./register-form"

export const metadata: Metadata = {
  title: "Register | Mohit Saree Center",
  description: "Create a new account to start shopping with Mohit Saree Center.",
}

export default function RegisterPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <RegisterForm />
    </main>
  )
}

