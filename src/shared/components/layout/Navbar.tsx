import { Link, useLocation } from '@tanstack/react-router';
import logo from '@/assets/logo.png';
import { useTenant } from '@/core/tenant/hooks/useTenant';
import { useAuth } from '@/core/auth/hooks/useAuth';
import RemindersDrawer from '@/features/documents/components/RemindersDrawer';

const navItems = [
  { label: 'Home', to: '/$tenant' as const },
  { label: 'Documents', to: '/$tenant/documents' as const },
  { label: 'Tasks', to: '/$tenant/tasks' as const },
];

export default function Navbar() {
  const tenant = useTenant();
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (to: string) => {
    const tenantId = tenant?.tenantId ?? '';
    if (to === '/$tenant') return location.pathname === `/${tenantId}` || location.pathname === `/${tenantId}/`;
    return location.pathname.startsWith(`/${tenantId}${to.replace('/$tenant', '')}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-3">
        {/* Brand */}
        <Link to="/$tenant" params={{ tenant: tenant?.tenantId ?? '' }} className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-20 w-auto object-contain" />
          {/* <span className="text-lg font-bold tracking-tight text-foreground">DMS</span> */}
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-1 rounded-full bg-card px-1.5 py-1.5 border border-border">
          {navItems.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                params={{ tenant: tenant?.tenantId ?? '' }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${active
                  ? 'bg-foreground text-card shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* <button className="flex h-9 w-9 items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">
            <Search className="h-4 w-4" />
          </button> */}
          {/* <button className="flex h-9 w-9 items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground transition-colors relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background" />
          </button> */}

          <RemindersDrawer />

          {user && (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-card text-xs font-bold">
              {user.name.split(' ').map((n) => n[0]).join('')}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
