"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/app/actions/orders";
import { GoldButton } from "@/components/brand/gold-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const statuses = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

interface OrderStatusFormProps {
  orderId: string;
  currentStatus: string;
  trackingNumber: string;
  notes: string;
}

export function OrderStatusForm({
  orderId,
  currentStatus,
  trackingNumber: initialTracking,
  notes: initialNotes,
}: OrderStatusFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(currentStatus);
  const [trackingNumber, setTrackingNumber] = useState(initialTracking);
  const [notes, setNotes] = useState(initialNotes);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      try {
        const res = await updateOrderStatus(
          orderId,
          status,
          trackingNumber || undefined,
          notes || undefined
        );
        if (res?.error) {
          toast.error(res.error);
          return;
        }
        toast.success("Order updated successfully.");
        router.refresh();
      } catch {
        toast.error("Failed to update order.");
      }
    });
  }

  return (
    <Card className="border-blush/50">
      <CardHeader>
        <CardTitle className="font-serif text-lg text-espresso">
          Update Order
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="trackingNumber">Tracking Number</Label>
              <Input
                id="trackingNumber"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Internal Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add internal notes about this order..."
            />
          </div>
          <GoldButton type="submit" size="sm" disabled={isPending}>
            {isPending ? "Updating..." : "Update Order"}
          </GoldButton>
        </form>
      </CardContent>
    </Card>
  );
}
