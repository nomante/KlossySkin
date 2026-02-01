"use client";

import { useState, Suspense, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in as admin, redirect to admin
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const userRole = (session.user as any)?.role;
      console.log("Already authenticated with role:", userRole);
      if (userRole === "admin") {
        router.push("/admin");
      }
    }
  }, [status, session, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    console.log("Attempting sign in with email:", email);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/admin", // Force admin path
    });

    console.log("Sign in result:", result);

    setIsSubmitting(false);

    if (result?.error) {
      console.error("Sign in error:", result.error);
      setError("Invalid credentials. Please try again.");
      return;
    }

    if (result?.ok) {
      console.log("Sign in successful, redirecting to /admin");
      // Give the session a moment to update, then redirect to admin
      setTimeout(() => {
        router.push("/admin");
      }, 500);
    }
  };

  if (status === "loading") {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-3 sm:px-4 md:px-6 py-8 sm:py-10">
        <Card className="w-full max-w-md border-[#e2f3ef] shadow-sm">
          <CardContent className="p-5 sm:p-8 space-y-5 sm:space-y-6 text-center">
            <p className="text-[#2f5f56]">Loading...</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-3 sm:px-4 md:px-6 py-8 sm:py-10">
      <Card className="w-full max-w-md border-[#e2f3ef] shadow-sm">
        <CardContent className="p-5 sm:p-8 space-y-5 sm:space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#0b3b32]">Admin Login</h1>
            <p className="text-sm sm:text-base text-[#2f5f56]">Sign in to manage products</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-[#d9f0ea] focus-visible:ring-[#1e7864] h-10 sm:h-11 text-sm"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-[#d9f0ea] focus-visible:ring-[#1e7864] h-10 sm:h-11 text-sm"
            />
            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </p>
            )}
            <Button
              type="submit"
              className="w-full bg-[#1e7864] text-white hover:bg-[#008d6e] h-10 sm:h-11 text-sm sm:text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <LoginForm />
    </Suspense>
  );
}