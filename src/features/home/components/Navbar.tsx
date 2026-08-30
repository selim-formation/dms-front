import { Search, Bell, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t } = useTranslation(['home', 'common']);
  const navItems = [
    { key: 'Home', label: t('common:nav.home') },
    { key: 'Documents', label: t('common:nav.documents') },
    { key: 'Reminders', label: t('deadNavbar.reminders') },
  ];

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="text-xl font-semibold">{t('deadNavbar.brand')}</div>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${item.key === 'Home'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-accent rounded-full transition-colors" aria-label={t('common:actions.search')}>
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="p-2 hover:bg-accent rounded-full transition-colors relative" aria-label={t('deadNavbar.notifications')}>
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 end-1 w-2 h-2 bg-info rounded-full"></span>
            </button>
            <button className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center" aria-label={t('deadNavbar.profile')}>
              <User className="w-5 h-5 text-background" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}