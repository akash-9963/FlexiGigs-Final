import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) return;

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage({ text: "Payment succeeded!", type: "success" });
          break;
        case "processing":
          setMessage({ text: "Your payment is processing.", type: "info" });
          break;
        case "requires_payment_method":
          setMessage({ text: "Your payment was not successful, please try again.", type: "error" });
          break;
        default:
          setMessage({ text: "Something went wrong.", type: "error" });
          break;
      }
    });
  }, [stripe]);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // General email regex
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    // Validate the email input
    if (!validateEmail(email)) {
      setMessage({ text: "Please enter a valid email address.", type: "error" });
      return;
    }

    setIsLoading(true);
    setMessage(null); // Clear previous messages

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/success",
      },
    });

    if (error) {
      setMessage({
        text: error.type === "card_error" || error.type === "validation_error" ? error.message : "An unexpected error occurred.",
        type: "error",
      });
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="w-96">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="border rounded-md p-2 w-full mb-4"
      />
      <PaymentElement id="payment-element" />
      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="border text-lg font-semibold px-5 py-3 border-[#1DBF73] bg-[#1DBF73] text-white rounded-md mt-5 w-full"
      >
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && (
        <div id="payment-message" className={message.type === "error" ? "text-red-500" : message.type === "success" ? "text-green-500" : "text-gray-700"} aria-live="polite">
          {message.text}
        </div>
      )}
    </form>
  );
}
