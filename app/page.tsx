
import { ProductGrid } from "./components/ProductGrid";
import { ModalProvider } from "./components/ModalProvider";

/**
 * Home page displaying products from a Shopify collection
 * 
 * Note: Collection handle should be provided via environment variable
 * NEXT_PUBLIC_COLLECTION_HANDLE or defaults to "all"
 */
export default async function Home() {
  // TODO: Get collection handle from env or make configurable
  // For now, using "all" as default (common Shopify collection)
  const collectionHandle =
    process.env.NEXT_PUBLIC_COLLECTION_HANDLE || "all";

  return (
    <ModalProvider>
      <main className="min-h-screen bg-white dark:bg-black">
        <ProductGrid collectionHandle={collectionHandle} />
      </main>
    </ModalProvider>
  );
}
