import React, { useState, useEffect } from 'react';
import { 
  ACCENT_PRESETS, 
  FONT_PRESETS, 
  DEFAULT_THEME, 
  getStoredTheme, 
  applyTheme, 
  saveTheme, 
  resetTheme 
} from '../utils/themeManager';
import { 
  Check, 
  Sparkles, 
  RotateCcw, 
  Globe, 
  Search, 
  Plus, 
  Sliders, 
  ChevronDown,
  Layers,
  Eye,
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function ThemeAdjuster({ onThemeSaved }) {
  const [theme, setTheme] = useState(getStoredTheme());
  const [showToast, setShowToast] = useState(false);
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Load stored theme on mount and apply immediately
  useEffect(() => {
    const stored = getStoredTheme();
    setTheme(stored);
    applyTheme(stored);

    const handleExternalUpdate = (e) => {
      if (e.detail) {
        setTheme(e.detail);
        applyTheme(e.detail);
      }
    };
    window.addEventListener('kinetix-theme-changed', handleExternalUpdate);
    return () => window.removeEventListener('kinetix-theme-changed', handleExternalUpdate);
  }, []);

  // Update a theme property in state and preview live
  const updateProp = (key, value) => {
    const updated = { ...theme, [key]: value };
    
    // If updating accentId, sync color, name, hover, rgb, text
    if (key === 'accentId') {
      const preset = ACCENT_PRESETS.find(p => p.id === value);
      if (preset) {
        updated.accentColor = preset.color;
        updated.accentHover = preset.hover;
        updated.accentRgb = preset.rgb;
        updated.accentText = preset.text;
        updated.accentName = preset.name;
      }
    }

    // If updating fontId, sync font typography
    if (key === 'fontId') {
      const preset = FONT_PRESETS.find(f => f.id === value);
      if (preset) {
        updated.fontName = preset.name;
        updated.fontHeading = preset.heading;
        updated.fontDisplay = preset.display;
        updated.fontBody = preset.body;
      }
    }

    setTheme(updated);
    setIsDirty(true);
    // Live preview applied to document immediately
    applyTheme(updated);
  };

  // Persist theme to localStorage and broadcast to all visitors
  const handleSaveTheme = () => {
    saveTheme(theme);
    setIsDirty(false);
    setShowToast(true);
    if (onThemeSaved) onThemeSaved(theme);
    setTimeout(() => setShowToast(false), 3500);
  };

  // Reset to default KINETIX theme
  const handleResetTheme = () => {
    resetTheme();
    setTheme(DEFAULT_THEME);
    setIsDirty(false);
    setShowToast(true);
    if (onThemeSaved) onThemeSaved(DEFAULT_THEME);
    setTimeout(() => setShowToast(false), 3500);
  };

  const activeAccentPreset = ACCENT_PRESETS.find(p => p.id === theme.accentId) || ACCENT_PRESETS[2];
  const activeFontPreset = FONT_PRESETS.find(f => f.id === theme.fontId) || FONT_PRESETS[1];

  return (
    <div className="theme-adjuster-panel">
      {/* Top Header */}
      <div className="theme-panel-header">
        <div>
          <h2 className="theme-panel-title">Themes</h2>
          <p className="theme-panel-subtitle">
            Customize the visual style of your workspace &amp; public gym website.
          </p>
        </div>

        <div className="theme-header-actions">
          <div className="theme-broadcast-chip" title="Any saved theme is immediately loaded by all website visitors">
            <Globe size={13} className="text-accent-icon" />
            <span>Public Live Sync</span>
          </div>
          <button 
            type="button"
            onClick={handleResetTheme} 
            className="theme-reset-btn"
            title="Reset to default theme"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
          <button 
            type="button"
            onClick={handleSaveTheme} 
            className="theme-save-btn"
            id="admin-save-theme-btn"
          >
            <Check size={14} />
            <span>Save Theme for All Visitors</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column or Split Layout Matching Reference Image */}
      <div className="theme-adjuster-body">
        
        {/* Left Settings Column */}
        <div className="theme-controls-column">
          
          {/* 1. Theme Mode (Auto, Light, Dark) */}
          <div className="theme-control-group">
            <div className="theme-mode-segmented">
              <button
                type="button"
                className={`theme-mode-btn ${theme.mode === 'auto' ? 'active' : ''}`}
                onClick={() => updateProp('mode', 'auto')}
              >
                Auto
              </button>
              <button
                type="button"
                className={`theme-mode-btn ${theme.mode === 'light' ? 'active' : ''}`}
                onClick={() => updateProp('mode', 'light')}
              >
                Light
              </button>
              <button
                type="button"
                className={`theme-mode-btn ${theme.mode === 'dark' ? 'active' : ''}`}
                onClick={() => updateProp('mode', 'dark')}
              >
                Dark
              </button>
            </div>
          </div>

          {/* 2. Accent Color Swatches */}
          <div className="theme-control-group">
            <label className="theme-group-label">Accent color</label>
            <div className="theme-accent-swatches-row">
              {ACCENT_PRESETS.map((preset) => {
                const isSelected = theme.accentId === preset.id;
                return (
                  <div key={preset.id} className="theme-swatch-wrapper">
                    <button
                      type="button"
                      onClick={() => updateProp('accentId', preset.id)}
                      className={`theme-color-swatch ${isSelected ? 'selected' : ''}`}
                      style={{ 
                        backgroundColor: preset.color,
                        boxShadow: isSelected 
                          ? `0 0 0 3px #0E1118, 0 0 0 5px ${preset.color}, 0 0 16px ${preset.color}` 
                          : 'none'
                      }}
                      title={preset.name}
                      aria-label={`Select ${preset.name} accent`}
                    />
                    {isSelected && (
                      <span className="theme-swatch-name-label" style={{ color: preset.color }}>
                        {preset.name}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Density Slider */}
          <div className="theme-control-group">
            <div className="theme-label-with-val">
              <label className="theme-group-label">Density</label>
              <span className="theme-density-current">{theme.density.toUpperCase()}</span>
            </div>
            
            <div className="theme-slider-container">
              <input 
                type="range"
                min="0"
                max="2"
                step="1"
                value={theme.density === 'relaxed' ? 0 : theme.density === 'standard' ? 1 : 2}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  const densityMap = ['relaxed', 'standard', 'tight'];
                  updateProp('density', densityMap[val]);
                }}
                className="theme-range-input"
                aria-label="Density slider"
              />
              <div className="theme-slider-ticks">
                <span 
                  className={`tick-lbl ${theme.density === 'relaxed' ? 'active' : ''}`}
                  onClick={() => updateProp('density', 'relaxed')}
                >
                  Relaxed
                </span>
                <span 
                  className={`tick-lbl ${theme.density === 'standard' ? 'active' : ''}`}
                  onClick={() => updateProp('density', 'standard')}
                >
                  Standard
                </span>
                <span 
                  className={`tick-lbl ${theme.density === 'tight' ? 'active' : ''}`}
                  onClick={() => updateProp('density', 'tight')}
                >
                  Tight
                </span>
              </div>
            </div>
          </div>

          {/* 4. Font Dropdown */}
          <div className="theme-control-group">
            <label className="theme-group-label">Font</label>
            <div className="theme-font-select-wrapper">
              <button 
                type="button"
                className="theme-font-select-btn"
                onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
                aria-haspopup="listbox"
                aria-expanded={isFontDropdownOpen}
              >
                <span>{activeFontPreset.name}</span>
                <ChevronDown size={16} className={`dropdown-chevron ${isFontDropdownOpen ? 'rotated' : ''}`} />
              </button>

              {isFontDropdownOpen && (
                <div className="theme-font-dropdown-menu">
                  {FONT_PRESETS.map((font) => (
                    <button
                      key={font.id}
                      type="button"
                      className={`theme-font-option ${theme.fontId === font.id ? 'active' : ''}`}
                      onClick={() => {
                        updateProp('fontId', font.id);
                        setIsFontDropdownOpen(false);
                      }}
                    >
                      <span style={{ fontFamily: font.heading }}>{font.name}</span>
                      {theme.fontId === font.id && <Check size={14} className="text-accent-icon" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 5. Corner Radius Slider */}
          <div className="theme-control-group">
            <div className="theme-label-with-val">
              <label className="theme-group-label">Corner radius</label>
              <span className="theme-radius-indicator">{theme.radius}px</span>
            </div>

            <div className="theme-slider-container">
              <input 
                type="range"
                min="2"
                max="16"
                step="2"
                value={theme.radius}
                onChange={(e) => updateProp('radius', Number(e.target.value))}
                className="theme-range-input"
                aria-label="Corner radius slider"
              />
              <div className="theme-slider-ticks numbers-tick">
                <span className={`tick-lbl ${theme.radius <= 4 ? 'active' : ''}`} onClick={() => updateProp('radius', 4)}>4</span>
                <span className={`tick-lbl ${theme.radius === 8 ? 'active' : ''}`} onClick={() => updateProp('radius', 8)}>8</span>
                <span className={`tick-lbl ${theme.radius === 12 ? 'active' : ''}`} onClick={() => updateProp('radius', 12)}>12</span>
                <span className={`tick-lbl ${theme.radius >= 16 ? 'active' : ''}`} onClick={() => updateProp('radius', 16)}>16</span>
              </div>
            </div>
          </div>

          {/* 6. Functional Toggles */}
          <div className="theme-toggles-section">
            
            {/* Toggle 1: Smooth Animations */}
            <div className="theme-toggle-row">
              <div className="toggle-info">
                <span className="toggle-title">Smooth animations</span>
                <span className="toggle-desc">Enable fluid transitions for design elements.</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={theme.smoothAnimations}
                className={`theme-ios-switch ${theme.smoothAnimations ? 'on' : ''}`}
                onClick={() => updateProp('smoothAnimations', !theme.smoothAnimations)}
              >
                <span className="switch-thumb"></span>
              </button>
            </div>

            {/* Toggle 2: Bold Focus Rings */}
            <div className="theme-toggle-row">
              <div className="toggle-info">
                <span className="toggle-title">Bold focus rings</span>
                <span className="toggle-desc">Increase visibility of selected layers and tools.</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={theme.boldFocusRings}
                className={`theme-ios-switch ${theme.boldFocusRings ? 'on' : ''}`}
                onClick={() => updateProp('boldFocusRings', !theme.boldFocusRings)}
              >
                <span className="switch-thumb"></span>
              </button>
            </div>

            {/* Toggle 3: Show Grid Lines */}
            <div className="theme-toggle-row">
              <div className="toggle-info">
                <span className="toggle-title">Show grid lines</span>
                <span className="toggle-desc">Display layout grids for precise alignment.</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={theme.showGridLines}
                className={`theme-ios-switch ${theme.showGridLines ? 'on' : ''}`}
                onClick={() => updateProp('showGridLines', !theme.showGridLines)}
              >
                <span className="switch-thumb"></span>
              </button>
            </div>

            {/* Toggle 4: Compact Mobile / Sidebar view */}
            <div className="theme-toggle-row">
              <div className="toggle-info">
                <span className="toggle-title">Use compact sidebar icons</span>
                <span className="toggle-desc">Maximize canvas space for your projects.</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={theme.compactSidebar}
                className={`theme-ios-switch ${theme.compactSidebar ? 'on' : ''}`}
                onClick={() => updateProp('compactSidebar', !theme.compactSidebar)}
              >
                <span className="switch-thumb"></span>
              </button>
            </div>

          </div>

        </div>

        {/* Right Preview Column (As shown in Reference Image 2) */}
        <div className="theme-preview-column">
          <div className="theme-mini-viewport-card" style={{ borderRadius: `${Math.max(4, theme.radius)}px` }}>
            
            {/* Mini App Toolbar */}
            <div className="mini-toolbar">
              <div className="mini-search-box" style={{ borderRadius: `${Math.max(2, theme.radius - 2)}px` }}>
                <Search size={12} className="mini-search-icon" />
                <span>Search designs, assets, team</span>
              </div>
              
              <div className="mini-toolbar-actions">
                <button 
                  type="button"
                  className="mini-btn-primary"
                  style={{ 
                    backgroundColor: theme.accentColor, 
                    color: theme.accentText,
                    borderRadius: `${Math.max(2, theme.radius - 2)}px`
                  }}
                >
                  <Plus size={11} />
                  <span>New design</span>
                </button>
                <button 
                  type="button"
                  className="mini-btn-ghost"
                  style={{ borderRadius: `${Math.max(2, theme.radius - 2)}px` }}
                >
                  <span>Add collaborator</span>
                </button>
              </div>
            </div>

            {/* Mini Projects & Gym Cards Showcase */}
            <div className="mini-projects-header">
              <span className="mini-projects-title">Projects</span>
              <span className="mini-density-tag">{theme.density.toUpperCase()}</span>
            </div>

            <div className="mini-cards-grid">
              {/* Mini Card 1 */}
              <div 
                className="mini-card"
                style={{ 
                  borderRadius: `${theme.radius}px`,
                  fontFamily: activeFontPreset.heading
                }}
              >
                <div className="mini-card-banner banner-1" style={{ borderRadius: `${Math.max(2, theme.radius - 2)}px` }}>
                  <span className="mini-card-pill" style={{ backgroundColor: theme.accentColor, color: theme.accentText }}>
                    STRENGTH
                  </span>
                </div>
                <div className="mini-card-meta">
                  <span className="mini-card-title">Hypertrophy Core</span>
                  <span className="mini-card-sub">60 mins • Coach Marcus</span>
                </div>
              </div>

              {/* Mini Card 2 */}
              <div 
                className="mini-card"
                style={{ 
                  borderRadius: `${theme.radius}px`,
                  fontFamily: activeFontPreset.heading
                }}
              >
                <div className="mini-card-banner banner-2" style={{ borderRadius: `${Math.max(2, theme.radius - 2)}px` }}>
                  <span className="mini-card-pill" style={{ backgroundColor: theme.accentColor, color: theme.accentText }}>
                    OLYMPIC
                  </span>
                </div>
                <div className="mini-card-meta">
                  <span className="mini-card-title">Clean &amp; Jerk Lab</span>
                  <span className="mini-card-sub">Calibrated Eleiko</span>
                </div>
              </div>

              {/* Mini Card 3 - Gym CTA Card */}
              <div 
                className="mini-card highlight-card"
                style={{ 
                  borderRadius: `${theme.radius}px`,
                  borderColor: `rgba(${theme.accentRgb}, 0.4)`
                }}
              >
                <div className="mini-card-inner">
                  <span className="mini-tier-label" style={{ color: theme.accentColor }}>PRO ATHLETE</span>
                  <span className="mini-price">₹5,999<small>/mo</small></span>
                  <button 
                    type="button"
                    className="mini-card-cta"
                    style={{ 
                      backgroundColor: theme.accentColor, 
                      color: theme.accentText,
                      borderRadius: `${Math.max(2, theme.radius - 2)}px`
                    }}
                  >
                    JOIN TODAY
                  </button>
                </div>
              </div>

              {/* Mini Card 4 - Drag Assets */}
              <div 
                className="mini-card mini-dropzone"
                style={{ borderRadius: `${theme.radius}px` }}
              >
                <Layers size={18} style={{ color: theme.accentColor }} />
                <span>Drag assets here</span>
              </div>
            </div>

            {/* Mini Timeline / Status Footer */}
            <div className="mini-viewport-footer">
              <div className="mini-timeline-track">
                <div 
                  className="mini-timeline-progress" 
                  style={{ 
                    backgroundColor: theme.accentColor,
                    boxShadow: `0 0 10px ${theme.accentColor}`
                  }}
                ></div>
              </div>
              <div className="mini-footer-status">
                <span className="mini-status-dot" style={{ backgroundColor: theme.accentColor }}></span>
                <span>Live Mode: <strong>{theme.mode.toUpperCase()}</strong> • Accent: <strong>{activeAccentPreset.name}</strong> • Radius: <strong>{theme.radius}px</strong></span>
              </div>
            </div>

          </div>

          {/* Bottom Callout Info */}
          <div className="theme-save-instruction-card">
            <div className="ts-left">
              <Globe size={18} style={{ color: theme.accentColor }} />
              <div>
                <strong>Global Website Broadcast</strong>
                <p>When saved, this theme is permanently stored and instantly applied for every visitor opening KINETIX Athletic Club.</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={handleSaveTheme}
              className="theme-bottom-save-btn"
              style={{ backgroundColor: theme.accentColor, color: theme.accentText }}
            >
              Save Changes
            </button>
          </div>
        </div>

      </div>

      {/* Floating "Theme updated" Toast Badge (Matching Reference Image 2 Bottom-Right) */}
      {showToast && (
        <div className="theme-updated-toast-floating">
          <span 
            className="toast-accent-chip" 
            style={{ 
              backgroundColor: theme.accentColor,
              boxShadow: `0 0 8px ${theme.accentColor}`
            }}
          ></span>
          <span className="toast-text">Theme updated</span>
        </div>
      )}
    </div>
  );
}
