import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
export async function POST(req: Request) {
  try {
    const { lesson } = await req.json(); // Extract lesson data from request body
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "egp",
            product_data: {
              name: lesson.title,
            },
            unit_amount: lesson.price * 100, // price in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?lessonId=${lesson._id}`, // Redirect after successful payment to success page with lessonId as query param
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`, // Redirect if payment is cancelled
    });
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
