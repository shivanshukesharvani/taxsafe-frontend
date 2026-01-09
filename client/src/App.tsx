import { Switch, Route } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";

// Pages
import Landing from "@/pages/Landing";
import Wizard from "@/pages/Wizard";
import Upload from "@/pages/Upload";
import Processing from "@/pages/Processing";
import Result from "@/pages/Result";
import NotFound from "@/pages/not-found";

// 🔥 API TEST IMPORT
import { analyzeTest } from "@/services/api";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />

      <Route path="/wizard">
        <Layout>
          <Wizard />
        </Layout>
      </Route>

      <Route path="/upload/:id">
        <Layout>
          <Upload />
        </Layout>
      </Route>

      <Route path="/processing/:id">
        <Layout>
          <Processing />
        </Layout>
      </Route>

      <Route path="/result/:id">
        <Layout>
          <Result />
        </Layout>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // ✅ TEMPORARY: Frontend → Backend connection test
  useEffect(() => {
    analyzeTest()
      .then((res) => {
        console.log("✅ BACKEND RESPONSE:", res);
      })
      .catch((err) => {
        console.error("❌ BACKEND ERROR:", err);
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
