import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/accounts', label: 'Hesaplar' },
  { to: '/stream', label: 'Yayın' },
  { to: '/logs', label: 'Loglar' }
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-red-500">Calik TV</h1>
          <p className="text-gray-400 text-sm">Yayın Yönetim Paneli</p>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block px-4 py-2 rounded transition-colors ${
                  isActive
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-700 pt-4 mt-4">
          <div className="px-4 py-2">
            <p className="text-gray-500 text-xs">OBS Stream Key:</p>
            <code className="text-gray-400 text-xs">calik-tv-2024</code>
          </div>

          <div className="px-4 py-2 mt-2">
            <p className="text-gray-400 text-sm">{user?.username}</p>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 text-sm mt-1"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
