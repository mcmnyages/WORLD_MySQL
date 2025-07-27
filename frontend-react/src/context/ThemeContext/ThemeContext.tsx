export type Theme = 'light' | 'dark' | 'space';

import { createContext } from 'react';

export const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: 'light',
  setTheme: () => {},
});
