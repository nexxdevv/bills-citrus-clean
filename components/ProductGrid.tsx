"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, limit } from "firebase/firestore"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"

type Product = {
  id: string
  name: string
  image: string
  weight: string
  price: number
}

const PRODUCTS_LIMIT = 2; // Define limit as a constant

export default function ProductGrid() {
  const { addItem } = useCart()
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Set loading to true before fetching
      setError(null); // Clear any previous errors

      try {
        const q = query(collection(db, "products"), limit(PRODUCTS_LIMIT));
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(productsData);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products."); // Set error message
      } finally {
        setLoading(false); // Set loading to false after fetch, regardless of success/failure
      }
    };

    fetchProducts();
  }, []);

  const handleBuyNow = async (product: Product) => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, userId: user?.uid, email: user?.email }),
      });

      if (!res.ok) { // Check for HTTP errors
        const errorData = await res.json(); // Try to get error details from the server
        throw new Error(errorData?.message || `HTTP error! status: ${res.status}`); // Throw an error with details
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      // Display a user-friendly error message, perhaps using a toast notification
      alert("An error occurred during checkout. Please try again later."); // Example: simple alert
    }
  };


  if (loading) {
    return <div>Loading products...</div>; // Display loading indicator
  }

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  return (
    <div className="max-w-screen-lg mx-auto px-5 pb-8 pt-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {products.map((product) => (
          <Card key={product.id} className="shadow-lg rounded-2xl overflow-hidden bg-card dark:bg-darkLight">
            <div className="relative w-full">
              <Image
                src={product.image}
                alt={product.name}
                height={400}
                width={400}
                className="rounded-t-xl aspect-square object-contain w-full"
                priority // Prioritize image loading
              />
            </div>

            <CardContent className="py-4 flex flex-col gap-1 items-start">
              <h2 className="text-xl font-semibold dark:text-white">{product.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{product.weight}</p>
              <p className="text-xl font-semibold dark:text-white">${product.price}</p>

              <div className="flex justify-between w-full mt-4 gap-4">
                <Button onClick={() => addItem(product)} className="flex-1 font-medium hover:bg-gray-800 transition rounded-xl py-3">
                  Add to Bag
                </Button>
                <Button onClick={() => handleBuyNow(product)} className="flex-1 font-medium bg-orange-500 text-white hover:bg-orange-400 transition rounded-xl py-3">
                  Buy Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}