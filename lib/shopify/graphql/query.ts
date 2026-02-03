// ============================================================================
// GraphQL Fragments
// ============================================================================

/**
 * Core money fragment for consistent price formatting
 */
const MoneyFragment = `#graphql
  fragment Money on MoneyV2 {
    amount
    currencyCode
  }
` as const;

/**
 * Image fragment with responsive sizing
 */
const ImageFragment = `#graphql
  fragment Image on Image {
    id
    url
    altText
    width
    height
  }
` as const;

/**
 * Product variant fragment with all fields needed for selection logic
 */
const ProductVariantFragment = `#graphql
  fragment ProductVariant on ProductVariant {
    id
    title
    availableForSale
    quantityAvailable
    price {
      ...Money
    }
    compareAtPrice {
      ...Money
    }
    selectedOptions {
      name
      value
    }
    image {
      ...Image
    }
  }
` as const;

// ============================================================================
// Queries
// ============================================================================

/**
 * Fetch basic shop information
 */
export const getShop = `#graphql
  query getShop {
    shop {
      name
      description
    }
  }
` as const;

/**
 * Fetch products from a collection for the product listing grid
 * Returns minimal data needed for product cards
 */
export const getCollectionProducts = `#graphql
  fragment Money on MoneyV2 {
    amount
    currencyCode
  }

  fragment Image on Image {
    id
    url
    altText
    width
    height
  }

  query getCollectionProducts($handle: String!, $first: Int = 12) {
    collection(handle: $handle) {
      id
      title
      description
      products(first: $first) {
        nodes {
          id
          handle
          title
          description
          featuredImage {
            ...Image
          }
          priceRange {
            minVariantPrice {
              ...Money
            }
            maxVariantPrice {
              ...Money
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              ...Money
            }
            maxVariantPrice {
              ...Money
            }
          }
          options {
            name
            values
          }
          variants(first: 1) {
            nodes {
              availableForSale
            }
          }
        }
      }
    }
  }
` as const;

/**
 * Fetch full product details for the Quick View modal
 * Includes all variants, options, and images for variant selection
 */
export const getProductByHandle = `#graphql
  fragment Money on MoneyV2 {
    amount
    currencyCode
  }

  fragment Image on Image {
    id
    url
    altText
    width
    height
  }

  fragment ProductVariant on ProductVariant {
    id
    title
    availableForSale
    quantityAvailable
    price {
      ...Money
    }
    compareAtPrice {
      ...Money
    }
    selectedOptions {
      name
      value
    }
    image {
      ...Image
    }
  }

  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      vendor
      tags
      featuredImage {
        ...Image
      }
      images(first: 10) {
        nodes {
          ...Image
        }
      }
      options {
        id
        name
        values
      }
      priceRange {
        minVariantPrice {
          ...Money
        }
        maxVariantPrice {
          ...Money
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          ...Money
        }
        maxVariantPrice {
          ...Money
        }
      }
      variants(first: 100) {
        nodes {
          ...ProductVariant
        }
      }
    }
  }
` as const;
