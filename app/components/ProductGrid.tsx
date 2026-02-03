import { client } from "@/lib/shopify/serverClient";
import { getCollectionProducts } from "@/lib/shopify/graphql/query";
import { ProductCard } from "./ProductCard";
import type { GetCollectionProductsQuery } from "@/lib/shopify/graphql/.generated/storefront.generated";

type ProductGridProps = {
  collectionHandle: string;
};

/**
 * Server component that fetches and renders a grid of products from a Shopify collection
 */
export async function ProductGrid({ collectionHandle }: ProductGridProps) {
  try {
    const variables = {
      handle: collectionHandle,
      first: 12,
    };

    const response = await client.request(
      getCollectionProducts,
      { variables }
    );

    // Log detailed error info for debugging
    if (response.errors) {
      console.error('GraphQL Errors:', JSON.stringify(response.errors, null, 2));
      return (
        <div className="py-12 text-center">
          <p className="text-red-500 dark:text-red-400">
            Error fetching products. Check console for details.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Collection handle: &quot;{collectionHandle}&quot;
          </p>
        </div>
      );
    }

    const collection = response.data?.collection;
    const products = collection?.products.nodes ?? [];

    if (products.length === 0) {
      return (
        <div className="py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No products found in this collection.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Collection handle: &quot;{collectionHandle}&quot;
          </p>
        </div>
      );
    }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      {collection?.title && (
        <h1 className="text-3xl font-bold mb-8 text-center">
          {collection.title}
        </h1>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {products.map((product: NonNullable<GetCollectionProductsQuery["collection"]>["products"]["nodes"][number]) => (
          <ProductCard
            key={product.id}
            id={product.id}
            handle={product.handle}
            title={product.title}
            featuredImage={product.featuredImage}
            priceRange={product.priceRange}
            compareAtPriceRange={product.compareAtPriceRange}
          />
        ))}
      </div>
    </div>
  );
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return (
      <div className="py-12 text-center">
        <p className="text-red-500 dark:text-red-400">
          Failed to connect to Shopify
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </p>
      </div>
    );
  }
}
