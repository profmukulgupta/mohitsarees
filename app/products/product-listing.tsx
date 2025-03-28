"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Heart, SlidersHorizontal, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

// Sample product data
const allProducts = [
  {
    id: 1,
    name: "Banarasi Silk Saree",
    price: 24999,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg",
    category: "sarees",
    fabric: "silk",
    color: "red",
    occasion: "wedding",
    isNew: true,
  },
  {
    id: 2,
    name: "Gold Brocade Designer Blouse",
    price: 12999,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black_tussar_woven_design_blouse_womens_soch-blsljqd00652c_01-w3rd2yNomrTo2LNcYEqUpeupvMnQfz.webp",
    category: "blouses",
    fabric: "brocade",
    color: "gold",
    occasion: "wedding",
    isNew: true,
  },
  {
    id: 3,
    name: "Royal Blue Embroidered Blouse",
    price: 15999,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/indigo_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667i_01-NPQpXwvaebwWLqaRYDtX0TUXJ230a6.webp",
    category: "blouses",
    fabric: "georgette",
    color: "blue",
    occasion: "festive",
    isNew: true,
  },
  {
    id: 4,
    name: "Teal Embroidered Blouse",
    price: 15999,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/teal_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667d_01-mwsaxIUrxuAcQMhQa3JEVn4BipvB6o.webp",
    category: "blouses",
    fabric: "georgette",
    color: "teal",
    occasion: "festive",
    isNew: false,
  },
  {
    id: 5,
    name: "Peach Organza Blouse",
    price: 18999,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/peach_organza_embellished_blouse_with_sequins_womens_soch-blhsemb00656c_01-B16q3yAZcKUp2HWUx4i4Q1QHTHiSqs.webp",
    category: "blouses",
    fabric: "organza",
    color: "peach",
    occasion: "wedding",
    isNew: false,
  },
  {
    id: 6,
    name: "Cream Floral Embroidered Blouse",
    price: 16999,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cream_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667c_01-jvqcLo9vcEAdWZvLuJ219AtQPyB7FX.webp",
    category: "blouses",
    fabric: "georgette",
    color: "cream",
    occasion: "festive",
    isNew: false,
  },
  {
    id: 7,
    name: "Kanjeevaram Silk Saree",
    price: 34999,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg",
    category: "sarees",
    fabric: "silk",
    color: "red",
    occasion: "wedding",
    isNew: false,
  },
  {
    id: 8,
    name: "Chanderi Cotton Saree",
    price: 9999,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg",
    category: "sarees",
    fabric: "cotton",
    color: "green",
    occasion: "casual",
    isNew: true,
  },
]

// Filter options
const filterOptions = {
  category: ["sarees", "blouses"],
  fabric: ["silk", "cotton", "georgette", "organza", "brocade"],
  color: ["red", "blue", "green", "gold", "peach", "cream", "teal"],
  occasion: ["wedding", "festive", "casual"],
  priceRange: ["0-5000", "5000-10000", "10000-20000", "20000+"],
}

// Sort options
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
]

