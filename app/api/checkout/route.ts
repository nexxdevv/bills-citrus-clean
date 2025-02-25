import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // Consider using a better way to handle env vars
  apiVersion: "2025-01-27.acacia" // Use the latest API version (check Stripe docs for updates)
})

export async function POST(req: Request) {
  try {
    const { product, userId, email, cart } = await req.json()

    let line_items = []
    const metadata: {
      userId: any
      email: any
      cartItems: string | null
      productName?: string // Add this line
      productImage?: string // Add this line
      quantity?: number // Add this line
    } = { userId, email, cartItems: null as string | null } // Start building metadata

    if (cart && Array.isArray(cart) && cart.length > 0) {
      line_items = cart.map((item: any) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : []
          },
          unit_amount: item.price * 100
        },
        quantity: item.quantity
      }))

      // Add cart details to metadata
      metadata.cartItems = JSON.stringify(
        cart.map((item) => ({
          // Stringify cart items
          id: item.id, // Include product ID
          name: item.name,
          quantity: item.quantity,
          price: item.price
          // ... other relevant properties
        }))
      )
    } else if (product) {
      line_items = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              images: product.image ? [product.image] : []
            },
            unit_amount: product.price * 100
          },
          quantity: 1
        }
      ]
      metadata.productName = product.name
      metadata.productImage = product.image
      metadata.quantity = 1
    } else {
      return NextResponse.json(
        { error: "No valid product or cart provided" },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["US"]
      },
      customer_email: email,
      line_items,
      metadata, // Use the complete metadata object
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    // Type the error as any or Error
    console.error("Stripe checkout error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" }, // Send back the error message
      { status: 500 }
    )
  }
}
