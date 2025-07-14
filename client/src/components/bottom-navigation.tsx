import { useLocation } from "wouter";
import { Home, Rss, List, Download, Settings } from "lucide-react";

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/subscriptions", icon: Rss, label: "Subscriptions" },
    { path: "/queue", icon: List, label: "Queue" },
    { path: "/downloads", icon: Download, label: "Downloads" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-surface-dark dark:bg-surface-dark bg-surface-light border-t border-gray-700 dark:border-gray-700 border-gray-300">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <button
            key={path}
            onClick={() => setLocation(path)}
            className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
              location === path
                ? "text-primary-blue"
                : "text-secondary-gray dark:text-secondary-gray text-secondary-dark hover:text-primary-white dark:hover:text-primary-white hover:text-primary-dark"
            }`}
          >
            <Icon size={20} />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
