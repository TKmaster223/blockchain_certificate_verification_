import { LogOut } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";

export function TopBar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">Certificate Verification System</p>
        <h2 className="text-lg font-semibold text-slate-900">Welcome back, {user?.username ?? ""}</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden text-right text-sm md:block">
          <p className="font-semibold text-slate-900">{user?.email}</p>
          <p className="capitalize text-slate-500">Role: {user?.role}</p>
        </div>
        <Button variant="outline" onClick={logout} leftIcon={<LogOut className="h-4 w-4" />}>Logout</Button>
      </div>
    </header>
  );
}
