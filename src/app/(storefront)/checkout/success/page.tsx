import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { stripe } from "@/lib/stripe";
import { GoldButton } from "@/components/brand/gold-button";
import { formatCurrency } from "@/lib/utils";

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage(props: SuccessPageProps) {
  const searchParams = await props.searchParams;
  const sessionId = searchParams.session_id;

  let session = null;

  if (sessionId) {
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items"],
      });
    } catch {
      // Session retrieval failed — still show a generic confirmation
    }
  }

  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 overflow-hidden">
      {/* Confetti-like gold dots */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="absolute animate-confetti-dot rounded-full opacity-0"
            style={{
              width: `${4 + Math.random() * 6}px`,
              height: `${4 + Math.random() * 6}px`,
              left: `${5 + Math.random() * 90}%`,
              top: `-10px`,
              backgroundColor:
                i % 3 === 0
                  ? "var(--color-champagne-gold)"
                  : i % 3 === 1
                    ? "var(--color-amber)"
                    : "var(--color-warm-sand)",
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Confirmation content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-champagne-gold/10">
          <CheckCircle2 className="h-12 w-12 text-champagne-gold" />
        </div>

        <h1 className="mb-2 font-serif text-4xl text-espresso">Thank You!</h1>
        <p className="mb-6 max-w-md text-charcoal/60">
          Your order has been placed successfully. We&apos;ll send you a
          confirmation email with your order details shortly.
        </p>

        {session && (
          <div className="mb-8 w-full max-w-sm rounded-xl bg-ivory p-6 shadow-sm">
            {session.metadata?.orderNumber && (
              <div className="mb-3 text-sm text-charcoal/60">
                <span className="font-medium text-espresso">Order #: </span>
                {session.metadata.orderNumber}
              </div>
            )}
            {session.amount_total != null && (
              <div className="text-sm text-charcoal/60">
                <span className="font-medium text-espresso">Total: </span>
                {formatCurrency(session.amount_total / 100)}
              </div>
            )}
            {session.customer_details?.email && (
              <div className="mt-3 text-sm text-charcoal/60">
                <span className="font-medium text-espresso">
                  Confirmation sent to:{" "}
                </span>
                {session.customer_details.email}
              </div>
            )}
          </div>
        )}

        <Link href="/products">
          <GoldButton size="lg">Continue Shopping</GoldButton>
        </Link>
      </div>

      {/* CSS animation for confetti dots */}
      <style>{`
        @keyframes confetti-fall {
          0% {
            opacity: 0;
            transform: translateY(0) rotate(0deg);
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(80vh) rotate(720deg);
          }
        }
        .animate-confetti-dot {
          animation: confetti-fall linear infinite;
        }
      `}</style>
    </div>
  );
}
