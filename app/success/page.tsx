import React from "react"
import SuccessPageContent from "@/components/SuccessPageContent"
import { Suspense } from "react" // Import Suspense

const SuccessPage = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SuccessPageContent />
    </Suspense>
  )
}

export default SuccessPage
