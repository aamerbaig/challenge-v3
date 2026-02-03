import { client } from "@/lib/shopify/serverClient";
import { getProductByHandle } from "@/lib/shopify/graphql/query";
import { NextResponse } from "next/server";

type GraphQLError = {
  message?: string;
  extensions?: unknown;
  locations?: unknown;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;

  try {
    const variables = {
      handle,
    };

    const response = await client.request(
      getProductByHandle,
      { variables }
    );

    // Check for GraphQL errors first (following ProductGrid.tsx pattern)
    if (response.errors) {
      // Extract serializable error details
      const graphQLErrors = response.errors.graphQLErrors || [];
      const errorDetails = graphQLErrors.map((err: GraphQLError) => ({
        message: err?.message,
        extensions: err?.extensions,
        locations: err?.locations,
      }));

      console.error('GraphQL Errors:', JSON.stringify(response.errors, null, 2));
      console.error('GraphQL Error Details:', JSON.stringify(errorDetails, null, 2));
      
      return NextResponse.json(
        { 
          error: "Failed to fetch product",
          details: response.errors.message || "GraphQL query failed",
          graphQLErrors: errorDetails
        },
        { status: 500 }
      );
    }

    // Validate that data exists
    if (!response.data) {
      return NextResponse.json(
        { error: "Product data not found" },
        { status: 404 }
      );
    }

    // Check if product exists in the response
    if (!response.data.product) {
      return NextResponse.json(
        { error: `Product with handle "${handle}" not found` },
        { status: 404 }
      );
    }

    // Return only the serializable data
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
