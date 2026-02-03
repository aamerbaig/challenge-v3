import { client } from "@/lib/shopify/serverClient";

export async function GET() {
  try {
    const query = `#graphql
      query getCollections {
        collections(first: 10) {
          nodes {
            id
            handle
            title
          }
        }
      }
    `;
    
    const response = await client.request(query);
    return Response.json({ 
      collections: response.data?.collections?.nodes || [],
      errors: response.errors 
    });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
