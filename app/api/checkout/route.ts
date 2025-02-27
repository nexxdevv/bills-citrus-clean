import { NextResponse } from "next/server";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

if (!STRIPE_SECRET_KEY || !BASE_URL) {
  throw new Error("Missing environment variables: STRIPE_SECRET_KEY or NEXT_PUBLIC_BASE_URL");
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(req: Request) {
  try {
    const { product, userId, email, cart } = await req.json();

    if (!email || !userId) {
      return NextResponse.json({ error: "Missing userId or email" }, { status: 400 });
    }

    const metadata: Record<string, string | number> = { userId, email };
    const line_items = createLineItems(product, cart, metadata);

    if (!line_items.length) {
      return NextResponse.json({ error: "No valid product or cart provided" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      shipping_address_collection: { allowed_countries: ["US"] },
      customer_email: email,
      line_items,
      metadata,
      success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: error.message || "Failed to create checkout session" }, { status: 500 });
  }
}

/**
 * Creates line items for Stripe checkout session.
 * @param product - Single product (if applicable)
 * @param cart - Array of cart items (if applicable)
 * @param metadata - Metadata object to be updated
 * @returns An array of Stripe checkout line items
 */
function createLineItems(product: any, cart: any[], metadata: Record<string, string | number>) {
  if (Array.isArray(cart) && cart.length > 0) {
    return cart.map(item => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));
  }

  if (product) {
    metadata.productName = product.name;
    metadata.productImage = product.image;
    metadata.quantity = 1;

    return [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: product.image ? [product.image] : [],
          },
          unit_amount: product.price * 100,
        },
        quantity: 1,
      },
    ];
  }

  return [];
}
