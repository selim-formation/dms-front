import { Search, Bell, User } from 'lucide-react';

export default function Navbar() {
  const navItems = ['Home', 'Documents', 'Reminders'];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="text-xl font-semibold">Acme</div>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${item === 'Home'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>
            <button className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}