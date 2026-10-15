import React, { useState, useEffect } from 'react';
import { 
  getStoredTheme, 
  saveTheme, 
  ACCENT_PRESETS 
} from '../utils/themeManager';
import { 
  Sun, 
  Moon, 
  Palette, 
  X, 
  Check 
} from 'lucide-react';

export default function UserThemeWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(getStoredTheme());
  const isLight = theme.mode === 'light';

  useEffect(() => {
    const syncTheme = (e) => {
      const current = e?.detail || getStoredTheme();
      setTheme(current);
    };
    window.addEventListener('kinetix-theme-changed', syncTheme);
    window.addEventListener('storage', syncTheme);
    return () => {
      window.removeEventListener('kinetix-theme-changed', syncTheme);
      window.removeEventListener('storage', syncTheme);
    };
  }, []);

  const handleModeToggle = (mode) => {
    const updated = { ...theme, mode };
    saveTheme(updated);
    setTheme(updated);
  };

  const handleAccentSelect = (accentId) => {
    const preset = ACCENT_PRESETS.find(p => p.id === accentId);
    if (!preset) return;
    const updated = {
      ...theme,
      accentId: preset.id,
      accentColor: preset.color,
      accentHover: preset.hover,
      accentRgb: preset.rgb,
      accentText: preset.text,
      accentName: preset.name
    };
    saveTheme(updated);
    setTheme(updated);
  };

  return (
    <aside aria-label="Personal theme controls" className="user-theme-widget-root">
      {/* Floating Trigger Pill */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="user-theme-floating-btn"
          title="Personalize Site Theme (Light / Dark)"
          aria-label="Theme settings"
          id="user-theme-floating-btn"
        >
          <span className="utf-icon-wrap">
            {isLight ? <Sun size={15} /> : <Moon size={15} />}
          </span>
          <span className="utf-text">{isLight ? 'Light Mode' : 'Dark Mode'}</span>
          <span 
            className="utf-dot" 
            style={{ background: theme.accentColor || '#CCFF00' }} 
            title={`Active Accent: ${theme.accentName || 'Volt'}`}
          />
        </button>
      )}

      {/* Mini Personal Theme Panel */}
      {isOpen && (
        <div className="user-theme-floating-card">
          <div className="utf-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Palette size={15} color="var(--accent)" />
              <strong style={{ fontSize: '0.85rem' }}>Personal Theme</strong>
            </div>
            <button 
              type="button"
              onClick={() => setIsOpen(false)} 
              className="utf-close-btn"
              aria-label="Close theme panel"
            >
              <X size={14} />
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="utf-section">
            <span className="utf-section-lbl">Appearance Mode</span>
            <div className="utf-mode-grid">
              <button
                type="button"
                onClick={() => handleModeToggle('dark')}
                className={`utf-mode-tab ${!isLight ? 'active' : ''}`}
                id="btn-set-dark-mode"
              >
                <Moon size={13} />
                <span>Dark Theme</span>
              </button>
              <button
                type="button"
                onClick={() => handleModeToggle('light')}
                className={`utf-mode-tab ${isLight ? 'active' : ''}`}
                id="btn-set-light-mode"
              >
                <Sun size={13} />
                <span>Light Theme</span>
              </button>
            </div>
          </div>

          {/* Quick Accent Palette */}
          <div className="utf-section" style={{ marginBottom: 0 }}>
            <span className="utf-section-lbl">Accent Color</span>
            <div className="utf-accent-row">
              {ACCENT_PRESETS.slice(0, 8).map((p) => {
                const isSelected = theme.accentId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleAccentSelect(p.id)}
                    className={`utf-accent-dot ${isSelected ? 'selected' : ''}`}
                    style={{ background: p.color }}
                    title={p.name}
                    aria-label={`Select ${p.name} accent`}
                  >
                    {isSelected && <Check size={10} color={p.text || '#000'} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
