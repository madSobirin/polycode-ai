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
        <div className="hidden md:block shrink-0">
           <Sidebar />
        </div>
        <main className="flex-1 flex flex-col overflow-hidden bg-white/50 min-w-0">
          <TopNav />
          <div className="flex-1 overflow-y-auto lg:overflow-hidden p-4 lg:p-8">
            <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 h-full min-w-0">
              <SourceSchema />
              <CodePreview />
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </GenerateProvider>
  );
};

export default Home;
