import { CheckoutDemo } from "@/components/checkout/checkout-demo";

export default function CheckoutPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          B2B Net Terms Checkout
        </h1>
        <p className="mt-1 text-sm text-[#9ca3af]">
          Mock checkout flow showing how a B2B net terms transaction originates
          before the CollectIQ agent manages its lifecycle.
        </p>
      </div>
      <CheckoutDemo />
    </div>
  );
}
