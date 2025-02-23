import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia", // Use a recent API version
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 1. Retrieve Customer ID (if available) - this is the best approach
    let customerId;
    try {
      const customers = await stripe.customers.list({
        email: email,
        limit: 1, // Expecting only 1 customer with the given email
      });

      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      }
    } catch (customerError) {
      console.error("Error retrieving customer:", customerError);
    }

    let charges;

    if (customerId) {
      // 2a. Fetch charges using customer ID (more efficient)
       charges = await stripe.charges.list({
          customer: customerId,
          limit: 10,  // Adjust limit as needed
        });
    } else {
      // 2b. If no customer ID, fetch all charges and filter (less efficient)
      charges = await stripe.charges.list({
        limit: 100, // Be careful with large limits!
      });

      charges.data = charges.data.filter(
        (charge) => charge.billing_details.email === email
      );
    }



    return NextResponse.json({ orders: charges.data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching Stripe charges:", error);
    return NextResponse.json(
      { error: "Failed to fetch Stripe charges" },
      { status: 500 }
    );
  }
}