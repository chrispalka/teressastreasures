import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { generateOrderNumber } from "@/lib/utils";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Retrieve session with line items
        const fullSession = await stripe.checkout.sessions.retrieve(
          session.id,
          { expand: ["line_items.data.price.product"] }
        );

        const userId = fullSession.metadata?.userId;
        if (!userId) {
          console.error("No userId in session metadata");
          break;
        }

        const lineItems = fullSession.line_items?.data ?? [];
        const orderNumber = generateOrderNumber();

        // Calculate totals from the Stripe session
        const amountTotal = (fullSession.amount_total ?? 0) / 100;
        const amountSubtotal = (fullSession.amount_subtotal ?? 0) / 100;
        const shippingAmount =
          (fullSession.total_details?.amount_shipping ?? 0) / 100;
        const taxAmount =
          (fullSession.total_details?.amount_tax ?? 0) / 100;

        // If Stripe doesn't calculate tax, estimate at 8%
        const finalTax = taxAmount > 0 ? taxAmount : amountSubtotal * 0.08;
        const finalTotal =
          taxAmount > 0 ? amountTotal : amountSubtotal + shippingAmount + finalTax;

        // Build order items and decrement stock
        const orderItemsData: {
          productId: string;
          quantity: number;
          unitPrice: number;
          total: number;
          variantInfo: string | null;
        }[] = [];

        for (const lineItem of lineItems) {
          const product = lineItem.price?.product as Stripe.Product | undefined;
          const productId = product?.metadata?.productId;
          const quantity = lineItem.quantity ?? 1;
          const unitPrice = (lineItem.price?.unit_amount ?? 0) / 100;

          if (productId) {
            orderItemsData.push({
              productId,
              quantity,
              unitPrice,
              total: unitPrice * quantity,
              variantInfo: null,
            });

            // Decrement product stock
            await db.product.update({
              where: { id: productId },
              data: { stock: { decrement: quantity } },
            });
          }
        }

        // Create the order in the database
        await db.order.create({
          data: {
            orderNumber,
            userId,
            status: "PAID",
            subtotal: amountSubtotal,
            tax: finalTax,
            shipping: shippingAmount,
            total: finalTotal,
            stripeSessionId: session.id,
            stripePaymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id ?? null,
            items: {
              create: orderItemsData,
            },
          },
        });

        // Store order number in session metadata for the success page
        await stripe.checkout.sessions.update(session.id, {
          metadata: {
            ...fullSession.metadata,
            orderNumber,
          },
        });

        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId =
          typeof charge.payment_intent === "string"
            ? charge.payment_intent
            : charge.payment_intent?.id;

        if (paymentIntentId) {
          await db.order.updateMany({
            where: { stripePaymentIntentId: paymentIntentId },
            data: { status: "REFUNDED" },
          });
        }

        break;
      }

      default:
        // Unhandled event type
        break;
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
