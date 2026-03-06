"use client";

import { useState, type FormEvent } from "react";
import { GoldButton } from "@/components/brand/gold-button";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your email address.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }

    // TODO: Replace with server action / API call
    setSubmitted(true);
  }

  return (
    <section className="bg-espresso px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        {submitted ? (
          <div className="animate-fade-up">
            <h2 className="font-serif text-3xl text-champagne-gold sm:text-4xl">
              Thank You!
            </h2>
            <p className="mt-3 font-sans text-warm-sand">
              You&apos;re on the list. Watch your inbox for exclusive treasures.
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-serif text-3xl text-champagne-gold sm:text-4xl">
              Join the Treasure Hunt
            </h2>
            <p className="mt-3 font-sans text-warm-sand">
              Be first to discover new arrivals, exclusive deals, and styling
              tips.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="your@email.com"
                className="h-11 w-full max-w-xs rounded-full border border-champagne-gold/30 bg-espresso/80 px-5 font-sans text-sm text-warm-sand placeholder:text-warm-sand/50 focus:border-champagne-gold focus:outline-none focus:ring-2 focus:ring-champagne-gold/40 sm:w-72"
              />
              <GoldButton type="submit">Subscribe</GoldButton>
            </form>

            {error && (
              <p className="mt-3 animate-fade-in font-sans text-sm text-error">
                {error}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
