import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ProductCard from '../components/ProductCard'
import { BrowserRouter } from 'react-router-dom'

const renderProductCard = (props: any) => {
  return render(
    <BrowserRouter>
      <ProductCard {...props} />
    </BrowserRouter>
  )
}

describe('ProductCard Component', () => {
  const mockProduct = {
    id: 1,
    name: 'Floral Summer Dress',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/dress',
    rating: 4.5
  }

  it('renders product details correctly', () => {
    renderProductCard(mockProduct)
    
    expect(screen.getByText('Floral Summer Dress')).toBeInTheDocument()
    expect(screen.getByText('$89.99')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'View of Floral Summer Dress')
  })

  it('toggles wishlist state on click', () => {
    renderProductCard(mockProduct)
    
    const wishlistBtn = screen.getByLabelText('Add to wishlist')
    fireEvent.click(wishlistBtn)
    
    expect(screen.getByLabelText('Remove from wishlist')).toBeInTheDocument()
  })

  it('shows add to cart button on hover/focus', () => {
    renderProductCard(mockProduct)
    
    const addToCartBtn = screen.getByLabelText(`Add ${mockProduct.name} to cart`)
    // Normally hidden by CSS 'translate-y-full' but should be in document
    expect(addToCartBtn).toBeInTheDocument()
  })

  it('displays the correct star rating label', () => {
    renderProductCard(mockProduct)
    expect(screen.getByLabelText('Rated 4.5 out of 5 stars')).toBeInTheDocument()
  })
})
