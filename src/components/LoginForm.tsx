"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // Important: handle manually
    });

    if (res?.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError("Invalid email or password");
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 max-w-sm mx-auto">
      {/* Optional: Google SignIn */}
      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="w-full py-3 px-4 border border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition"
      >
        Continue with Google
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-gray-500">or</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="email"
          name="email"
          required
          defaultValue="demo@demo.com"
          placeholder="Email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 transition"
          disabled={isLoading}
        />

        <input
          type="password"
          name="password"
          required
          defaultValue="123456"
          placeholder="Password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 transition"
          disabled={isLoading}
        />

        {error && (
          <p className="text-red-600 text-sm text-center font-medium">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition disabled:opacity-60"
        >
          {isLoading ? "Signing in..." : "Login"}
        </button>
      </form>

      {/* Clean demo hint — not hard-coded login */}
      <div className="text-center text-sm text-gray-600">
        <p>Demo Account:</p>
        <p className="font-medium">demo@demo.com / 123456</p>
      </div>
    </div>
  );
}
