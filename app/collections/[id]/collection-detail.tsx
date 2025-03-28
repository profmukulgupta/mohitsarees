"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

// Sample collections
const collections = [
  {
    id: "1",
    name: "Bridal Collection",
    description:
      "Exquisite sarees for your special day, featuring rich fabrics, intricate embroidery, and timeless designs that celebrate the beauty of traditional Indian craftsmanship.",
    longDescription:
      "Our Bridal Collection is a celebration of timeless elegance and traditional craftsmanship. Each piece is meticulously crafted to capture the essence of bridal beauty, featuring rich fabrics like Banarasi silk, Kanjeevaram silk, and georgette adorned with intricate zari work, embroidery, and embellishments. These sarees are designed to make the bride feel special on her big day, with attention to detail that reflects the significance of the occasion. From classic red bridal sarees to contemporary designs in pastel hues, our collection offers options for every bride, ensuring she looks and feels her best as she embarks on this new journey.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg",
    products: [
      {
        id: 1,
        name: "Banarasi Silk Bridal Saree",
        price: 24999,
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg",
        isNew: true,
      },
      {
        id: 7,
        name: "Kanjeevaram Silk Saree",
        price: 34999,
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg",
        isNew: false,
      },
      {
        id: 9,
        name: "Embellished Bridal Saree",
        price: 29999,
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg",
        isNew: true,
      },
      {
        id: 10,
        name: "Designer Wedding Saree",
        price: 27999,
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg",
        isNew: false,
      },
      {
        id: 11,
        name: "Red Bridal Silk Saree",
        price: 32999,
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg",
        isNew: false,
      },
      {
        id: 12,
        name: "Gold Zari Work Bridal Saree",
        price: 36999,
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg",
        isNew: true,
      },
    ],
  },
  {
    id: "2",
    name: "Designer Blouses",
    description:
      "Elevate your saree ensemble with our exclusive designer blouses, crafted with meticulous attention to detail and featuring contemporary designs that make a statement.",
    longDescription:
      "Our Designer Blouse Collection showcases the perfect blend of traditional craftsmanship and contemporary design. Each blouse is created with meticulous attention to detail, featuring exquisite embroidery, intricate embellishments, and innovative cuts that elevate your saree ensemble to new heights. From classic designs with a modern twist to bold, statement pieces that become the focal point of your outfit, our collection offers versatile options for every occasion. We use premium fabrics like silk, georgette, and organza, ensuring comfort without compromising on style. Whether you're looking for a blouse for a wedding, festival, or special celebration, our designer collection has something to complement every saree and enhance your personal style.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black_tussar_woven_design_blouse_womens_soch-blsljqd00652c_01-w3rd2yNomrTo2LNcYEqUpeupvMnQfz.webp",
    products: [
      {
        id: 2,
        name: "Gold Brocade Designer Blouse",
        price: 12999,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black_tussar_woven_design_blouse_womens_soch-blsljqd00652c_01-w3rd2yNomrTo2LNcYEqUpeupvMnQfz.webp",
        isNew: true,
      },
      {
        id: 3,
        name: "Royal Blue Embroidered Blouse",
        price: 15999,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/indigo_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667i_01-NPQpXwvaebwWLqaRYDtX0TUXJ230a6.webp",
        isNew: true,
      },
      {
        id: 4,
        name: "Teal Embroidered Blouse",
        price: 15999,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/teal_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667d_01-mwsaxIUrxuAcQMhQa3JEVn4BipvB6o.webp",
        isNew: false,
      },
      {
        id: 5,
        name: "Peach Organza Blouse",
        price: 18999,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/peach_organza_embellished_blouse_with_sequins_womens_soch-blhsemb00656c_01-B16q3yAZcKUp2HWUx4i4Q1QHTHiSqs.webp",
        isNew: false,
      },
      {
        id: 6,
        name: "Cream Floral Embroidered Blouse",
        price: 16999,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cream_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667c_01-jvqcLo9vcEAdWZvLuJ219AtQPyB7FX.webp",
        isNew: false,
      },
    ],
  },
  {
    id: "3",
    name: "Festive Wear",
    description:
      "Celebrate special occasions in style with our festive collection, featuring vibrant colors, luxurious fabrics, and exquisite embellishments that capture the spirit of celebration.",
    longDescription:
      "Our Festive Wear Collection is designed to capture the spirit of celebration, offering vibrant colors, luxurious fabrics, and exquisite embellishments that make every occasion special. From traditional sarees with intricate zari work to contemporary designs with modern silhouettes, our collection offers a diverse range of options for festivals, parties, and special events. We use premium fabrics like silk, georgette, and velvet, ensuring comfort and elegance. Each piece is crafted with attention to detail, featuring embellishments like sequins, beads, and embroidery that add a touch of glamour to your festive ensemble. Whether you're looking for a saree for Diwali, Eid, or a family celebration, our festive collection has something to make you shine.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/teal_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667d_01-mwsaxIUrxuAcQMhQa3JEVn4BipvB6o.webp",
    products: [
      {
        id: 3,
        name: "Royal Blue Embroidered Blouse",
        price: 15999,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/indigo_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667i_01-NPQpXwvaebwWLqaRYDtX0TUXJ230a6.webp",
        isNew: true,
      },
      {
        id: 4,
        name: "Teal Embroidered Blouse",
        price: 15999,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/teal_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667d_01-mwsaxIUrxuAcQMhQa3JEVn4BipvB6o.webp",
        isNew: false,
      },
      {
        id: 6,
        name: "Cream Floral Embroidered Blouse",
        price: 16999,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cream_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667c_01-jvqcLo9vcEAdWZvLuJ219AtQPyB7FX.webp",
        isNew: false,
      },
      {
        id: 8,
        name: "Chanderi Cotton Saree",
        price: 9999,
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg",
        isNew: true,
      },
    ],
  },
]

export default function CollectionDetail({ id }: { id: string }) {
  const collection = collections.find((c) => c.id === id) || collections[0]
  const { toast } = useToast()

  const addToWishlist = (e: React.MouseEvent, productId: number) => {
    e.preventDefault()
    e.stopPropagation()
    toast({
      title: "Added to wishlist",
      description: "This product has been added to your wishlist.",
    })
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/collections" className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to collections
          </Link>
        </Button>
      </div>

      <div className="mb-12">
        <div className="relative aspect-[16/9] mb-6 rounded-lg overflow-hidden">
          <Image src={collection.image || "/placeholder.svg"} alt={collection.name} fill className="object-cover" />
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-serif mb-4">{collection.name}</h1>
          <p className="text-muted-foreground text-lg">{collection.description}</p>
          <p className="text-muted-foreground mt-4">{collection.longDescription}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {collection.products.map((product) => (
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
      </div>
    </div>
  )
}

