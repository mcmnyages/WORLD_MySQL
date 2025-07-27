// src/context/useTheme.ts
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext/ThemeContext';

export const useTheme = () => useContext(ThemeContext);
