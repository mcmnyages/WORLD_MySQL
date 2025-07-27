import { useTheme } from '../hooks/useTheme';
import { SunIcon, MoonIcon, SparklesIcon } from '@heroicons/react/24/solid';

const themes = [
  { id: 'light', label: 'Light', icon: <SunIcon className="w-5 h-5" /> },
  { id: 'dark', label: 'Dark', icon: <MoonIcon className="w-5 h-5" /> },
  { id: 'space', label: 'Space', icon: <SparklesIcon className="w-5 h-5" /> },
] as const;

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-wrap gap-2">
      {themes.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => setTheme(id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md border transition text-sm font-medium
            ${theme === id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          aria-pressed={theme === id}
        >
          {icon}
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
