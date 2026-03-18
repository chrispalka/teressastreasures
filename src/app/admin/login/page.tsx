"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoldButton } from "@/components/brand/gold-button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-champagne-gold">
            Teressa&apos;s Admin
          </h1>
          <p className="mt-2 text-sm text-ivory/60">
            Sign in to manage your catalog
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="rounded-md bg-error/10 px-3 py-2 text-sm text-error">
              {error}
            </p>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-ivory/80">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-ivory/20 bg-charcoal text-ivory placeholder:text-ivory/30"
              placeholder="admin@teressastreasures.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-ivory/80">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-ivory/20 bg-charcoal text-ivory placeholder:text-ivory/30"
              placeholder="Enter your password"
            />
          </div>

          <GoldButton type="submit" disabled={isPending} className="w-full">
            {isPending ? "Signing in..." : "Sign In"}
          </GoldButton>
        </form>
      </div>
    </div>
  );
}
