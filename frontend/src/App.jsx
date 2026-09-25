import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AppShell from "./components/AppShell";

import Dashboard from "./pages/Dashboard";
import NewAnalysis from "./pages/NewAnalysis";
import AnalysisResults from "./pages/AnalysisResults";
import StandardDetails from "./pages/StandardDetails";

function App() {
  return (
    <BrowserRouter>

      <AppShell>

        <Routes>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/analysis/new"
            element={<NewAnalysis />}
          />

          <Route
            path="/analysis/:analysisId"
            element={<AnalysisResults />}
          />

          <Route
            path="/standard/:standardId"
            element={<StandardDetails />}
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>

      </AppShell>

    </BrowserRouter>
  );
}

export default App;