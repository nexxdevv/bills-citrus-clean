import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia",
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    // Retrieve the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price.product"],
    });

    if (!session || !session.metadata || !session.metadata.userId) {
      return NextResponse.json(
        { error: "Invalid session or missing userId" },
        { status: 400 }
      );
    }

    const userId = session.metadata.userId;
    const email = session.customer_email;
    const totalAmount = session.amount_total! / 100;
    const lineItems = session.line_items?.data;

    if (!lineItems || lineItems.length === 0) {
      return NextResponse.json({ error: "No items found in session" }, { status: 400 });
    }

    // Get current date formatted
    const formattedDate = new Date().toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
    });

    // Save each item as a separate order entry in Firestore
    const orderPromises = lineItems.map(async (item) => {
      const product = item.price?.product as Stripe.Product;
      
      return addDoc(collection(db, "orders"), {
        id: session.id,
        customer_id: userId,
        customer_email: email,
        total: totalAmount,
        product_name: product.name,
        product_image: product.images?.[0] || null,
        quantity: item.quantity || 1,
        date: formattedDate,
      });
    });

    await Promise.all(orderPromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save orders:", error);
    return NextResponse.json({ error: "Failed to save orders" }, { status: 500 });
  }
}
