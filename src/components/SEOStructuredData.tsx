import React, { useEffect } from 'react';
import { Product } from '../types';

interface SEOStructuredDataProps {
  products: Product[];
  selectedProduct?: Product | null;
}

export const DEFAULT_SEO_KEYWORDS = [
  '18k gold plated jewelry',
  'anti-tarnish jewelry',
  'luxury gift store India',
  'gold jewelry online',
  'kaira jewelry',
  'kairajewelry.in',
  'waterproof jewelry India',
  'hypoallergenic gold jewelry',
  '18k gold plated necklace',
  'gold chain online',
  'clover onyx set',
  'luxury gift hampers India',
  'daily wear gold jewelry',
  'non tarnish jewelry India',
  'gold plated earrings',
  'gold plated bracelets',
  'dainty gold jewelry',
  'minimal gold jewelry India',
  'Rakhi gifts for sister',
  'birthday jewelry gift box',
  '316L stainless steel jewelry',
].join(', ');

const DEFAULT_TITLE = 'KAIRA Jewellery | kairajewelry.in — 18k Gold Plated Jewelry Store';
const DEFAULT_DESC = 'Official KAIRA Jewellery Store (kairajewelry.in) - Premium 18k Gold Plated, Anti-Tarnish, Waterproof, Hypoallergenic Daily Wear & Gift Jewelry.';
const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=80';
const DEFAULT_URL = 'https://kairajewelry.in/';

const setMetaTag = (attrName: 'name' | 'property', attrValue: string, content: string) => {
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.content = content;
};

