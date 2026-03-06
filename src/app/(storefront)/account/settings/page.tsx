"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { User, Lock } from "lucide-react";
import { GoldButton } from "@/components/brand/gold-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    // Server action will be implemented later
    toast.success("Settings saved successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-espresso">Settings</h1>

      {/* Profile Section */}
      <div className="mb-8 rounded-xl bg-ivory p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-champagne-gold/10">
            <User className="h-4 w-4 text-champagne-gold" />
          </div>
          <h2 className="font-serif text-lg text-espresso">Profile</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-xs text-charcoal/60">Name</Label>
            <Input
              value={session?.user?.name ?? ""}
              readOnly
              className="mt-1 bg-warm-sand/10 text-espresso"
            />
          </div>
          <div>
            <Label className="text-xs text-charcoal/60">Email</Label>
            <Input
              value={session?.user?.email ?? ""}
              readOnly
              className="mt-1 bg-warm-sand/10 text-espresso"
            />
          </div>
        </div>
      </div>

      {/* Password Section */}
      <div className="rounded-xl bg-ivory p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-champagne-gold/10">
            <Lock className="h-4 w-4 text-champagne-gold" />
          </div>
          <h2 className="font-serif text-lg text-espresso">Change Password</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="current-password" className="text-xs text-charcoal/60">
              Current Password
            </Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="new-password" className="text-xs text-charcoal/60">
              New Password
            </Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="confirm-password" className="text-xs text-charcoal/60">
              Confirm New Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="mt-1"
              required
            />
          </div>

          <GoldButton type="submit">Save Changes</GoldButton>
        </form>
      </div>
    </div>
  );
}