export default function ProductListing({
  category,
  color,
  fabric,
  occasion,
  priceRange,
  sort = "featured",
}: {
  category?: string
  color?: string
  fabric?: string
  occasion?: string
  priceRange?: string
  sort?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  // Filter states
  const [filters, setFilters] = useState({
    category: category ? [category] : [],
    color: color ? [color] : [],
    fabric: fabric ? [fabric] : [],
    occasion: occasion ? [occasion] : [],
    priceRange: priceRange ? [priceRange] : [],
  })

  const [sortBy, setSortBy] = useState(sort)
  const [filteredProducts, setFilteredProducts] = useState(allProducts)

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()

    if (filters.category.length === 1) {
      params.set("category", filters.category[0])
    }

    if (filters.color.length === 1) {
      params.set("color", filters.color[0])
    }

    if (filters.fabric.length === 1) {
      params.set("fabric", filters.fabric[0])
    }

    if (filters.occasion.length === 1) {
      params.set("occasion", filters.occasion[0])
    }

    if (filters.priceRange.length === 1) {
      params.set("price", filters.priceRange[0])
    }

    if (sortBy !== "featured") {
      params.set("sort", sortBy)
    }

    const queryString = params.toString()
    const url = queryString ? `${pathname}?${queryString}` : pathname

    router.push(url, { scroll: false })
  }, [filters, sortBy, pathname, router])

  // Filter products based on selected filters
  useEffect(() => {
    let result = [...allProducts]

    // Apply category filter
    if (filters.category.length > 0) {
      result = result.filter((product) => filters.category.includes(product.category))
    }

    // Apply color filter
    if (filters.color.length > 0) {
      result = result.filter((product) => filters.color.includes(product.color))
    }

    // Apply fabric filter
    if (filters.fabric.length > 0) {
      result = result.filter((product) => filters.fabric.includes(product.fabric))
    }

    // Apply occasion filter
    if (filters.occasion.length > 0) {
      result = result.filter((product) => filters.occasion.includes(product.occasion))
    }

    // Apply price range filter
    if (filters.priceRange.length > 0) {
      result = result.filter((product) => {
        return filters.priceRange.some((range) => {
          if (range === "0-5000") return product.price <= 5000
          if (range === "5000-10000") return product.price > 5000 && product.price <= 10000
          if (range === "10000-20000") return product.price > 10000 && product.price <= 20000
          if (range === "20000+") return product.price > 20000
          return true
        })
      })
    }

    // Apply sorting
    if (sortBy === "newest") {
      result = result.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1))
    } else if (sortBy === "price-low-high") {
      result = result.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high-low") {
      result = result.sort((a, b) => b.price - a.price)
    }

    setFilteredProducts(result)
  }, [filters, sortBy])

  // Toggle filter
  const toggleFilter = (type: keyof typeof filters, value: string) => {
    setFilters((prev) => {
      const current = [...prev[type]]
      const index = current.indexOf(value)

      if (index === -1) {
        current.push(value)
      } else {
        current.splice(index, 1)
      }

      return { ...prev, [type]: current }
    })
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: [],
      color: [],
      fabric: [],
      occasion: [],
      priceRange: [],
    })
    setSortBy("featured")
  }

  // Add to wishlist
  const addToWishlist = (e: React.MouseEvent, productId: number) => {
    e.preventDefault()
    e.stopPropagation()
    toast({
      title: "Added to wishlist",
      description: "This product has been added to your wishlist.",
    })
  }

  // Get active filter count
  const activeFilterCount = Object.values(filters).reduce((count, filterValues) => count + filterValues.length, 0)

  // Get page title based on filters
  const getPageTitle = () => {
    if (filters.category.length === 1) {
      return filters.category[0].charAt(0).toUpperCase() + filters.category[0].slice(1)
    }
    return "All Products"
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif">{getPageTitle()}</h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">{activeFilterCount}</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Refine your product search with filters</SheetDescription>
              </SheetHeader>

              <div className="py-4">
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Category</h3>
                  <div className="space-y-2">
                    {filterOptions.category.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${option}`}
                          checked={filters.category.includes(option)}
                          onCheckedChange={() => toggleFilter("category", option)}
                        />
                        <Label htmlFor={`category-${option}`} className="capitalize">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Fabric</h3>
                  <div className="space-y-2">
                    {filterOptions.fabric.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`fabric-${option}`}
                          checked={filters.fabric.includes(option)}
                          onCheckedChange={() => toggleFilter("fabric", option)}
                        />
                        <Label htmlFor={`fabric-${option}`} className="capitalize">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Color</h3>
                  <div className="space-y-2">
                    {filterOptions.color.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`color-${option}`}
                          checked={filters.color.includes(option)}
                          onCheckedChange={() => toggleFilter("color", option)}
                        />
                        <Label htmlFor={`color-${option}`} className="capitalize">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Occasion</h3>
                  <div className="space-y-2">
                    {filterOptions.occasion.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`occasion-${option}`}
                          checked={filters.occasion.includes(option)}
                          onCheckedChange={() => toggleFilter("occasion", option)}
                        />
                        <Label htmlFor={`occasion-${option}`} className="capitalize">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <div className="space-y-2">
                    {filterOptions.priceRange.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`price-${option}`}
                          checked={filters.priceRange.includes(option)}
                          onCheckedChange={() => toggleFilter("priceRange", option)}
                        />
                        <Label htmlFor={`price-${option}`}>
                          {option === "0-5000" && "Under ₹5,000"}
                          {option === "5000-10000" && "₹5,000 - ₹10,000"}
                          {option === "10000-20000" && "₹10,000 - ₹20,000"}
                          {option === "20000+" && "Above ₹20,000"}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear All
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button>Apply Filters</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(filters).map(([type, values]) =>
            values.map((value) => (
              <Badge key={`${type}-${value}`} variant="secondary" className="flex items-center gap-1">
                <span className="capitalize">{value}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => toggleFilter(type as keyof typeof filters, value)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </Button>
              </Badge>
            )),
          )}
          {activeFilterCount > 1 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6">
              Clear All
            </Button>
          )}
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No products found</h2>
          <p className="text-muted-foreground mb-6">Try adjusting your filters to find what you're looking for.</p>
          <Button onClick={clearFilters}>Clear All Filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-0">
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                    {product.isNew && <Badge className="absolute top-2 left-2 bg-primary">New</Badge>}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full"
                      onClick={(e) => addToWishlist(e, product.id)}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-2">{product.name}</h3>
                    <p className="text-lg font-serif">₹{product.price.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

