import { GenerateProvider } from "@/components/GenerateContext";
import {
  Sidebar,
  TopNav,
  SourceSchema,
  CodePreview,
  Footer,
} from "@/components/ethereal-coder";

const Home = () => {
  return (
    <GenerateProvider>
      <div className="flex h-screen overflow-hidden bg-slate-50/30">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden bg-white/50">
          <TopNav />
          <div className="flex-1 flex p-8 gap-8 overflow-hidden">
            <SourceSchema />
            <CodePreview />
          </div>
          <Footer />
        </main>
      </div>
    </GenerateProvider>
  );
};

export default Home;
