"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChevronRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label
          className="text-xs font-bold text-[#424754] ml-1"
          htmlFor="email"
        >
          EMAIL ADDRESS
        </label>
        <input
          className="w-full bg-[#f3f4f5] border-0 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#0058be]/10 focus:bg-[#ffffff] transition-all outline-none"
          id="email"
          placeholder="name@company.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center px-1">
          <label
            className="text-xs font-bold text-[#424754]"
            htmlFor="password"
          >
            PASSWORD
          </label>
          <a
            className="text-xs font-semibold text-[#0058be] hover:text-[#2170e4] transition-colors"
            href="#"
          >
            Forgot?
          </a>
        </div>
        <input
          className="w-full bg-[#f3f4f5] border-0 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#0058be]/10 focus:bg-[#ffffff] transition-all outline-none"
          id="password"
          placeholder="••••••••"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <button
        className="w-full flex items-center justify-center gap-2 signature-gradient text-[#ffffff] font-bold py-3.5 rounded-xl mt-4 shadow-lg shadow-[#0058be]/20 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            Enter Workspace
            <ChevronRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
