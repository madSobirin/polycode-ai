import {
  Sidebar,
  TopNav,
  SourceSchema,
  CodePreview,
  Footer,
} from "@/components/ethereal-coder";

const Home = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/30">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white/50">
        {/* Top Navigation */}
        <TopNav />

        {/* Page Content */}
        <div className="flex-1 flex p-8 gap-8 overflow-hidden">
          {/* Left Column: Source Schema */}
          <SourceSchema />

          {/* Right Column: Code Preview */}
          <CodePreview />
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default Home;
