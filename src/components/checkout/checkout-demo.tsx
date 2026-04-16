"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  CreditCard,
  Building2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Bot,
} from "lucide-react";

type Step = "cart" | "apply" | "approved" | "confirmed" | "lifecycle";

const CART_ITEMS = [
  { name: "Industrial Hydraulic Press HP-4500", qty: 2, price: 18750 },
  { name: "Precision CNC Router Bits (Set of 24)", qty: 5, price: 1250 },
  { name: "Stainless Steel Sheet 304 (4x8 ft)", qty: 50, price: 285 },
];

export function CheckoutDemo() {
  const [step, setStep] = useState<Step>("cart");
  const subtotal = CART_ITEMS.reduce((s, i) => s + i.qty * i.price, 0);
  const tax = Math.round(subtotal * 0.0825);
  const total = subtotal + tax;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-6 flex items-center gap-2">
        {(["cart", "apply", "approved", "confirmed", "lifecycle"] as Step[]).map(
          (s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  step === s
                    ? "bg-[#1DB954]/100 text-white"
                    : (["cart", "apply", "approved", "confirmed", "lifecycle"].indexOf(step) > i)
                      ? "bg-[#1DB954] text-white"
                      : "bg-[#262626] text-[#9ca3af]"
                }`}
              >
                {(["cart", "apply", "approved", "confirmed", "lifecycle"].indexOf(step) > i) ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  i + 1
                )}
              </div>
              {i < 4 && (
                <div
                  className={`h-px w-8 ${
                    (["cart", "apply", "approved", "confirmed", "lifecycle"].indexOf(step) > i) ? "bg-[#1DB954]" : "bg-[#262626]"
                  }`}
                />
              )}
            </div>
          )
        )}
      </div>

      {/* Step: Cart */}
      {step === "cart" && (
        <Card className="border border-[#262626] ">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5 text-[#6b7280]" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-[#161616] p-3">
              <p className="text-xs font-semibold text-[#9ca3af] uppercase mb-2">
                Seller: Summit Industrial Supply
              </p>
              {CART_ITEMS.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[#262626] last:border-0">
                  <div>
                    <p className="text-sm font-medium text-[#fafafa]">{item.name}</p>
                    <p className="text-xs text-[#6b7280]">Qty: {item.qty}</p>
                  </div>
                  <p className="text-sm font-bold text-white">
                    ${(item.qty * item.price).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-[#9ca3af]">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#9ca3af]">
                <span>Tax (8.25%)</span>
                <span>${tax.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>
            <div className="rounded-lg border-2 border-[#1DB954]/20 bg-[#1DB954]/10 p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-[#1DB954]/100">
                  <span className="text-xs font-bold text-white">B</span>
                </div>
                <span className="text-sm font-bold text-[#1DB954]">
                  Pay with Backd Net Terms
                </span>
              </div>
              <p className="text-xs text-[#1DB954]">
                Get approved in seconds. Pay in 30, 60, or 90 days. No interest on Net 30.
              </p>
            </div>
            <Button
              className="w-full bg-[#1DB954]/100 hover:bg-[#1ed760]"
              onClick={() => setStep("apply")}
            >
              Apply for Net Terms
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step: Apply */}
      {step === "apply" && (
        <Card className="border border-[#262626] ">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5 text-[#6b7280]" />
              Business Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Business Name</Label>
                <Input defaultValue="Apex Machine Works" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">EIN</Label>
                <Input defaultValue="82-*******" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Annual Revenue</Label>
                <Input defaultValue="$4.2M" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Years in Business</Label>
                <Input defaultValue="8" className="mt-1" />
              </div>
            </div>
            <div className="rounded-lg border border-[#262626] bg-[#161616] p-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#1DB954]" />
                <span className="text-xs text-[#9ca3af]">
                  Instant verification via Backd&apos;s proprietary underwriting engine. No hard credit pull.
                </span>
              </div>
            </div>
            <Button
              className="w-full bg-[#1DB954]/100 hover:bg-[#1ed760]"
              onClick={() => setStep("approved")}
            >
              Verify & Get Decision
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step: Approved */}
      {step === "approved" && (
        <Card className="border border-[#262626] ">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-[#1DB954]">
              <CheckCircle className="h-5 w-5" />
              Approved!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border-2 border-[#1DB954]/20 bg-[#1DB954]/10 p-4 text-center">
              <p className="text-2xl font-bold text-[#1DB954]">
                $50,000 Credit Line
              </p>
              <p className="text-sm text-[#1DB954]">Approved in 3.2 seconds</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#9ca3af] uppercase">Choose Your Terms</p>
              {[
                { term: "Net 30", rate: "0%", monthly: total, highlight: true },
                { term: "Net 60", rate: "1.5%", monthly: Math.round(total * 1.015), highlight: false },
                { term: "Net 90", rate: "2.5%", monthly: Math.round(total * 1.025), highlight: false },
              ].map((opt) => (
                <button
                  key={opt.term}
                  className={`flex w-full items-center justify-between rounded-lg border-2 p-3 text-left transition-colors ${
                    opt.highlight
                      ? "border-[#1DB954] bg-[#1DB954]/10"
                      : "border-[#262626] hover:border-[#3a3a3a]"
                  }`}
                  onClick={() => setStep("confirmed")}
                >
                  <div>
                    <p className="text-sm font-bold text-white">{opt.term}</p>
                    <p className="text-xs text-[#9ca3af]">{opt.rate} fee</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">
                      ${opt.monthly.toLocaleString()}
                    </p>
                    {opt.highlight && (
                      <Badge className="bg-[#1DB954]/100 text-white text-[9px]">
                        RECOMMENDED
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Confirmed */}
      {step === "confirmed" && (
        <Card className="border border-[#262626] ">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-[#1DB954]">
              <CheckCircle className="h-5 w-5" />
              Order Confirmed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-[#1DB954]/10 p-4 text-center">
              <p className="text-lg font-bold text-[#1DB954]">
                Net 30 Terms Applied
              </p>
              <p className="text-sm text-[#1DB954]">
                ${total.toLocaleString()} due by{" "}
                {new Date(Date.now() + 30 * 86400000).toLocaleDateString()}
              </p>
            </div>
            <div className="rounded-lg border border-[#262626] bg-[#161616] p-3 space-y-2 text-xs text-[#9ca3af]">
              <p><strong>Seller:</strong> Summit Industrial Supply — paid upfront by Backd</p>
              <p><strong>Buyer:</strong> Apex Machine Works — payment due in 30 days</p>
              <p><strong>CollectIQ Agent:</strong> Now monitoring this invoice for on-time payment</p>
            </div>
            <Button
              className="w-full"
              onClick={() => setStep("lifecycle")}
            >
              See What Happens Next
              <Bot className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step: Lifecycle */}
      {step === "lifecycle" && (
        <Card className="border border-[#262626] ">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-5 w-5 text-[#1DB954]" />
              CollectIQ Takes Over
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-[#9ca3af]">
              This is where Backd&apos;s risk begins — and where CollectIQ&apos;s value starts.
              The AI agent now monitors this buyer and invoice through the entire payment lifecycle:
            </p>
            <div className="space-y-2">
              {[
                { day: "Day 1", action: "Invoice issued. Agent begins behavioral monitoring.", icon: "📋" },
                { day: "Day 20", action: "Agent analyzes buyer payment patterns. No risk signals detected.", icon: "🔍" },
                { day: "Day 25", action: "Proactive reminder sent. Tone calibrated based on buyer history.", icon: "📧" },
                { day: "Day 28", action: "Payment received via ACH. Agent confirms and closes monitoring.", icon: "✅" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-[#1DB954]/20 bg-[#1DB954]/10 p-3"
                >
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-[#fafafa]">{item.day}</p>
                    <p className="text-xs text-[#9ca3af]">{item.action}</p>
                  </div>
                </div>
              ))}
            </div>
            <Separator />
            <p className="text-xs text-[#9ca3af] italic">
              But what happens when buyers don&apos;t pay on time? That&apos;s where the
              Collections Engine shines. See the showcase cases for real examples.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("cart")}>
                Restart Demo
              </Button>
              <a
                href="/collections"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-[#1DB954]/100 px-4 text-sm font-medium text-white hover:bg-[#1ed760] transition-colors"
              >
                View Collections Engine
              </a>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