export const SEOStructuredData: React.FC<SEOStructuredDataProps> = ({
  products,
  selectedProduct,
}) => {
  // Update Meta, OpenGraph, and Twitter tags dynamically on document head
  useEffect(() => {
    if (selectedProduct) {
      const prodTitle = `${selectedProduct.name} | 18k Gold Plated — KAIRA Jewellery`;
      const prodDesc = `Buy ${selectedProduct.name} online at KAIRA Jewellery for ₹${selectedProduct.price}. ${selectedProduct.description} Waterproof, anti-tarnish, hypoallergenic 18k gold plated jewelry.`;
      const prodUrl = `https://kairajewelry.in/#product-${selectedProduct.id}`;
      const prodImg = selectedProduct.image || DEFAULT_OG_IMAGE;
      const productKeywords = [
        selectedProduct.name,
        `${selectedProduct.name} online India`,
        `18k gold plated ${selectedProduct.category}`,
        `anti-tarnish ${selectedProduct.category}`,
        DEFAULT_SEO_KEYWORDS,
      ].join(', ');

      document.title = prodTitle;
      setMetaTag('name', 'description', prodDesc);
      setMetaTag('name', 'keywords', productKeywords);

      // OpenGraph
      setMetaTag('property', 'og:title', `${selectedProduct.name} — 18k Gold Plated | KAIRA Jewellery`);
      setMetaTag('property', 'og:description', selectedProduct.description);
      setMetaTag('property', 'og:url', prodUrl);
      setMetaTag('property', 'og:image', prodImg);
      setMetaTag('property', 'og:image:secure_url', prodImg);
      setMetaTag('property', 'og:type', 'product');
      setMetaTag('property', 'product:price:amount', selectedProduct.price.toString());
      setMetaTag('property', 'product:price:currency', 'INR');

      // Twitter
      setMetaTag('name', 'twitter:title', `${selectedProduct.name} — KAIRA Jewellery`);
      setMetaTag('name', 'twitter:description', selectedProduct.description);
      setMetaTag('name', 'twitter:image', prodImg);
    } else {
      document.title = DEFAULT_TITLE;
      setMetaTag('name', 'description', DEFAULT_DESC);
      setMetaTag('name', 'keywords', DEFAULT_SEO_KEYWORDS);

      // OpenGraph Default
      setMetaTag('property', 'og:title', DEFAULT_TITLE);
      setMetaTag('property', 'og:description', DEFAULT_DESC);
      setMetaTag('property', 'og:url', DEFAULT_URL);
      setMetaTag('property', 'og:image', DEFAULT_OG_IMAGE);
      setMetaTag('property', 'og:image:secure_url', DEFAULT_OG_IMAGE);
      setMetaTag('property', 'og:type', 'website');

      // Twitter Default
      setMetaTag('name', 'twitter:title', DEFAULT_TITLE);
      setMetaTag('name', 'twitter:description', DEFAULT_DESC);
      setMetaTag('name', 'twitter:image', DEFAULT_OG_IMAGE);
    }
  }, [selectedProduct]);

  useEffect(() => {
    // 1. Catalog ItemList Schema JSON-LD
    const catalogSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'KAIRA Jewellery - 18k Gold Plated Collection',
      'description': 'Browse premium anti-tarnish, waterproof 18k gold plated jewelry at kairajewelry.in',
      'url': 'https://kairajewelry.in/',
      'keywords': DEFAULT_SEO_KEYWORDS,
      'numberOfItems': products.length,
      'itemListElement': products.map((prod, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'item': {
          '@type': 'Product',
          '@id': `https://kairajewelry.in/#product-${prod.id}`,
          'name': prod.name,
          'image': [prod.image, prod.hoverImage].filter(Boolean),
          'description': prod.description,
          'keywords': `18k gold plated jewelry, anti-tarnish jewelry, ${prod.name}, ${prod.category}`,
          'sku': prod.id,
          'category': prod.category,
          'brand': {
            '@type': 'Brand',
            'name': 'KAIRA Jewellery',
          },
          'offers': {
            '@type': 'Offer',
            'url': `https://kairajewelry.in/#product-${prod.id}`,
            'priceCurrency': 'INR',
            'price': prod.price,
            'priceValidUntil': '2027-12-31',
            'itemCondition': 'https://schema.org/NewCondition',
            'availability': prod.inStock
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            'seller': {
              '@type': 'Organization',
              'name': 'KAIRA Jewellery',
              'url': 'https://kairajewelry.in',
            },
          },
          'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': prod.rating.toString(),
            'reviewCount': prod.reviewCount.toString(),
            'bestRating': '5',
            'worstRating': '1',
          },
        },
      })),
    };

    let catalogScript = document.getElementById('jsonld-catalog') as HTMLScriptElement | null;
    if (!catalogScript) {
      catalogScript = document.createElement('script');
      catalogScript.id = 'jsonld-catalog';
      catalogScript.type = 'application/ld+json';
      document.head.appendChild(catalogScript);
    }
    catalogScript.text = JSON.stringify(catalogSchema);

    return () => {
      // Keep script in head for crawler consistency
    };
  }, [products]);

  // 2. Active Selected Product Schema JSON-LD
  useEffect(() => {
    let productScript = document.getElementById('jsonld-single-product') as HTMLScriptElement | null;

    if (selectedProduct) {
      const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `https://kairajewelry.in/#product-${selectedProduct.id}`,
        'name': selectedProduct.name,
        'image': [selectedProduct.image, selectedProduct.hoverImage].filter(Boolean),
        'description': selectedProduct.description,
        'keywords': `${selectedProduct.name}, 18k gold plated jewelry, anti-tarnish jewelry, ${selectedProduct.category}, luxury gift store India`,
        'sku': selectedProduct.id,
        'mpn': selectedProduct.id,
        'category': selectedProduct.category,
        'brand': {
          '@type': 'Brand',
          'name': 'KAIRA Jewellery',
        },
        'material': selectedProduct.specs?.material || '316L Stainless Steel 18k Gold Plated',
        'offers': {
          '@type': 'Offer',
          'url': `https://kairajewelry.in/#product-${selectedProduct.id}`,
          'priceCurrency': 'INR',
          'price': selectedProduct.price,
          'priceValidUntil': '2027-12-31',
          'itemCondition': 'https://schema.org/NewCondition',
          'availability': selectedProduct.inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          'seller': {
            '@type': 'Organization',
            'name': 'KAIRA Jewellery',
            'url': 'https://kairajewelry.in',
          },
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': selectedProduct.rating.toString(),
          'reviewCount': selectedProduct.reviewCount.toString(),
          'bestRating': '5',
          'worstRating': '1',
        },
      };

      if (!productScript) {
        productScript = document.createElement('script');
        productScript.id = 'jsonld-single-product';
        productScript.type = 'application/ld+json';
        document.head.appendChild(productScript);
      }
      productScript.text = JSON.stringify(productSchema);
    } else {
      if (productScript) {
        productScript.remove();
      }
    }
  }, [selectedProduct]);

  return null;
};

