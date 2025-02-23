import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia"
})

export async function GET(req: Request) {
  const url = new URL(req.url)
  const sessionId = url.searchParams.get("session_id")

  if (!sessionId) {
    return NextResponse.json(
      { error: "Session ID is required" },
      { status: 400 }
    )
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price.product"]
    })

    const order = {
      id: session.id,
      total: session.amount_total! / 100, // Convert cents to dollars
      customer_name: session.customer_details?.name ?? "Unknown",
      email: session.customer_email,
      product_name:
        session.line_items?.data[0]?.price.product.name ?? "Unknown",
      product_image:
        session.line_items?.data[0]?.price.product.images?.[0] ?? "",
      quantity:  1
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error("Error fetching session details:", error)
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    )
  }
}
