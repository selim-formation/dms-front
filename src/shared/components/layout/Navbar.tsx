import { Link, useLocation } from '@tanstack/react-router';
<<<<<<< Updated upstream
import { Bell, Settings, User, Search } from 'lucide-react';

import armaLogo from '@/assets/arma-logo.png';
import { useTenant } from '@/core/tenant/hooks/useTenant';
import { useAuth } from '@/core/auth/hooks/useAuth';

const navItems = [
  { label: 'Home', path: '' },
  { label: 'Documents', path: '/documents' },
  { label: 'Tasks', path: '/tasks' },
  { label: 'Reminders', path: '/reminders' },
  // { label: 'Statistics', path: '/statistics' },
  // { label: 'AI Chat', path: '/ai-chat' },
  // { label: 'Settings', path: '/settings' },
=======
import { useTranslation } from 'react-i18next';
import logo from '@/assets/logo.png';
import { useTenant } from '@/core/tenant/hooks/useTenant';
import RemindersDrawer from '@/features/documents/components/RemindersDrawer';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { UserMenu } from '@/shared/components/layout/UserMenu';
import { usePermissions } from '@/core/auth/hooks/usePermissions';

const navItems = [
  { key: 'nav.home', to: '/$tenant' as const },
  { key: 'nav.documents', to: '/$tenant/documents' as const },
  { key: 'nav.favorites', to: '/$tenant/favorites' as const },
  { key: 'nav.tasks', to: '/$tenant/tasks' as const },
>>>>>>> Stashed changes
];

const SHARES_PERMISSIONS = ['read_document_shares', 'create_document_shares'] as const;

export default function Navbar() {
  const { t } = useTranslation('common');
  const tenant = useTenant();
  const location = useLocation();
  const { canAny } = usePermissions();

  const isActive = (path: string) => {
    const full = `/${tenant}${path}`;
    if (path === '') return location.pathname === `/${tenant}` || location.pathname === `/${tenant}/`;
    return location.pathname.startsWith(full);
  };

  const items = canAny([...SHARES_PERMISSIONS])
    ? [...navItems, { key: 'nav.documentShares', to: '/$tenant/document-shares' as const }]
    : navItems;

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-3">
        {/* Brand */}
        <Link to={`/${tenant}`} className="flex items-center gap-2">
          <img src={armaLogo} alt="Arma Logo" className="h-20 w-auto object-contain" />
          {/* <span className="text-lg font-bold tracking-tight text-foreground">DMS</span> */}
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-1 rounded-full bg-card px-1.5 py-1.5 border border-border">
<<<<<<< Updated upstream
          {navItems.map((item) => {
            const active = isActive(item.path);
=======
          {items.map((item) => {
            const active = isActive(item.to);
>>>>>>> Stashed changes
            return (
              <Link
                key={item.path}
                to={`/${tenant}${item.path}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  active
                    ? 'bg-foreground text-card shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">
            <Search className="h-4 w-4" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground transition-colors relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background" />
<<<<<<< Updated upstream
          </button>
          {user && (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-card text-xs font-bold">
              {user.name.split(' ').map((n) => n[0]).join('')}
            </div>
          )}
=======
          </button> */}

          <LanguageSwitcher />

          <ThemeToggle />

          <RemindersDrawer />

          <UserMenu />
>>>>>>> Stashed changes
        </div>
      </div>
    </header>
  );
}
