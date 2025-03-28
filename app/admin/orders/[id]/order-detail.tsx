"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Package, Truck, CheckCircle, Clock, MapPin, Loader2, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getOrderById, updateOrderStatus, addTrackingEvent } from "@/lib/actions/order"

interface OrderDetailProps {
  id: string
}

export default function OrderDetail({ id }: OrderDetailProps) {
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false)
  const { toast } = useToast()

  // Form states
  const [statusUpdate, setStatusUpdate] = useState({
    status: "",
    paymentStatus: "",
    trackingNumber: "",
    notes: "",
  })

  const [trackingEvent, setTrackingEvent] = useState({
    status: "",
    description: "",
    location: "",
  })

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const result = await getOrderById(id)
        if (result.success) {
          setOrder(result.order)
          // Initialize form with current values
          setStatusUpdate({
            status: result.order.status,
            paymentStatus: result.order.paymentStatus,
            trackingNumber: result.order.trackingNumber || "",
            notes: "",
          })
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Failed to fetch order details:", error)
        toast({
          title: "Error",
          description: "Failed to load order details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [id, toast])

  const handleUpdateOrder = async () => {
    if (!statusUpdate.status) {
      toast({
        title: "Error",
        description: "Please select an order status.",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)
    try {
      const result = await updateOrderStatus({
        orderId: id,
        status: statusUpdate.status as any,
        paymentStatus: statusUpdate.paymentStatus as any,
        trackingNumber: statusUpdate.trackingNumber,
        notes: statusUpdate.notes,
      })

      if (result.success) {
        toast({
          title: "Order updated",
          description: "The order has been updated successfully.",
        })

        // Refresh order data
        const refreshResult = await getOrderById(id)
        if (refreshResult.success) {
          setOrder(refreshResult.order)
        }

        setUpdateDialogOpen(false)
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to update order:", error)
      toast({
        title: "Error",
        description: "Failed to update order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAddTrackingEvent = async () => {
    if (!trackingEvent.status) {
      toast({
        title: "Error",
        description: "Please enter a tracking status.",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)
    try {
      const result = await addTrackingEvent({
        orderId: id,
        status: trackingEvent.status,
        description: trackingEvent.description,
        location: trackingEvent.location,
      })

      if (result.success) {
        toast({
          title: "Tracking event added",
          description: "The tracking event has been added successfully.",
        })

        // Refresh order data
        const refreshResult = await getOrderById(id)
        if (refreshResult.success) {
          setOrder(refreshResult.order)
        }

        // Reset form
        setTrackingEvent({
          status: "",
          description: "",
          location: "",
        })

        setTrackingDialogOpen(false)
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to add tracking event:", error)
      toast({
        title: "Error",
        description: "Failed to add tracking event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Order Placed":
      case "PENDING":
      case "Pending":
        return <Package className="h-5 w-5 text-primary" />
      case "Order Processed":
      case "PROCESSING":
      case "Processing":
        return <Clock className="h-5 w-5 text-primary" />
      case "Shipped":
      case "SHIPPED":
        return <Truck className="h-5 w-5 text-primary" />
      case "Delivered":
      case "DELIVERED":
        return <CheckCircle className="h-5 w-5 text-primary" />
      case "Cancelled":
      case "CANCELLED":
        return <AlertTriangle className="h-5 w-5 text-destructive" />
      default:
        return <Clock className="h-5 w-5 text-primary" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading order details...</span>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-4">Order not found</h2>
        <p className="text-muted-foreground mb-6">
          The order you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Button asChild>
          <Link href="/admin/orders">Back to Orders</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/orders" className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Orders
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-serif">Order #{order.orderNumber}</h1>
          <p className="text-muted-foreground">
            Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
            {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
            <DialogTrigger asChild>
              <Button>Update Order</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Order Status</DialogTitle>
                <DialogDescription>
                  Update the status, payment status, and tracking information for this order.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="status">Order Status</label>
                  <Select
                    value={statusUpdate.status}
                    onValueChange={(value) => setStatusUpdate({ ...statusUpdate, status: value })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="PROCESSING">Processing</SelectItem>
                      <SelectItem value="SHIPPED">Shipped</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="RETURNED">Returned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="paymentStatus">Payment Status</label>
                  <Select
                    value={statusUpdate.paymentStatus}
                    onValueChange={(value) => setStatusUpdate({ ...statusUpdate, paymentStatus: value })}
                  >
                    <SelectTrigger id="paymentStatus">
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                      <SelectItem value="REFUNDED">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="trackingNumber">Tracking Number</label>
                  <Input
                    id="trackingNumber"
                    value={statusUpdate.trackingNumber}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, trackingNumber: e.target.value })}
                    placeholder="Enter tracking number"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="notes">Notes</label>
                  <Textarea
                    id="notes"
                    value={statusUpdate.notes}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, notes: e.target.value })}
                    placeholder="Add notes about this update"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setUpdateDialogOpen(false)} disabled={isUpdating}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateOrder} disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Order"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={trackingDialogOpen} onOpenChange={setTrackingDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Add Tracking Event</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Tracking Event</DialogTitle>
                <DialogDescription>
                  Add a new tracking event to update the customer on their order status.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="eventStatus">Status</label>
                  <Input
                    id="eventStatus"
                    value={trackingEvent.status}
                    onChange={(e) => setTrackingEvent({ ...trackingEvent, status: e.target.value })}
                    placeholder="e.g., In Transit, Out for Delivery"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="description">Description</label>
                  <Textarea
                    id="description"
                    value={trackingEvent.description}
                    onChange={(e) => setTrackingEvent({ ...trackingEvent, description: e.target.value })}
                    placeholder="Add details about this tracking event"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="location">Location (optional)</label>
                  <Input
                    id="location"
                    value={trackingEvent.location}
                    onChange={(e) => setTrackingEvent({ ...trackingEvent, location: e.target.value })}
                    placeholder="e.g., Mumbai Sorting Facility"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setTrackingDialogOpen(false)} disabled={isUpdating}>
                  Cancel
                </Button>
                <Button onClick={handleAddTrackingEvent} disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Event"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>
                  Customer: {order.user.name} ({order.user.email})
                </CardDescription>
              </div>
              <Badge
                variant={
                  order.status === "DELIVERED" ? "outline" : order.status === "CANCELLED" ? "destructive" : "default"
                }
              >
                {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-24 h-24 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
                          {item.color && <p className="text-sm text-muted-foreground">Color: {item.color}</p>}
                        </div>
                        <p className="text-lg font-serif mt-2 sm:mt-0">₹{item.price.toLocaleString()}</p>
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/products/${item.product.id}`}>View Product</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {order.notes && (
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-medium mb-2">Order Notes</h3>
                  <p>{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Status changes and tracking events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Status History</h3>
                  <div className="space-y-4">
                    {order.statusHistory.map((history: any, index: number) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 shrink-0">
                          {getStatusIcon(history.status)}
                        </div>
                        <div>
                          <p className="font-medium">
                            {history.status.charAt(0) + history.status.slice(1).toLowerCase()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(history.timestamp).toLocaleDateString()} at{" "}
                            {new Date(history.timestamp).toLocaleTimeString()}
                          </p>
                          {history.notes && <p className="text-sm mt-1">{history.notes}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-3">Tracking Events</h3>
                  {order.trackingEvents.length > 0 ? (
                    <div className="space-y-4">
                      {order.trackingEvents.map((event: any, index: number) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 shrink-0">
                            {getStatusIcon(event.status)}
                          </div>
                          <div>
                            <p className="font-medium">{event.status}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}
                            </p>
                            {event.description && <p className="text-sm mt-1">{event.description}</p>}
                            {event.location && (
                              <p className="text-sm text-muted-foreground">Location: {event.location}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No tracking events recorded yet.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{order.shipping === 0 ? "Free" : `₹${order.shipping}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{order.tax.toLocaleString()}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>₹{order.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Payment Method</p>
                  <p>{order.paymentMethod}</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Payment Status</p>
                  <Badge
                    variant={
                      order.paymentStatus === "PAID"
                        ? "success"
                        : order.paymentStatus === "FAILED"
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {order.paymentStatus.charAt(0) + order.paymentStatus.slice(1).toLowerCase()}
                  </Badge>
                </div>

                {order.trackingNumber && (
                  <div>
                    <p className="text-sm font-medium mb-1">Tracking Number</p>
                    <p>{order.trackingNumber}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Name</p>
                <p>{order.user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Email</p>
                <p>{order.user.email}</p>
              </div>
              {order.user.phone && (
                <div>
                  <p className="text-sm font-medium mb-1">Phone</p>
                  <p>{order.user.phone}</p>
                </div>
              )}
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/users/${order.user.id}`}>View Customer Profile</Link>
              </Button>
            </CardContent>
          </Card>

          {order.address && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{order.address.name}</p>
                    <p>{order.address.address}</p>
                    <p>
                      {order.address.city}, {order.address.state} - {order.address.pincode}
                    </p>
                    <p className="mt-2">Phone: {order.address.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

