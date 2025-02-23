import { NextResponse } from "next/server"
import Stripe from "stripe"
import { db } from "@/lib/firebase"
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia"
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 })
    }

    // Retrieve the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (!session || !session.metadata || !session.metadata.userId) {
      return NextResponse.json(
        { error: "Invalid session or missing userId" },
        { status: 400 }
      )
    }

    const userId = session.metadata.userId

    // Retrieve the user's document from Firestore
    const userRef = doc(db, "users", userId)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Save order details to Firestore
    const orderData = {
      id: session.id,
      total: session.amount_total! / 100,
      product_name: session.metadata.productName, // Store product name in metadata
      product_image: session.metadata.productImage, // Store product image in metadata
      quantity: session.metadata.quantity || 1,
      date: new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "2-digit"
      })
    }

    await updateDoc(userRef, {
      orders: arrayUnion(orderData)
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to save order:", error)
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 })
  }
}
