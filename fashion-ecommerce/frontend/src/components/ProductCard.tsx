import { useState } from 'react'
import { Heart, Star, ShoppingCart } from 'lucide-react'

interface ProductCardProps {
  id: number
  name: string
  price: number
  image?: string
  imageUrl?: string
  rating: number
  imageHover?: string
}

export default function ProductCard({ name, price, image, imageUrl, rating, imageHover }: ProductCardProps) {
  const displayImage = image || imageUrl || '/placeholder.svg'
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  return (
    <div className="group relative" role="group" aria-label={`Product: ${name}`}>
      {/* Image Container */}
      <div
        className="relative overflow-hidden bg-gray-100 rounded-lg mb-4 aspect-square cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        tabIndex={0}
      >
        <img
          src={isHovered && imageHover ? imageHover : displayImage}
          alt={`Premium view of ${name}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=400'
          }}
        />

        {/* Wishlist Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
          title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={20}
            className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-800'}
            aria-hidden="true"
          />
        </button>

        {/* Add to Cart Button */}
        <button 
          className="absolute bottom-0 left-0 right-0 bg-black text-white py-3 flex items-center justify-center gap-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 focus:translate-y-0"
          aria-label={`Add ${name} to cart`}
        >
          <ShoppingCart size={18} aria-hidden="true" />
          Add to Cart
        </button>
      </div>

      {/* Product Info */}
      <div>
        <p className="text-sm text-gray-600 mb-2">LUXURY BRAND</p>
        <h3 className="font-semibold text-lg mb-2 truncate">{name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3" aria-label={`Rated ${rating} out of 5 stars`}>
          <div className="flex gap-1" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2" aria-hidden="true">({rating})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2" aria-label={`Price: $${price}`}>
          <span className="font-bold text-lg">${price}</span>
          <span className="text-gray-400 line-through text-sm" aria-hidden="true">${(price * 1.2).toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
