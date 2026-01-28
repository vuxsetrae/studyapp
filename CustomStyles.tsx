import React from 'react';
import { BackgroundMode } from '../types';

interface CustomStylesProps {
  primaryColor: string;
  backgroundMode: BackgroundMode;
}

export const CustomStyles: React.FC<CustomStylesProps> = ({ primaryColor, backgroundMode }) => {
  // Helper to convert hex to rgb for rgba manipulation
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  };

  const { r, g, b } = hexToRgb(primaryColor);
  
  // Calculate brightness to decide text color on primary buttons (black or white)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const btnTextColor = brightness > 128 ? '#09090b' : '#ffffff';

  // --- Background Styles ---
  let backgroundCss = '';

  switch (backgroundMode) {
    case 'grid':
      backgroundCss = `
        background-color: #09090b;
        background-image: 
          linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        background-size: 30px 30px;
        background-position: center top;
      `;
      break;
    case 'dots':
      backgroundCss = `
        background-color: #050505;
        background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
        background-size: 20px 20px;
      `;
      break;
    case 'aurora':
      backgroundCss = `
        background: linear-gradient(-45deg, #0f0c29, #302b63, #24243e, #1a1a1a);
        background-size: 400% 400%;
        animation: gradientBG 15s ease infinite;
      `;
      break;
    case 'ocean':
      backgroundCss = `
        background: linear-gradient(270deg, #0f2027, #203a43, #2c5364);
        background-size: 600% 600%;
        animation: gradientBG 25s ease infinite;
      `;
      break;
    case 'sunset':
      backgroundCss = `
        background: linear-gradient(135deg, #2b1055, #7597de, #2b1055);
        background-size: 400% 400%;
        animation: gradientBG 20s ease infinite;
      `;
      break;
    case 'stars':
      backgroundCss = `
        background-color: #050505;
        background-image: 
          radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 3px),
          radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 2px),
          radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 3px);
        background-size: 550px 550px, 350px 350px, 250px 250px;
        background-position: 0 0, 40px 60px, 130px 270px;
        animation: starsAnimation 100s linear infinite;
      `;
      break;
    case 'solid':
      backgroundCss = `
        background-color: #09090b;
      `;
      break;
    case 'default':
    default:
      backgroundCss = `
        background: radial-gradient(circle at top center, #27272a 0%, #09090b 60%, #000000 100%);
      `;
      break;
  }

  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@500;600;700&display=swap');
      
      :root {
        --bg-app: #09090b; /* Zinc 950 */
        --bg-card: rgba(24, 24, 27, 0.7); /* Zinc 900 semi-transparent */
        --bg-input: rgba(9, 9, 11, 0.6);
        
        /* Dynamic Primary Theme */
        --primary-color: ${primaryColor};
        --primary-glow: rgba(${r}, ${g}, ${b}, 0.25);
        --primary-glow-subtle: rgba(${r}, ${g}, ${b}, 0.1);
        
        --border-subtle: rgba(255, 255, 255, 0.1);
        --border-highlight: rgba(255, 255, 255, 0.5);
        
        --text-main: #f4f4f5;
        --text-muted: #a1a1aa;
        --success: #10b981; /* Emerald 500 */
        --warning: #f59e0b; /* Amber 500 */
        
        --btn-text: ${btnTextColor};
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Rajdhani', sans-serif;
        background: var(--bg-app);
        color: var(--text-main);
      }

      @keyframes gradientBG {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      @keyframes starsAnimation {
        from { background-position: 0 0, 40px 60px, 130px 270px; }
        to { background-position: 550px 550px, 390px 410px, 380px 520px; }
      }

      .app {
        min-height: 100vh;
        width: 100%;
        ${backgroundCss}
        transition: background 0.5s ease;
      }

      .header {
        background: rgba(24, 24, 27, 0.8);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid var(--border-highlight);
        padding: 1.5rem;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        position: relative;
        z-index: 50;
      }

      .header-content {
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
      }

      .header h1 {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 3rem;
        color: var(--primary-color);
        text-transform: uppercase;
        letter-spacing: 6px;
        text-shadow: 0 0 30px var(--primary-glow);
      }
      
      /* GAMIFICATION BADGES CONTAINER */
      .badges-container {
        position: absolute;
        right: 0;
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      /* STREAK COUNTER */
      .streak-badge {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        background: rgba(10, 10, 10, 0.6);
        border: 1px solid rgba(245, 158, 11, 0.4); 
        padding: 0.5rem 1.2rem;
        border-radius: 50px;
        box-shadow: 0 0 15px rgba(245, 158, 11, 0.1);
        backdrop-filter: blur(5px);
        transition: all 0.3s ease;
      }

      .streak-badge:hover {
        transform: scale(1.02);
        background: rgba(20, 10, 10, 0.8);
        border-color: var(--warning);
        box-shadow: 0 0 25px rgba(245, 158, 11, 0.2);
      }

      .streak-count {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 2rem;
        color: #fff;
        line-height: 0.9;
      }

      .streak-label {
        font-size: 0.75rem;
        text-transform: uppercase;
        color: var(--warning);
        font-weight: 700;
        letter-spacing: 2px;
        display: flex;
        flex-direction: column;
        line-height: 1.1;
      }

      .fire-icon {
        color: var(--warning);
        filter: drop-shadow(0 0 5px rgba(245, 158, 11, 0.5));
        animation: pulse-fire 2.5s infinite ease-in-out;
      }
      
      /* TITLE BADGE */
      .title-badge {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        background: rgba(10, 10, 10, 0.6);
        border: 1px solid var(--primary-color); 
        padding: 0.5rem 1.5rem;
        border-radius: 50px;
        box-shadow: 0 0 15px var(--primary-glow-subtle);
        backdrop-filter: blur(5px);
        transition: all 0.3s ease;
      }
      
      .title-badge:hover {
        transform: scale(1.02);
        background: rgba(20, 10, 10, 0.8);
        box-shadow: 0 0 25px var(--primary-glow);
      }
      
      .title-text {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.5rem;
        color: #fff;
        letter-spacing: 1px;
        white-space: nowrap;
      }
      
      .title-label {
        font-size: 0.75rem;
        text-transform: uppercase;
        color: var(--primary-color);
        font-weight: 700;
        letter-spacing: 2px;
        display: flex;
        flex-direction: column;
        line-height: 1.1;
        text-align: right;
      }
      
      .trophy-icon {
        color: var(--primary-color);
        filter: drop-shadow(0 0 5px var(--primary-glow));
      }

      @keyframes pulse-fire {
        0% { filter: drop-shadow(0 0 2px rgba(245, 158, 11, 0.3)); transform: scale(1); opacity: 0.9; }
        50% { filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.6)); transform: scale(1.1); opacity: 1; }
        100% { filter: drop-shadow(0 0 2px rgba(245, 158, 11, 0.3)); transform: scale(1); opacity: 0.9; }
      }

      .tabs {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        padding: 1.5rem;
        max-width: 1400px;
        margin: 0 auto;
        flex-wrap: wrap;
      }

      .tab {
        background: transparent;
        border: 1px solid var(--border-subtle);
        padding: 0.75rem 2rem;
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.2rem;
        letter-spacing: 2px;
        color: var(--text-muted);
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        gap: 0.6rem;
        border-radius: 6px;
      }

      .tab:first-child, .tab:last-child {
        border-radius: 6px;
      }

      .tab:hover {
        color: #fff;
        background: rgba(255,255,255,0.05);
        border-color: rgba(255,255,255,0.2);
      }

      .tab.active {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        border-color: var(--primary-color);
        box-shadow: 0 0 15px var(--primary-glow-subtle);
      }

      .content {
        padding: 0 1.5rem 2rem 1.5rem;
        max-width: 1400px;
        margin: 0 auto;
      }

      /* COMMON CARD STYLES */
      .timer-card, .settings-card, .add-subject-card, .subject-card, .stats-card, .calendar-card, .calendar-details, .config-card, .achievements-card, .library-card {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 16px;
        padding: 1.5rem;
        backdrop-filter: blur(10px); /* Glassmorphism */
        box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
        position: relative;
        overflow: hidden;
      }
      
      .timer-card::after, .settings-card::after, .stats-card::after, .calendar-card::after, .config-card::after, .achievements-card::after, .library-card::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      }

      .timer-card::before, .settings-card::before, .config-card::before, .achievements-card::before, .library-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
        opacity: 0.7;
      }

      /* POMODORO - CENTRO MINIMALISTA - SCALED DOWN ~30% */
      .pomodoro-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        max-width: 420px; /* Reduced from 600px */
        margin: 0 auto;
      }

      .timer-card {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1.8rem 1.2rem; /* Reduced from 2.5rem 1.5rem */
      }

      .timer-header h2 {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.8rem; /* Reduced from 2.5rem */
        letter-spacing: 2px;
        color: #fff;
        text-align: center;
        margin-bottom: 0.8rem;
        text-shadow: 0 2px 10px rgba(0,0,0,0.5);
      }

      .timer-circle {
        position: relative;
        width: 220px; /* Reduced from 320px */
        height: 220px;
        margin: 0.5rem auto;
      }

      .timer-svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
        filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.15));
      }

      .timer-bg {
        fill: none;
        stroke: rgba(255,255,255,0.05);
        stroke-width: 5; /* Slightly thinner */
      }

      .timer-progress {
        fill: none;
        stroke: var(--primary-color);
        stroke-width: 5; /* Slightly thinner */
        stroke-linecap: round;
        transition: stroke-dashoffset 1s linear, stroke 0.5s ease;
        filter: drop-shadow(0 0 5px var(--primary-glow));
      }

      .timer-display {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
      }

      .time-text {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 3.8rem; /* Reduced from 5.5rem */
        color: #fff;
        letter-spacing: 3px;
        line-height: 1;
        text-shadow: 0 0 15px rgba(0,0,0,0.4);
      }

      .subject-display {
        font-size: 1.1rem; /* Reduced from 1.5rem */
        color: var(--primary-color);
        margin-top: 0.2rem;
        font-weight: 600;
        letter-spacing: 1px;
        text-transform: uppercase;
        opacity: 0.9;
      }

      /* MINIMALIST CONFIG INPUTS */
      .time-config-row {
        display: flex;
        justify-content: center;
        gap: 2rem; /* Reduced from 3rem */
        width: 100%;
        margin-top: 1.5rem; /* Reduced from 2rem */
        margin-bottom: 0.5rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(255,255,255,0.05);
      }

      .mini-config-item {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .mini-label {
        font-size: 0.7rem; /* Reduced from 0.8rem */
        text-transform: uppercase;
        color: var(--text-muted);
        letter-spacing: 1.2px;
        margin-bottom: 0.3rem;
        font-weight: 700;
      }

      .mini-input {
        background: transparent;
        border: none;
        border-bottom: 2px solid var(--border-subtle);
        color: #fff;
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.3rem; /* Reduced from 1.8rem */
        text-align: center;
        width: 60px; /* Reduced from 80px */
        padding: 0.1rem;
        transition: all 0.2s;
      }

      .mini-input:focus {
        outline: none;
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
      
      .mini-input:disabled {
        opacity: 0.5;
        border-bottom-style: dashed;
      }

      .timer-controls {
        display: flex;
        gap: 1rem; /* Reduced from 1.5rem */
        justify-content: center;
        margin-top: 1.2rem;
        width: 100%;
      }
      
      /* Buttons size reduction */
      .btn-primary, .btn-secondary, .btn-danger {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.6rem 1.5rem; /* Reduced */
        border: 1px solid;
        border-radius: 8px;
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1rem; /* Reduced from 1.3rem */
        letter-spacing: 1px;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        text-transform: uppercase;
      }

      .btn-primary {
        background: var(--primary-color);
        border-color: var(--primary-color);
        color: var(--btn-text); 
        box-shadow: 0 4px 15px var(--primary-glow);
        font-weight: 700;
        min-width: 120px; /* Reduced */
      }

      .btn-primary:hover {
        filter: brightness(1.2);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px var(--primary-glow);
      }

      .btn-secondary {
        background: rgba(255,255,255,0.1);
        border-color: rgba(255,255,255,0.1);
        color: #fff;
      }

      .btn-secondary:hover {
        background: rgba(255,255,255,0.2);
        transform: translateY(-2px);
      }

      .btn-danger {
        background: transparent;
        border-color: rgba(239, 68, 68, 0.4);
        color: #ef4444;
      }

      .btn-danger:hover {
        background: rgba(239, 68, 68, 0.1);
        color: #fff;
        border-color: #ef4444;
      }

      /* SECONDARY CARD FOR DETAILS */
      .secondary-card {
        width: 100%;
        border-top: 1px solid var(--border-subtle);
        background: rgba(20, 20, 23, 0.4);
      }
      
      .secondary-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 1rem;
      }

      .setting-group {
        margin-bottom: 1rem;
      }

      .setting-group label {
        display: block;
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--text-muted);
        margin-bottom: 0.4rem;
        text-transform: uppercase;
        letter-spacing: 1.5px;
      }
      
      /* --- CUSTOM DROPDOWN STYLES --- */
      .custom-select-container {
        position: relative;
        width: 100%;
      }
      
      .custom-select-trigger {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.6rem 0.8rem;
        background: var(--bg-input);
        border: 1px solid var(--border-subtle);
        border-radius: 8px;
        color: #fff;
        font-size: 1rem;
        font-family: 'Rajdhani', sans-serif;
        cursor: pointer;
        transition: all 0.2s;
        user-select: none;
      }
      
      .custom-select-trigger:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.2);
      }
      
      .custom-select-trigger.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .custom-select-options {
        position: absolute;
        top: calc(100% + 5px);
        left: 0;
        right: 0;
        background: rgba(15, 15, 18, 0.98);
        backdrop-filter: blur(15px);
        border: 1px solid var(--border-subtle);
        border-radius: 8px;
        z-index: 100;
        max-height: 250px;
        overflow-y: auto;
        box-shadow: 0 10px 40px rgba(0,0,0,0.8);
        padding: 0.4rem;
        animation: slideDown 0.2s ease-out;
      }
      
      @keyframes slideDown {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .custom-option {
        padding: 0.6rem 0.8rem;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        cursor: pointer;
        border-radius: 6px;
        transition: background 0.2s;
        margin-bottom: 2px;
      }
      
      .custom-option:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      
      .custom-option.selected {
        background: rgba(255, 255, 255, 0.05);
        color: var(--primary-color);
      }
      
      .option-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        box-shadow: 0 0 5px currentColor;
      }
      
      /* Scrollbar for options */
      .custom-select-options::-webkit-scrollbar {
        width: 6px;
      }
      
      .custom-select-options::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .custom-select-options::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.1);
        border-radius: 3px;
      }
      
      .custom-select-options::-webkit-scrollbar-thumb:hover {
        background: rgba(255,255,255,0.2);
      }
      
      /* Click outside helper */
      .click-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 99;
        cursor: default;
      }

      .setting-group input,
      .setting-group select {
        width: 100%;
        padding: 0.6rem 0.8rem;
        background: var(--bg-input);
        border: 1px solid var(--border-subtle);
        border-radius: 8px;
        color: #fff;
        font-size: 1rem;
        font-family: 'Rajdhani', sans-serif;
        transition: all 0.2s;
      }

      .setting-group input:focus,
      .setting-group select:focus {
        outline: none;
        border-color: var(--primary-color);
        background: rgba(0,0,0,0.4);
        box-shadow: 0 0 0 2px var(--primary-glow-subtle);
      }

      .setting-group input:disabled,
      .setting-group select:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* SUBJECTS */
      .subjects-container {
        animation: fadeIn 0.4s ease;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .add-subject-card {
        margin-bottom: 2rem;
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .add-subject-card input {
        flex: 1;
        padding: 0.8rem 1rem;
        background: var(--bg-input);
        border: 1px solid var(--border-subtle);
        border-radius: 8px;
        color: #fff;
        font-size: 1.1rem;
        font-family: 'Rajdhani', sans-serif;
        transition: border-color 0.2s;
      }

      .add-subject-card input:focus {
        outline: none;
        border-color: var(--primary-color);
      }

      .subjects-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .subject-card {
        padding: 0; /* Removing padding because header has it */
        border: 1px solid var(--border-subtle);
        background: var(--bg-card);
        transition: border-color 0.2s, transform 0.2s;
      }

      .subject-card:hover {
        border-color: rgba(255, 255, 255, 0.2);
      }

      .subject-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.25rem 1.5rem;
        background: linear-gradient(90deg, rgba(255, 255, 255, 0.03), transparent);
        border-bottom: 1px solid var(--border-subtle);
      }

      .subject-title {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      /* Color Tag for Subjects */
      .subject-color-tag {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        box-shadow: 0 0 8px currentColor;
      }

      .subject-title h3 {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.5rem;
        letter-spacing: 1.5px;
        color: #fff;
      }

      .expand-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        display: flex;
        padding: 0.25rem;
        transition: transform 0.2s;
      }

      .expand-btn:hover {
        transform: scale(1.15);
        color: #fff;
      }

      .subject-actions {
        display: flex;
        gap: 0.5rem;
      }

      .btn-icon, .btn-icon-small {
        background: transparent;
        border: 1px solid var(--border-subtle);
        border-radius: 6px;
        color: var(--text-muted);
        cursor: pointer;
        padding: 0.5rem;
        display: flex;
        transition: all 0.2s;
      }

      .btn-icon:hover {
        border-color: var(--primary-color);
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
      }

      .btn-icon.btn-delete:hover,
      .btn-icon-small.btn-delete:hover {
        border-color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
      }

      .chapters-list {
        padding: 1.5rem;
        background: rgba(0,0,0,0.2);
      }

      .chapter-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid var(--border-subtle);
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 0.75rem;
        box-shadow: none; /* Override default card shadow */
      }
      
      .chapter-card:last-child {
        margin-bottom: 0;
      }

      .chapter-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }

      .chapter-title-section {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
      }

      .expand-btn-small {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        display: flex;
        padding: 0.2rem;
        transition: transform 0.2s;
      }

      .expand-btn-small:hover {
        transform: scale(1.15);
        color: #fff;
      }

      .chapter-header h4 {
        font-size: 1.1rem;
        color: #fff;
        font-weight: 600;
        flex: 1;
        letter-spacing: 0.5px;
      }

      .chapter-actions {
        display: flex;
        gap: 0.5rem;
      }

      .tasks-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 1rem;
        padding-left: 2rem; /* Indent tasks */
      }

      .task-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.6rem 0.8rem;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid transparent;
        border-radius: 6px;
        transition: all 0.2s;
      }

      .task-item:hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.05);
      }

      .task-item input[type="checkbox"] {
        width: 18px;
        height: 18px;
        cursor: pointer;
        accent-color: var(--primary-color);
        flex-shrink: 0;
      }

      .task-item label {
        flex: 1;
        color: var(--text-main);
        cursor: pointer;
        font-size: 0.95rem;
        user-select: none;
      }

      .task-item label.completed {
        text-decoration: line-through;
        opacity: 0.4;
      }

      .task-actions {
        display: flex;
        gap: 0.35rem;
        align-items: center;
        opacity: 0.5;
        transition: opacity 0.2s;
      }
      
      .task-item:hover .task-actions {
        opacity: 1;
      }

      .btn-icon-tiny {
        background: transparent;
        border: 1px solid var(--border-subtle);
        border-radius: 4px;
        color: var(--text-muted);
        cursor: pointer;
        padding: 0.3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        flex-shrink: 0;
      }

      .btn-icon-tiny.btn-edit:hover {
        border-color: #fff;
        color: #fff;
      }

      .btn-icon-tiny.btn-delete:hover {
        border-color: #ef4444;
        background: #ef4444;
        color: #fff;
      }

      .edit-input, .edit-input-small {
        background: var(--bg-input);
        border: 1px solid var(--primary-color);
        border-radius: 4px;
        color: #fff;
        padding: 0.4rem;
        font-size: 1rem;
        font-family: 'Rajdhani', sans-serif;
        width: 100%;
        box-shadow: 0 0 10px rgba(124, 58, 237, 0.1);
      }

      .edit-input:focus, .edit-input-small:focus {
        outline: none;
      }

      .empty-state {
        text-align: center;
        padding: 2rem;
        color: var(--text-muted);
        font-style: italic;
        background: rgba(0,0,0,0.1);
        border-radius: 8px;
        border: 1px dashed var(--border-subtle);
      }

      .empty-state-small {
        text-align: center;
        padding: 1rem;
        color: var(--text-muted);
        font-style: italic;
        font-size: 0.9rem;
      }

      /* STATS */
      .stats-container {
        display: grid;
        gap: 2rem;
      }

      .stats-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 2rem;
        color: var(--primary-color);
        border-bottom: 1px solid var(--border-subtle);
        padding-bottom: 1rem;
      }

      .stats-header h2 {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.8rem;
        letter-spacing: 2px;
        color: #fff;
      }

      .empty-stats {
        text-align: center;
        padding: 3rem;
        color: var(--text-muted);
        border: 1px dashed var(--border-subtle);
        border-radius: 8px;
        background: rgba(0,0,0,0.1);
      }

      .chart-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        align-items: flex-start;
      }

      .pie-chart {
        width: 100%;
        max-width: 320px;
        margin: 0 auto;
      }

      /* Specific Typography for Chart Center */
      .chart-label {
        font-family: 'Rajdhani', sans-serif;
        font-size: 14px;
        fill: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: 600;
        text-anchor: middle;
      }

      .chart-value {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 42px;
        fill: #ffffff;
        text-anchor: middle;
        filter: drop-shadow(0 0 8px rgba(255,255,255,0.3));
      }

      .legend {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 8px;
        border: 1px solid var(--border-subtle);
        transition: all 0.2s;
      }

      .legend-item:hover {
        border-color: rgba(255,255,255,0.2);
        background: rgba(255, 255, 255, 0.05);
      }

      .legend-color {
        width: 24px;
        height: 24px;
        border-radius: 6px;
        flex-shrink: 0;
      }

      .legend-text {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }

      .legend-subject {
        font-weight: 700;
        font-size: 1.1rem;
        color: #fff;
      }

      .legend-value {
        color: var(--text-muted);
        font-size: 0.9rem;
      }

      .bar-chart {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .bar-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .bar-label {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .bar-subject {
        font-weight: 600;
        font-size: 1.05rem;
        color: #fff;
      }

      .bar-values {
        color: var(--text-muted);
        font-size: 0.95rem;
        font-weight: 500;
      }

      .bar-container {
        height: 24px;
        background: rgba(255,255,255,0.05);
        border-radius: 12px;
        overflow: hidden;
        position: relative;
      }

      .bar-fill {
        height: 100%;
        transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        position: relative;
        border-radius: 0 12px 12px 0;
      }

      .bar-total {
        background: rgba(255,255,255,0.15);
      }

      .bar-correct {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: var(--primary-color);
        box-shadow: 0 0 10px var(--primary-glow);
      }

      .bar-legend {
        display: flex;
        gap: 2rem;
        justify-content: center;
        margin-top: 1rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--border-subtle);
      }

      .bar-legend-item {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        color: var(--text-muted);
        font-size: 0.9rem;
      }

      .bar-legend-color {
        width: 16px;
        height: 16px;
        border-radius: 4px;
      }

      .bar-legend-total {
        background: rgba(255,255,255,0.15);
      }

      .bar-legend-correct {
        background: var(--primary-color);
      }

      /* CALENDAR */
      .calendar-container {
        display: grid;
        gap: 2rem;
      }
      
      .goal-config {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 2rem;
        background: rgba(0,0,0,0.2);
        padding: 1.2rem;
        border-radius: 12px;
        border: 1px solid var(--border-subtle);
        width: fit-content;
      }
      
      .goal-config label {
        color: var(--primary-color);
        font-weight: 700;
        text-transform: uppercase;
        font-size: 0.9rem;
        letter-spacing: 1px;
      }
      
      .goal-config input {
        background: var(--bg-input);
        border: 1px solid var(--border-subtle);
        color: #fff;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        width: 90px;
        font-family: 'Rajdhani', sans-serif;
        font-size: 1.1rem;
        text-align: center;
      }
      
      .goal-config input:focus {
        outline: none;
        border-color: var(--primary-color);
      }
      
      .goal-info {
        font-size: 0.95rem;
        color: var(--text-muted);
      }

      .calendar-header-nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border-subtle);
      }

      .month-title {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 2.2rem;
        color: #fff;
        text-transform: uppercase;
        letter-spacing: 3px;
      }

      .nav-btn {
        background: rgba(255,255,255,0.05);
        border: 1px solid var(--border-subtle);
        color: #fff;
        width: 40px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
      }

      .nav-btn:hover {
        border-color: var(--primary-color);
        color: var(--primary-color);
        background: rgba(255, 255, 255, 0.1);
      }

      .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 0.75rem;
      }

      .calendar-day-header {
        text-align: center;
        color: var(--text-muted);
        font-weight: 700;
        padding: 0.5rem;
        text-transform: uppercase;
        font-size: 0.85rem;
        letter-spacing: 1px;
      }

      .calendar-day {
        aspect-ratio: 1;
        background: rgba(0,0,0,0.2);
        border: 1px solid var(--border-subtle);
        border-radius: 10px;
        padding: 0.5rem;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
        overflow: hidden;
      }

      .calendar-day:hover {
        border-color: rgba(255,255,255,0.3);
        transform: translateY(-2px);
      }
      
      /* New Goal Visuals - Harmonized */
      .calendar-day.goal-met {
        border-color: rgba(16, 185, 129, 0.5); /* Green */
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), transparent);
        box-shadow: 0 0 15px rgba(16, 185, 129, 0.1) inset;
      }
      
      .calendar-day.goal-met .day-total-mini {
        color: var(--success);
      }
      
      .calendar-day.goal-warning {
        border-color: rgba(245, 158, 11, 0.5); /* Orange/Amber */
        border-style: solid;
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.05), transparent);
      }
      
      .calendar-day.goal-warning .day-total-mini {
        color: var(--warning);
      }

      .calendar-day.empty {
        background: transparent;
        border: none;
        cursor: default;
        box-shadow: none;
      }

      .calendar-day.selected {
        border-color: var(--primary-color);
        box-shadow: 0 0 20px var(--primary-glow);
        background: rgba(255, 255, 255, 0.05);
      }
      
      .calendar-day.selected.goal-met {
        border-color: var(--success);
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
      }
      
      .calendar-day.selected.goal-warning {
        border-color: var(--warning);
        box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
      }

      .calendar-day.has-data:not(.goal-met):not(.goal-warning) {
        background: rgba(255, 255, 255, 0.03);
      }

      .day-number {
        position: absolute;
        top: 8px;
        left: 10px;
        font-size: 0.85rem;
        color: var(--text-muted);
        font-weight: 600;
      }
      
      .calendar-day.selected .day-number, .calendar-day:hover .day-number {
        color: #fff;
      }

      .day-indicator {
        margin-top: 0;
        display: flex;
        justify-content: center;
        gap: 3px;
        margin-bottom: 4px;
      }

      .dot {
        width: 6px;
        height: 6px;
        background-color: var(--primary-color);
        border-radius: 50%;
        box-shadow: 0 0 5px var(--primary-glow-subtle);
      }
      
      .calendar-day.goal-met .dot {
        background-color: var(--success);
        box-shadow: 0 0 5px rgba(16, 185, 129, 0.5);
      }
      
      .calendar-day.goal-warning .dot {
        background-color: var(--warning);
        box-shadow: 0 0 5px rgba(245, 158, 11, 0.5);
      }

      .day-total-mini {
        margin-top: auto;
        margin-bottom: auto;
        text-align: center;
        font-size: 1.2rem;
        font-weight: 400; /* Lighter weight for cleaner look */
        color: var(--primary-color);
        font-family: 'Bebas Neue', sans-serif;
        letter-spacing: 1px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.5);
      }

      .details-header {
        border-bottom: 1px solid var(--border-subtle);
        padding-bottom: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .details-header h3 {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.8rem;
        color: #fff;
        letter-spacing: 1px;
      }

      .details-header span {
        color: var(--primary-color);
        font-size: 1.4rem;
        margin-left: 0.5rem;
      }
      
      .goal-status-box {
        margin-top: 1.5rem;
        background: rgba(0,0,0,0.2);
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid var(--border-subtle);
      }
      
      .goal-status-text {
        font-weight: 600;
        margin-bottom: 0.75rem;
        display: block;
        letter-spacing: 0.5px;
      }
      
      .goal-progress-bar {
        height: 10px;
        background: rgba(255,255,255,0.05);
        border-radius: 5px;
        overflow: hidden;
      }
      
      .goal-progress-fill {
        height: 100%;
        transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 0 10px rgba(0,0,0,0.2) inset;
      }

      .day-stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 1.25rem;
        margin-top: 1.5rem;
      }

      .stat-box {
        background: rgba(255,255,255,0.02);
        border: 1px solid var(--border-subtle);
        border-radius: 10px;
        padding: 1.2rem;
        transition: transform 0.2s;
      }
      
      .stat-box:hover {
        transform: translateY(-2px);
        background: rgba(255,255,255,0.04);
      }

      .stat-subject {
        color: #fff;
        font-weight: 700;
        font-size: 1.1rem;
        margin-bottom: 0.75rem;
        display: block;
        border-bottom: 1px solid rgba(255,255,255,0.05);
        padding-bottom: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .stat-subject-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }

      .stat-row {
        display: flex;
        justify-content: space-between;
        font-size: 0.95rem;
        margin-bottom: 0.4rem;
        color: var(--text-muted);
      }
      
      .stat-row span:last-child {
        color: #fff;
        font-family: 'Rajdhani', sans-serif;
        font-weight: 600;
      }
      
      /* LIBRARY STYLES */
      .library-search-container {
        margin-bottom: 2rem;
      }
      
      .search-box {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      
      .search-box input {
        flex: 1;
        background: var(--bg-input);
        border: 1px solid var(--border-subtle);
        padding: 0.8rem 1rem;
        border-radius: 8px;
        color: #fff;
        font-family: 'Rajdhani', sans-serif;
        font-size: 1.1rem;
      }
      
      .search-box input:focus {
        outline: none;
        border-color: var(--primary-color);
      }
      
      .book-result {
        display: flex;
        gap: 1.5rem;
        background: rgba(0,0,0,0.2);
        border: 1px solid var(--border-subtle);
        padding: 1.5rem;
        border-radius: 12px;
        margin-bottom: 2rem;
        align-items: center;
      }
      
      .book-result img {
        width: 80px;
        height: 120px;
        object-fit: cover;
        border-radius: 4px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.5);
      }
      
      .book-result-info {
        flex: 1;
      }
      
      .book-result-info h3 {
        color: #fff;
        font-size: 1.4rem;
        margin-bottom: 0.3rem;
      }
      
      .book-result-info p {
        color: var(--text-muted);
        margin-bottom: 1rem;
      }
      
      .library-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
        gap: 1.5rem;
        margin-top: 1.5rem;
      }
      
      .book-card {
        background: rgba(255,255,255,0.03);
        border: 1px solid var(--border-subtle);
        border-radius: 8px;
        padding: 0.8rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: transform 0.2s;
        position: relative;
        text-align: center;
      }
      
      .book-card:hover {
        transform: translateY(-5px);
        background: rgba(255,255,255,0.05);
        border-color: var(--primary-color);
      }
      
      .book-card.completed {
        border-color: var(--success);
        background: rgba(16, 185, 129, 0.05);
      }
      
      .book-cover {
        width: 100px;
        height: 150px;
        object-fit: cover;
        border-radius: 4px;
        margin-bottom: 0.8rem;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      }
      
      .book-title {
        color: #fff;
        font-size: 0.9rem;
        font-weight: 600;
        line-height: 1.2;
        margin-bottom: 0.2rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .book-author {
        color: var(--text-muted);
        font-size: 0.8rem;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .book-remove-btn {
        position: absolute;
        top: 5px;
        right: 5px;
        background: rgba(0,0,0,0.7);
        color: #ef4444;
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
        z-index: 10;
      }
      
      .book-status-btn {
        position: absolute;
        top: 5px;
        left: 5px;
        background: rgba(0,0,0,0.7);
        color: #fff;
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        transition: all 0.2s;
        z-index: 10;
      }
      
      .book-status-btn.completed {
        color: var(--success);
        background: rgba(0,0,0,0.8);
        opacity: 1;
      }

      .book-card:hover .book-remove-btn,
      .book-card:hover .book-status-btn {
        opacity: 1;
      }

      .book-remove-btn:hover {
        background: #ef4444;
        color: #fff;
      }
      
      .book-status-btn:hover {
        background: rgba(255,255,255,0.2);
        transform: scale(1.1);
      }
      
      /* Settings Styles */
      .settings-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      
      .config-section h3 {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.5rem;
        color: #fff;
        margin-bottom: 1rem;
        letter-spacing: 1px;
      }
      
      .config-desc {
        color: var(--text-muted);
        font-size: 0.95rem;
        margin-bottom: 1.5rem;
        line-height: 1.5;
      }
      
      .file-input-wrapper {
        position: relative;
        display: inline-block;
      }
      
      .hidden-input {
        display: none;
      }
      
      .action-row {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }
      
      /* Color Picker Input */
      .color-picker-wrapper {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      
      input[type="color"] {
        appearance: none;
        -moz-appearance: none;
        -webkit-appearance: none;
        background: none;
        border: 0;
        cursor: pointer;
        width: 50px;
        height: 50px;
        padding: 0;
        border-radius: 8px;
        overflow: hidden;
      }
      
      input[type="color"]::-webkit-color-swatch-wrapper {
        padding: 0;
      }
      
      input[type="color"]::-webkit-color-swatch {
        border: 2px solid var(--border-subtle);
        border-radius: 8px;
      }
      
      /* Radio Group Styles */
      .radio-group {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
        margin-bottom: 1.5rem;
      }
      
      .radio-option {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        cursor: pointer;
        padding: 0.8rem;
        background: rgba(0,0,0,0.2);
        border: 1px solid var(--border-subtle);
        border-radius: 8px;
        transition: all 0.2s;
      }
      
      .radio-option:hover {
        background: rgba(255,255,255,0.05);
        border-color: rgba(255,255,255,0.2);
      }
      
      .radio-option.selected {
        background: rgba(255,255,255,0.08);
        border-color: var(--primary-color);
        box-shadow: 0 0 10px var(--primary-glow-subtle);
      }
      
      .radio-circle {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid var(--text-muted);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }
      
      .radio-option.selected .radio-circle {
        border-color: var(--primary-color);
      }
      
      .radio-inner {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--primary-color);
        opacity: 0;
        transform: scale(0.5);
        transition: all 0.2s;
      }
      
      .radio-option.selected .radio-inner {
        opacity: 1;
        transform: scale(1);
      }
      
      .radio-label {
        color: #fff;
        font-weight: 600;
        font-size: 1rem;
      }
      
      /* ACHIEVEMENTS GRID */
      .achievements-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
      }
      
      .achievement-card {
        background: rgba(0,0,0,0.2);
        border: 1px solid var(--border-subtle);
        border-radius: 12px;
        padding: 1.5rem;
        display: flex;
        gap: 1.2rem;
        align-items: center;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }
      
      .achievement-card.unlocked {
        background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.1));
        border-color: rgba(255,255,255,0.2);
      }
      
      .achievement-card.unlocked:hover {
        transform: translateY(-2px);
        border-color: var(--primary-color);
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      }
      
      .achievement-card.locked {
        opacity: 0.5;
        filter: grayscale(1);
      }
      
      .achievement-icon-box {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        border: 2px solid transparent;
      }
      
      .achievement-card.unlocked .achievement-icon-box {
        background: rgba(255,255,255,0.1);
        border-color: var(--primary-color);
        box-shadow: 0 0 10px var(--primary-glow-subtle);
      }
      
      .achievement-content {
        flex: 1;
      }
      
      .achievement-title {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.4rem;
        color: #fff;
        letter-spacing: 1px;
        margin-bottom: 0.2rem;
      }
      
      .achievement-desc {
        color: var(--text-muted);
        font-size: 0.9rem;
        line-height: 1.4;
      }
      
      .achievement-status {
        position: absolute;
        top: 10px;
        right: 10px;
      }
      
      .progress-section {
        margin-bottom: 2rem;
        text-align: center;
        padding: 2rem;
        background: rgba(255,255,255,0.03);
        border-radius: 12px;
        border: 1px solid var(--border-subtle);
      }
      
      .next-rank-info {
        color: var(--text-muted);
        margin-bottom: 1rem;
        font-size: 1rem;
      }
      
      .next-rank-title {
        color: var(--primary-color);
        font-weight: 700;
        text-transform: uppercase;
      }

      @media (max-width: 1024px) {
        .chart-container {
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        
        .badges-container {
           position: relative;
           width: 100%;
           justify-content: center;
           margin-top: 1rem;
        }
      }

      @media (max-width: 768px) {
        .header-content {
          flex-direction: column;
          gap: 0.5rem;
        }

        .header h1 {
          font-size: 2.2rem;
          letter-spacing: 3px;
        }
        
        .tabs {
          flex-direction: column;
          padding: 1rem;
          gap: 0.5rem;
        }
        
        .tab {
          width: 100%;
          justify-content: center;
        }
        
        .timer-circle {
          width: 180px; /* Reduced from 250px */
          height: 180px;
        }
        
        .time-text {
          font-size: 3rem; /* Reduced from 4rem */
        }
        
        .calendar-grid {
           gap: 0.5rem;
        }
        
        .day-number {
           font-size: 0.8rem;
           top: 4px;
           left: 6px;
        }
        
        .day-total-mini {
           font-size: 1rem;
        }
        
        .time-config-row {
           flex-direction: column;
           gap: 1.5rem;
           align-items: center;
        }
        
        .secondary-grid {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  );
};