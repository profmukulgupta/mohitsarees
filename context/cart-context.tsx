"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
import {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  getCartItems,
  clearCart as clearCartAction,
} from "@/lib/actions/cart"

interface CartItem {
  id: string
  productId: string
  quantity: number
  size?: string
  color?: string
  product: {
    id: string
    name: string
    price: number
    images: string[]
  }
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  subtotal: number
  shipping: number
  tax: number
  total: number
  isLoading: boolean
  addItem: (item: { productId: string; quantity: number; size?: string; color?: string }) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  removeItem: (id: string) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load cart from server on initial render
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const result = await getCartItems()
        if (result.success) {
          setItems(result.cartItems)
        }
      } catch (error) {
        console.error("Failed to fetch cart items:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCartItems()
  }, [])

  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0)

  // Free shipping for orders over ₹5,000
  const shipping = subtotal > 5000 ? 0 : 299

  // 5% tax
  const tax = Math.round(subtotal * 0.05)

  const total = subtotal + shipping + tax

  const addItem = async (newItem: { productId: string; quantity: number; size?: string; color?: string }) => {
    try {
      const result = await addToCart(newItem)

      if (result.success) {
        // Refresh cart items
        const cartResult = await getCartItems()
        if (cartResult.success) {
          setItems(cartResult.cartItems)
        }

        toast({
          title: "Added to cart",
          description: "Item has been added to your cart.",
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return

    try {
      const result = await updateCartItemQuantity(id, quantity)

      if (result.success) {
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to update quantity:", error)
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive",
      })
    }
  }

  const removeItem = async (id: string) => {
    try {
      const result = await removeFromCart(id)

      if (result.success) {
        setItems((prev) => prev.filter((item) => item.id !== id))

        toast({
          title: "Item removed",
          description: "The item has been removed from your cart.",
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to remove item:", error)
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      })
    }
  }

  const clearCart = async () => {
    try {
      const result = await clearCartAction()

      if (result.success) {
        setItems([])

        toast({
          title: "Cart cleared",
          description: "All items have been removed from your cart.",
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to clear cart:", error)
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        shipping,
        tax,
        total,
        isLoading,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

