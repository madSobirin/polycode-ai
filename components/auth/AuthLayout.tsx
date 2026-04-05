import { ReactNode } from "react";
import { Inter, Manrope } from "next/font/google";
import { HelpCircle, Activity, FileText } from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#f8f9fa] ${inter.variable} ${manrope.variable} font-sans`}
    >
      {/* Custom Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .signature-gradient {
            background: linear-gradient(135deg, #0058be 0%, #2170e4 100%);
        }
        .ambient-shadow {
            box-shadow: 0 20px 40px rgba(25, 28, 29, 0.05);
        }
        .ghost-border {
            border: 1px solid rgba(194, 198, 214, 0.2);
        }
        h1, h2 {
            font-family: var(--font-manrope), sans-serif;
        }
      `,
        }}
      />

      {/* Abstract Background Detail */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0058be]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#924700]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Login/Register Card Container */}
      <div className="w-full max-w-[440px] z-10">
        <div className="bg-[#ffffff] rounded-xl ambient-shadow p-8 md:p-10 relative">
          {/* MacOS Style Controls */}
          <div className="absolute top-6 left-8 flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]/40"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#924700]/40"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#0058be]/40"></div>
          </div>

          {/* Inner Content (Login/Register Forms) */}
          {children}

          {/* Footer Text */}
          <p className="text-center text-xs text-[#424754] mt-8 leading-relaxed">
            By continuing, you agree to our{" "}
            <a
              className="underline decoration-[#c2c6d6]/50 underline-offset-2 hover:text-[#0058be] transition-colors"
              href="#"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              className="underline decoration-[#c2c6d6]/50 underline-offset-2 hover:text-[#0058be] transition-colors"
              href="#"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>

      {/* Minimalist Footer */}
      <footer className="mt-12 text-center z-10">
        <div className="flex gap-6 justify-center">
          <a
            className="flex items-center gap-1.5 text-xs font-medium text-[#727785] hover:text-[#0058be] transition-colors"
            href="#"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Support
          </a>
          <a
            className="flex items-center gap-1.5 text-xs font-medium text-[#727785] hover:text-[#0058be] transition-colors"
            href="#"
          >
            <Activity className="w-3.5 h-3.5" />
            System Status
          </a>
          <a
            className="flex items-center gap-1.5 text-xs font-medium text-[#727785] hover:text-[#0058be] transition-colors"
            href="#"
          >
            <FileText className="w-3.5 h-3.5" />
            Documentation
          </a>
        </div>
      </footer>
    </div>
  );
}
