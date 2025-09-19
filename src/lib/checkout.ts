import { Lesson } from "@/app/types/lesson";
import axios from "axios";

export const handleCheckout = async (lesson: Lesson) => { // Handle checkout process 
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/checkout`,{lesson}, // Pass the lesson data
      {
        headers: { "Content-Type": "application/json" }
      }
    );
    const data = res.data; 
    // console.log('Checkout:', data);
    if (data.url) {
      window.location.href = data.url; // Redirect to Stripe Checkout
    } else {
      alert("Something went wrong!");
    }
  } catch (err) {
    console.error("Checkout error:", err);
    alert("Checkout failed");
  }
};