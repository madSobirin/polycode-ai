"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

type FormState = "idle" | "loading" | "success" | "error";

export default function RegisterPage() {
  const router = useRouter();

  // Form data state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [formState, setFormState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      setFormState("error");
      setMessage("Semua field harus diisi");
      return;
    }

    if (password.length < 6) {
      setFormState("error");
      setMessage("Password minimal 6 karakter");
      return;
    }

    setFormState("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormState("error");
        setMessage(data.error || "Registrasi gagal");
        return;
      }

      // Success
      setFormState("success");
      setMessage("Akun berhasil dibuat! Redirecting...");

      // Redirect ke login setelah 1.5 detik
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch {
      setFormState("error");
      setMessage("Koneksi gagal. Coba lagi nanti.");
    }
  };

  return (
    <>
      {/* Status Message */}
      {message && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium mb-4 transition-all animate-in fade-in slide-in-from-top-2 ${
            formState === "error"
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
          }`}
        >
          {formState === "error" ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          {message}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label
            className="text-xs font-bold text-[#424754] ml-1"
            htmlFor="name"
            aria-label="Full Name"
          >
            FULL NAME
          </label>
          <div className="relative">
            <input
              className="w-full bg-[#f3f4f5] border-0 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#0058be]/10 focus:bg-[#ffffff] transition-all outline-none disabled:opacity-50"
              id="name"
              placeholder="Johan Liebert"
              name="name"
              type="text"
              required
              disabled={formState === "loading" || formState === "success"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            className="text-xs font-bold text-[#424754] ml-1"
            htmlFor="email"
          >
            EMAIL ADDRESS
          </label>
          <div className="relative">
            <input
              className="w-full bg-[#f3f4f5] border-0 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#0058be]/10 focus:bg-[#ffffff] transition-all outline-none disabled:opacity-50"
              id="email"
              placeholder="name@company.com"
              name="email"
              type="email"
              required
              disabled={formState === "loading" || formState === "success"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center px-1">
            <label
              className="text-xs font-bold text-[#424754]"
              htmlFor="password"
            >
              PASSWORD
            </label>
          </div>
          <div className="relative">
            <input
              className="w-full bg-[#f3f4f5] border-0 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#0058be]/10 focus:bg-[#ffffff] transition-all outline-none disabled:opacity-50"
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              required
              disabled={formState === "loading" || formState === "success"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          className="w-full flex items-center justify-center gap-2 signature-gradient text-[#ffffff] font-bold py-3.5 rounded-xl mt-4 shadow-lg shadow-[#0058be]/20 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
          type="submit"
          disabled={formState === "loading" || formState === "success"}
        >
          {formState === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating Account...
            </>
          ) : formState === "success" ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Account Created!
            </>
          ) : (
            <>
              Create Workspace
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </>
  );
}
