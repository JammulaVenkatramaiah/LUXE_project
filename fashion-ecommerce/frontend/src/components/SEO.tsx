import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
}

const DEFAULT_SEO = {
  title: 'LUXE | Premium Fashion E-Commerce',
  description: 'Discover the latest trends in premium fashion. High-quality clothing and accessories for the modern lifestyle.',
  keywords: 'fashion, clothing, premium, luxury, style, ecommerce',
  image: 'https://images.unsplash.com/photo-1441984904556-0ac8d3d96e8d?w=1200&q=80',
  url: 'http://localhost:3000'
}

export default function SEO({ 
  title = DEFAULT_SEO.title, 
  description = DEFAULT_SEO.description, 
  keywords = DEFAULT_SEO.keywords,
  image = DEFAULT_SEO.image,
  url = DEFAULT_SEO.url
}: SEOProps) {
  const fullTitle = title === DEFAULT_SEO.title ? title : `${title} | LUXE`

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  )
}
