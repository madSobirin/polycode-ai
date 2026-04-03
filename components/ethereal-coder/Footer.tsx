const footerLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Security", href: "#" },
];

const Footer = () => {
  return (
    <footer className="flex justify-between items-center w-full px-8 py-6 bg-white border-t border-slate-100">
      <div className="text-xs text-slate-400">
        © 2024 Ethereal Precision Framework. All rights reserved.
      </div>
      <div className="flex gap-6">
        {footerLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-xs text-slate-400 hover:text-blue-500 transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
