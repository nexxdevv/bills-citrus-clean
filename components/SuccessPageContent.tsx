"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react" // Import Suspense

const SuccessPageContent = () => {
  // Separate component for content
  const searchParams = useSearchParams()
  const session_id = searchParams.get("session_id")
  const [orderSaved, setOrderSaved] = useState(false)

  useEffect(() => {
    if (!session_id || orderSaved) return

    const saveOrder = async () => {
      try {
        console.log("Saving order...")
        const res = await fetch(`/api/save-order?session_id=${session_id}`)
        if (res.ok) {
          setOrderSaved(true)
          console.log("Order saved successfully.")
        } else {
          console.error("Failed to save order:", res.status)
        }
      } catch (error) {
        console.error("Failed to save order:", error)
      }
    }

    saveOrder()
  }, [session_id, orderSaved])

  return (
    <div>
      <h1>Thank you for your order!</h1>
      <p>Your order has been successfully placed.</p>
      {/* Conditionally render content based on orderSaved */}
      {orderSaved && <p>Order details saved.</p>}
    </div>
  )
}

export default SuccessPageContent