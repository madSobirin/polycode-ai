import { LogIn } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "Documentation", href: "#" },
  { label: "Templates", href: "#" },
  { label: "API", href: "#" },
];

const TopNav = () => {
  return (
    <header className="flex justify-between items-center w-full px-8 py-4 bg-slate-50 border-b border-slate-100">
      {/* Brand */}
      <div className="text-xl font-black text-slate-900 font-[Manrope] tracking-tight">
        Ethereal Coder
      </div>

      {/* Center Links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-slate-500 font-[Manrope] font-bold tracking-tight text-sm hover:text-blue-500 transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-slate-500 font-[Manrope] font-bold tracking-tight text-sm hover:text-blue-500 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          Login
        </Link>
        <Link
          href="/register"
          className="px-5 py-2 bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-lg font-[Manrope] font-bold text-sm tracking-tight hover:opacity-90 active:opacity-80 transition-all shadow-md shadow-blue-500/20 cursor-pointer"
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
};

export default TopNav;
