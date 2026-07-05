import { Home, Search, PlusCircle, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserState } from '@/redux/hooks/useUser';

const NAV = [
  { label: 'Home',    icon: Home,        path: '/' },
  { label: 'Browse',  icon: Search,      path: '/product-listing' },
  { label: 'Post',    icon: PlusCircle,  path: '/requirement', primary: true },
  { label: 'Profile', icon: User,        path: '/account/profile' },
];

export default function MobileBottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useUserState();

  const isActive = (path) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-orange-100 shadow-[0_-2px_16px_rgba(234,88,12,0.08)]">
      <div className="flex items-center justify-around px-2 py-1 pb-safe">
        {NAV.map(({ label, icon: Icon, path, primary }) => {
          const active = isActive(path);
          if (primary) {
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="flex flex-col items-center -mt-5 active:scale-95 transition-transform"
              >
                <div className="w-14 h-14 rounded-full bg-orange-500 shadow-lg shadow-orange-200 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] font-semibold text-orange-500 mt-0.5">{label}</span>
              </button>
            );
          }
          return (
            <button
              key={path}
              onClick={() => navigate(label === 'Profile' && !user ? '/login' : path)}
              className="flex flex-col items-center gap-0.5 px-3 py-2 active:scale-95 transition-transform"
            >
              <Icon className={`w-5 h-5 ${active ? 'text-orange-500' : 'text-slate-400'}`} />
              <span className={`text-[10px] font-semibold ${active ? 'text-orange-500' : 'text-slate-400'}`}>
                {label}
              </span>
              {active && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-orange-500" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
