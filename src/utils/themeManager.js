// Theme Manager for KINETIX Athletic Club
// Handles theme persistence, CSS variable injection, and cross-visitor real-time synchronization

export const ACCENT_PRESETS = [
  { id: 'blue', name: 'Blue', color: '#007AFF', hover: '#258CFE', rgb: '0, 122, 255', text: '#FFFFFF' },
  { id: 'green', name: 'Green', color: '#10B981', hover: '#34D399', rgb: '16, 185, 129', text: '#FFFFFF' },
  { id: 'volt', name: 'Volt', color: '#CCFF00', hover: '#DCFF33', rgb: '204, 255, 0', text: '#08090D' },
  { id: 'amber', name: 'Amber', color: '#F59E0B', hover: '#FBBF24', rgb: '245, 158, 11', text: '#08090D' },
  { id: 'orange', name: 'Orange', color: '#F97316', hover: '#FB923C', rgb: '249, 115, 22', text: '#FFFFFF' },
  { id: 'crimson', name: 'Crimson', color: '#EF4444', hover: '#F87171', rgb: '239, 68, 68', text: '#FFFFFF' },
  { id: 'magenta', name: 'Magenta', color: '#EC4899', hover: '#F472B6', rgb: '236, 72, 153', text: '#FFFFFF' },
  { id: 'violet', name: 'Violet', color: '#8B5CF6', hover: '#A78BFA', rgb: '139, 92, 246', text: '#FFFFFF' },
  { id: 'cyan', name: 'Cyan', color: '#06B6D4', hover: '#22D3EE', rgb: '6, 182, 212', text: '#08090D' },
  { id: 'coral', name: 'Coral', color: '#FF6B4A', hover: '#FF8566', rgb: '255, 107, 74', text: '#FFFFFF' }
];

export const FONT_PRESETS = [
  { 
    id: 'sf-pro', 
    name: 'SF Pro', 
    heading: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro', 'Segoe UI', Roboto, sans-serif",
    display: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro', 'Segoe UI', Roboto, sans-serif",
    body: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro', 'Segoe UI', Roboto, sans-serif"
  },
  { 
    id: 'outfit', 
    name: 'Outfit & Jakarta', 
    heading: "'Outfit', sans-serif",
    display: "'Syne', sans-serif",
    body: "'Plus Jakarta Sans', sans-serif"
  },
  { 
    id: 'syne', 
    name: 'Syne (Athletic Bold)', 
    heading: "'Syne', sans-serif",
    display: "'Syne', sans-serif",
    body: "'Plus Jakarta Sans', sans-serif"
  },
  { 
    id: 'inter', 
    name: 'Inter (Clean Technical)', 
    heading: "'Inter', sans-serif",
    display: "'Inter', sans-serif",
    body: "'Inter', sans-serif"
  },
  { 
    id: 'montserrat', 
    name: 'Montserrat & Oswald', 
    heading: "'Montserrat', sans-serif",
    display: "'Oswald', sans-serif",
    body: "'Montserrat', sans-serif"
  }
];

export const DEFAULT_THEME = {
  mode: 'dark', // 'auto' | 'light' | 'dark'
  accentId: 'volt',
  accentColor: '#CCFF00',
  accentHover: '#DCFF33',
  accentRgb: '204, 255, 0',
  accentText: '#08090D',
  accentName: 'Volt',
  density: 'standard', // 'relaxed' | 'standard' | 'tight'
  fontId: 'outfit',
  fontName: 'Outfit & Jakarta',
  fontHeading: "'Outfit', sans-serif",
  fontDisplay: "'Syne', sans-serif",
  fontBody: "'Plus Jakarta Sans', sans-serif",
  radius: 4, // 4, 8, 12, 16
  smoothAnimations: true,
  boldFocusRings: false,
  showGridLines: false,
  compactSidebar: false
};

const STORAGE_KEY = 'kinetix_public_theme';

/**
 * Reads stored theme from localStorage or returns default
 */
