import { NavLink } from "react-router-dom";
import clsx from "classnames";
import { useAuth } from "../../hooks/useAuth";

const baseLinkClasses = "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition";
const activeClasses = "bg-primary-100 text-primary-700";
const inactiveClasses = "text-slate-600 hover:bg-slate-100 hover:text-slate-900";

interface NavItem {
  label: string;
  to: string;
  icon?: string;
  roles?: Array<"admin" | "issuer" | "user">;
}

const navItems: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: "📊" },
  { label: "All Certificates", to: "/certificates", icon: "📄" },
  { label: "Issue Certificate", to: "/certificates/issue", icon: "📝", roles: ["admin", "issuer"] },
  { label: "Verify Certificate", to: "/certificates/verify", icon: "🔍" },
  { label: "User Management", to: "/users", icon: "🛡️", roles: ["admin"] },
];

export function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-slate-200 bg-white/80 backdrop-blur md:flex">
      <div className="flex h-full w-full flex-col gap-6 px-5 py-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">Certificate Vault</p>
          <h1 className="text-2xl font-bold text-slate-900">Control Center</h1>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {navItems
            .filter((item) => !item.roles || (user && item.roles.includes(user.role)))
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => clsx(baseLinkClasses, isActive ? activeClasses : inactiveClasses)}
              >
                <span className="text-lg" aria-hidden>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </NavLink>
            ))}
        </nav>

        {user ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
            <p className="font-medium text-slate-900">Logged in as</p>
            <p>{user.username}</p>
            <p className="capitalize">Role: {user.role}</p>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
