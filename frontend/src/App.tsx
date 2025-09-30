import { Navigate, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import { ProtectedLayout } from "./components/layout/ProtectedLayout";
import { Spinner } from "./components/ui/Spinner";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { CertificatesPage } from "./pages/CertificatesPage";
import { IssueCertificatePage } from "./pages/IssueCertificatePage";
import { VerifyCertificatePage } from "./pages/VerifyCertificatePage";
import { UserManagementPage } from "./pages/UserManagementPage";

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <Spinner className="h-8 w-8 text-primary-600" />
        </div>
      }
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/certificates" element={<CertificatesPage />} />
          <Route path="/certificates/issue" element={<IssueCertificatePage />} />
          <Route path="/certificates/verify" element={<VerifyCertificatePage />} />
          <Route path="/users" element={<UserManagementPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
