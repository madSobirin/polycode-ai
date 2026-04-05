import Link from "next/link";
import { Mail, ChevronRight } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";

export default function RegisterPage() {
  return (
    <AuthLayout>
      {/* Content Header */}
      <div className="mt-4 mb-8">
        <h2 className="text-2xl font-bold text-[#191c1d]">Create account</h2>
        <p className="text-[#424754] text-sm mt-1">
          Begin your engineering journey
        </p>
      </div>

      {/* Tab Toggle */}
      <div className="flex bg-[#f3f4f5] p-1 rounded-lg mb-8">
        <Link
          href="/login"
          className="flex-1 py-2 text-sm font-semibold rounded-md transition-all text-center text-[#424754] hover:text-[#191c1d]"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="flex-1 py-2 text-sm font-semibold rounded-md transition-all text-center bg-white shadow-sm text-[#0058be]"
        >
          Sign Up
        </Link>
      </div>

      {/* Social Login */}
      <button className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#ffffff] ghost-border rounded-xl text-[#191c1d] font-medium hover:bg-[#f3f4f5] transition-colors mb-6 group">
        <svg
          className="w-5 h-5 group-hover:scale-105 transition-transform"
          viewBox="0 0 24 24"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          ></path>
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          ></path>
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          ></path>
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-5.38z"
            fill="#EA4335"
          ></path>
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div className="relative flex items-center mb-6">
        <div className="grow border-t border-[#c2c6d6]/30"></div>
        <span className="shrink flex items-center gap-1 mx-4 text-xs font-medium text-[#727785] uppercase tracking-widest">
          <Mail className="w-3.5 h-3.5" />
          or email
        </span>
        <div className="grow border-t border-[#c2c6d6]/30"></div>
      </div>

      {/* Form */}
      <form className="space-y-5">
        <div className="space-y-1.5">
          <label
            className="text-xs font-bold text-[#424754] ml-1"
            htmlFor="name"
          >
            FULL NAME
          </label>
          <div className="relative">
            <input
              className="w-full bg-[#f3f4f5] border-0 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#0058be]/10 focus:bg-[#ffffff] transition-all outline-none"
              id="name"
              placeholder="John Doe"
              type="text"
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
              className="w-full bg-[#f3f4f5] border-0 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#0058be]/10 focus:bg-[#ffffff] transition-all outline-none"
              id="email"
              placeholder="name@company.com"
              type="email"
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
              className="w-full bg-[#f3f4f5] border-0 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#0058be]/10 focus:bg-[#ffffff] transition-all outline-none"
              id="password"
              placeholder="••••••••"
              type="password"
            />
          </div>
        </div>

        <button
          className="w-full flex items-center justify-center gap-2 signature-gradient text-[#ffffff] font-bold py-3.5 rounded-xl mt-4 shadow-lg shadow-[#0058be]/20 hover:scale-[1.01] active:scale-[0.98] transition-all"
          type="submit"
        >
          Create Workspace
          <ChevronRight className="w-4 h-4" />
        </button>
      </form>
    </AuthLayout>
  );
}
