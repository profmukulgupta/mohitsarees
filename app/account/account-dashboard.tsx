"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Package, Heart, MapPin, CreditCard, LogOut, Settings, ShoppingBag, Clock, X, Loader2 } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { getUserProfile, updateUserProfile, updateNotificationPreferences } from "@/lib/actions/user"

export default function AccountDashboard() {
  const { toast } = useToast()
  const router = useRouter()
  const { data: session, status } = useSession()

  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "authenticated") {
        try {
          const userData = await getUserProfile()
          if (userData) {
            setUser(userData)
            setFormData({
              name: userData.name || "",
              email: userData.email || "",
              phone: userData.phone || "",
            })
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
          toast({
            title: "Error",
            description: "Failed to load your account information",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      } else if (status === "unauthenticated") {
        router.push("/auth/login")
      }
    }

    fetchUserData()
  }, [status, router, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const saveProfile = async () => {
    try {
      setIsLoading(true)
      const result = await updateUserProfile(formData)

      if (result.success) {
        setUser((prev: any) => ({ ...prev, ...formData }))
        setEditMode(false)
        toast({
          title: "Profile updated",
          description: "Your profile information has been updated successfully.",
        })
      } else {
        toast({
          title: "Update failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleNotification = async (key: string) => {
    if (!user?.notificationPreferences) return

    try {
      const updatedPreferences = {
        ...user.notificationPreferences,
        [key]: !user.notificationPreferences[key],
      }

      // Remove id and userId fields
      const { id, userId, ...preferencesData } = updatedPreferences

      const result = await updateNotificationPreferences(preferencesData)

      if (result.success) {
        setUser((prev: any) => ({
          ...prev,
          notificationPreferences: {
            ...prev.notificationPreferences,
            [key]: !prev.notificationPreferences[key],
          },
        }))

        toast({
          title: "Notification preferences updated",
          description: `You have ${user.notificationPreferences[key] ? "unsubscribed from" : "subscribed to"} ${key.replace(/([A-Z])/g, " $1").toLowerCase()} notifications.`,
        })
      } else {
        toast({
          title: "Update failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const removeFromWishlist = (id: number) => {
    // This would be implemented with a server action to remove from database
    setUser((prev: any) => ({
      ...prev,
      wishlist: prev.wishlist.filter((item: any) => item.id !== id),
    }))

    toast({
      title: "Item removed",
      description: "The item has been removed from your wishlist.",
    })
  }

  const setDefaultAddress = (id: number) => {
    // This would be implemented with a server action to update in database
    setUser((prev: any) => ({
      ...prev,
      addresses: prev.addresses.map((address: any) => ({
        ...address,
        isDefault: address.id === id,
      })),
    }))

    toast({
      title: "Default address updated",
      description: "Your default address has been updated successfully.",
    })
  }

  const setDefaultPayment = (id: number) => {
    // This would be implemented with a server action to update in database
    setUser((prev: any) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map((method: any) => ({
        ...method,
        isDefault: method.id === id,
      })),
    }))

    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been updated successfully.",
    })
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account.",
    })
    router.push("/auth/login")
  }

  if (isLoading || status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading your account information...</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Account Not Found</h2>
        <p className="mb-6">We couldn't find your account information. Please try logging in again.</p>
        <Button asChild>
          <Link href="/auth/login">Go to Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-serif mb-8">My Account</h1>

      <Tabs defaultValue="dashboard" className="space-y-8">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 overflow-x-auto">
          <TabsTrigger
            value="dashboard"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
          >
            Orders
          </TabsTrigger>
          <TabsTrigger
            value="wishlist"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
          >
            Wishlist
          </TabsTrigger>
          <TabsTrigger
            value="addresses"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
          >
            Addresses
          </TabsTrigger>
          <TabsTrigger
            value="payment"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
          >
            Payment Methods
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
          >
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    {!editMode && (
                      <Button variant="outline" size="sm">
                        Change Photo
                      </Button>
                    )}
                  </div>

                  <div className="flex-1 space-y-4">
                    {editMode ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" onClick={() => setEditMode(false)} disabled={isLoading}>
                            Cancel
                          </Button>
                          <Button onClick={saveProfile} disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              "Save Changes"
                            )}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Full Name</p>
                            <p className="font-medium">{user.name || "Not set"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{user.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="font-medium">{user.phone || "Not set"}</p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button variant="outline" onClick={() => setEditMode(true)}>
                            Edit Profile
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
                <CardDescription>Quick overview of your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{user.orders?.length || 0} Orders</p>
                    <p className="text-sm text-muted-foreground">View your order history</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{user.wishlist?.length || 0} Wishlist Items</p>
                    <p className="text-sm text-muted-foreground">Products you've saved</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{user.addresses?.length || 0} Saved Addresses</p>
                    <p className="text-sm text-muted-foreground">Manage your delivery addresses</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{user.paymentMethods?.length || 0} Payment Methods</p>
                    <p className="text-sm text-muted-foreground">Your saved payment options</p>
                  </div>
                </div>
                <Separator />
                <Button variant="outline" className="w-full" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Track your recent purchases</CardDescription>
              </CardHeader>
              <CardContent>
                {user.orders?.length > 0 ? (
                  <div className="space-y-4">
                    {user.orders.slice(0, 2).map((order: any) => (
                      <div key={order.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.date}</p>
                          <div className="flex items-center mt-1">
                            <Badge variant={order.status === "Delivered" ? "outline" : "default"}>{order.status}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{order.total.toLocaleString()}</p>
                          <Button variant="link" size="sm" className="h-8 px-0" asChild>
                            <Link href={`/account/orders/${order.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">No orders yet</p>
                )}
                {user.orders?.length > 2 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" asChild>
                      <Link href="/account?tab=orders">View All Orders</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wishlist</CardTitle>
                <CardDescription>Products you've saved for later</CardDescription>
              </CardHeader>
              <CardContent>
                {user.wishlist?.length > 0 ? (
                  <div className="space-y-4">
                    {user.wishlist.slice(0, 2).map((item: any) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium line-clamp-1">{item.name}</p>
                          <p className="text-sm">₹{item.price.toLocaleString()}</p>
                          <Button variant="link" size="sm" className="h-8 px-0" asChild>
                            <Link href={`/products/${item.id}`}>View Product</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">Your wishlist is empty</p>
                )}
                {user.wishlist?.length > 2 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" asChild>
                      <Link href="/account?tab=wishlist">View All Wishlist Items</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Track and manage your orders</CardDescription>
            </CardHeader>
            <CardContent>
              {user.orders?.length > 0 ? (
                <div className="space-y-6">
                  {user.orders.map((order: any) => (
                    <div key={order.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-muted/30 p-4 flex flex-col sm:flex-row justify-between">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.date}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-2 sm:mt-0">
                          <Badge variant={order.status === "Delivered" ? "outline" : "default"}>{order.status}</Badge>
                          <p className="font-medium">₹{order.total.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="space-y-4">
                          {order.items.map((item: any) => (
                            <div key={item.id} className="flex gap-4">
                              <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                <p className="text-sm">₹{item.price.toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-end mt-4 gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/account/orders/${order.id}`}>
                              <Package className="h-4 w-4 mr-2" />
                              Track Order
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm">
                            <Clock className="h-4 w-4 mr-2" />
                            Order Again
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't placed any orders yet. Start shopping to see your orders here.
                  </p>
                  <Button asChild>
                    <Link href="/products">Browse Products</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wishlist Tab */}
        <TabsContent value="wishlist">
          <Card>
            <CardHeader>
              <CardTitle>My Wishlist</CardTitle>
              <CardDescription>Products you've saved for later</CardDescription>
            </CardHeader>
            <CardContent>
              {user.wishlist?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {user.wishlist.map((item: any) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative aspect-[3/4]">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 rounded-full"
                            onClick={() => removeFromWishlist(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium mb-2">{item.name}</h3>
                          <p className="text-lg font-serif mb-4">₹{item.price.toLocaleString()}</p>
                          <div className="flex gap-2">
                            <Button className="w-full" asChild>
                              <Link href={`/products/${item.id}`}>View Product</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
                  <p className="text-muted-foreground mb-4">
                    Save items you love to your wishlist and find them here for easy access.
                  </p>
                  <Button asChild>
                    <Link href="/products">Browse Products</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Addresses Tab */}
        <TabsContent value="addresses">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Saved Addresses</CardTitle>
                <CardDescription>Manage your delivery addresses</CardDescription>
              </div>
              <Button>Add New Address</Button>
            </CardHeader>
            <CardContent>
              {user.addresses?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user.addresses.map((address: any) => (
                    <Card key={address.id} className={address.isDefault ? "border-primary" : ""}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-medium">{address.name}</p>
                            <Badge variant="outline" className="mt-1">
                              {address.type}
                            </Badge>
                            {address.isDefault && <Badge className="ml-2 mt-1">Default</Badge>}
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p>{address.address}</p>
                          <p>
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                          <p className="mt-2">Phone: {address.phone}</p>
                        </div>
                        {!address.isDefault && (
                          <Button
                            variant="outline"
                            className="mt-4 w-full"
                            onClick={() => setDefaultAddress(address.id)}
                          >
                            Set as Default
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No addresses saved</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your delivery addresses for a faster checkout experience.
                  </p>
                  <Button>Add New Address</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="payment">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your saved payment options</CardDescription>
              </div>
              <Button>Add Payment Method</Button>
            </CardHeader>
            <CardContent>
              {user.paymentMethods?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user.paymentMethods.map((method: any) => (
                    <Card key={method.id} className={method.isDefault ? "border-primary" : ""}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-medium">{method.type}</p>
                            <p className="text-sm text-muted-foreground">{method.name}</p>
                            {method.isDefault && <Badge className="mt-1">Default</Badge>}
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p>{method.number}</p>
                          {method.expiry && <p>Expires: {method.expiry}</p>}
                        </div>
                        {!method.isDefault && (
                          <Button
                            variant="outline"
                            className="mt-4 w-full"
                            onClick={() => setDefaultPayment(method.id)}
                          >
                            Set as Default
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No payment methods saved</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your payment methods for a faster checkout experience.
                  </p>
                  <Button>Add Payment Method</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive updates from us</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="orderUpdates">Order Updates</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications about your order status</p>
                  </div>
                  <Switch
                    id="orderUpdates"
                    checked={user.notificationPreferences?.orderUpdates}
                    onCheckedChange={() => toggleNotification("orderUpdates")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="promotions">Promotions & Offers</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about sales, discounts, and special offers
                    </p>
                  </div>
                  <Switch
                    id="promotions"
                    checked={user.notificationPreferences?.promotions}
                    onCheckedChange={() => toggleNotification("promotions")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="newArrivals">New Arrivals</Label>
                    <p className="text-sm text-muted-foreground">Stay updated on new products and collections</p>
                  </div>
                  <Switch
                    id="newArrivals"
                    checked={user.notificationPreferences?.newArrivals}
                    onCheckedChange={() => toggleNotification("newArrivals")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="blogPosts">Blog & Style Guides</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates when new articles and style guides are published
                    </p>
                  </div>
                  <Switch
                    id="blogPosts"
                    checked={user.notificationPreferences?.blogPosts}
                    onCheckedChange={() => toggleNotification("blogPosts")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