export function getStoredTheme() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_THEME;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_THEME, ...parsed };
  } catch (e) {
    return DEFAULT_THEME;
  }
}

/**
 * Applies theme CSS variables directly to the DOM root
 */
export function applyTheme(theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  // 1. Color Mode (Dark vs Light vs Auto)
  let effectiveMode = theme.mode || 'dark';
  if (effectiveMode === 'auto') {
    effectiveMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  root.setAttribute('data-theme', effectiveMode);

  // 2. Accent Colors
  const accentPreset = ACCENT_PRESETS.find(p => p.id === theme.accentId) || ACCENT_PRESETS.find(p => p.color === theme.accentColor) || ACCENT_PRESETS[2];
  root.style.setProperty('--accent', accentPreset.color);
  root.style.setProperty('--accent-hover', accentPreset.hover);
  root.style.setProperty('--accent-rgb', accentPreset.rgb);
  root.style.setProperty('--accent-dim', `rgba(${accentPreset.rgb}, 0.12)`);
  root.style.setProperty('--accent-glow', `rgba(${accentPreset.rgb}, 0.35)`);
  root.style.setProperty('--accent-text', accentPreset.text);
  root.style.setProperty('--border-accent', `rgba(${accentPreset.rgb}, 0.35)`);

  // 3. Corner Radius
  const r = Number(theme.radius) || 4;
  root.style.setProperty('--radius-xs', `${Math.max(2, Math.round(r * 0.35))}px`);
  root.style.setProperty('--radius-sm', `${Math.max(3, Math.round(r * 0.65))}px`);
  root.style.setProperty('--radius-md', `${r}px`);
  root.style.setProperty('--radius-lg', `${Math.round(r * 1.5)}px`);
  root.style.setProperty('--radius-btn', `${r}px`);

  // 4. Font Typography
  const fontPreset = FONT_PRESETS.find(f => f.id === theme.fontId) || FONT_PRESETS[1];
  root.style.setProperty('--font-heading', fontPreset.heading);
  root.style.setProperty('--font-display', fontPreset.display);
  root.style.setProperty('--font-body', fontPreset.body);

  // 5. Layout Density
  if (theme.density === 'tight') {
    root.style.setProperty('--section-py', '72px');
    root.style.setProperty('--card-padding', '18px');
    root.style.setProperty('--density-factor', '0.85');
  } else if (theme.density === 'relaxed') {
    root.style.setProperty('--section-py', '120px');
    root.style.setProperty('--card-padding', '34px');
    root.style.setProperty('--density-factor', '1.15');
  } else {
    root.style.setProperty('--section-py', '96px');
    root.style.setProperty('--card-padding', '26px');
    root.style.setProperty('--density-factor', '1.0');
  }

  // 6. Smooth Animations Toggle
  if (theme.smoothAnimations === false) {
    root.classList.add('no-smooth-transitions');
  } else {
    root.classList.remove('no-smooth-transitions');
  }

  // 7. Bold Focus Rings Toggle
  if (theme.boldFocusRings) {
    root.classList.add('bold-focus-rings');
  } else {
    root.classList.remove('bold-focus-rings');
  }

  // 8. Grid Lines Overlay
  if (theme.showGridLines) {
    root.classList.add('theme-grid-lines');
  } else {
    root.classList.remove('theme-grid-lines');
  }
}

/**
 * Saves theme to localStorage and broadcasts change to all tabs and windows
 */
export function saveTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    applyTheme(theme);
    // Broadcast locally
    window.dispatchEvent(new CustomEvent('kinetix-theme-changed', { detail: theme }));
    // Broadcast to other tabs
    window.dispatchEvent(new Event('storage'));
    return true;
  } catch (e) {
    console.error('Failed to save theme', e);
    return false;
  }
}

/**
 * Resets theme to factory default and broadcasts
 */
export function resetTheme() {
  return saveTheme(DEFAULT_THEME);
}
