import React, { useRef } from 'react';
import { Download, Upload, Trash2, Database, AlertTriangle, Palette, Volume2, Bell, VolumeX } from 'lucide-react';
import { storageService } from '../services/storage';
import { ColorMode, BackgroundMode } from '../types';

interface SettingsProps {
  onDataImported: () => void;
  primaryColor: string;
  onColorChange: (color: string) => void;
  colorMode: ColorMode;
  onColorModeChange: (mode: ColorMode) => void;
  backgroundMode: BackgroundMode;
  onBackgroundModeChange: (mode: BackgroundMode) => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  notificationsEnabled: boolean;
  onNotificationsChange: (enabled: boolean) => void;
}

export const Settings: React.FC<SettingsProps> = ({ 
  onDataImported, 
  primaryColor, 
  onColorChange,
  colorMode,
  onColorModeChange,
  backgroundMode,
  onBackgroundModeChange,
  volume,
  onVolumeChange,
  notificationsEnabled,
  onNotificationsChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = storageService.createBackup();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = storageService.restoreBackup(content);
        if (success) {
          alert('Dados restaurados com sucesso! A página será recarregada.');
          onDataImported();
          window.location.reload();
        } else {
          alert('Erro ao restaurar arquivo. Verifique se é um backup válido.');
        }
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  const handleClearData = () => {
    if (confirm('TEM CERTEZA? Isso apagará TODAS as suas matérias, sessões e estatísticas permanentemente. Esta ação não pode ser desfeita.')) {
      storageService.clearAll();
      window.location.reload();
    }
  };
  
  const handleResetColor = () => {
    onColorChange('#ffffff');
  };

  const requestNotificationPermission = async () => {
    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        onNotificationsChange(true);
      } else {
        alert('Permissão de notificação negada pelo navegador.');
        onNotificationsChange(false);
      }
    } else {
      onNotificationsChange(!notificationsEnabled);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-grid">
        
        <div className="config-card">
          <div className="stats-header">
            <Palette size={22} />
            <h2>Personalização</h2>
          </div>
          
          <div className="config-section">
            <h3 style={{fontSize: '1.2rem', marginTop: '0'}}>Sons e Notificações</h3>
            
            <div className="setting-group" style={{marginBottom: '2rem'}}>
               <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
                 {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                 <label style={{marginBottom: 0}}>Volume dos Efeitos ({Math.round(volume * 100)}%)</label>
               </div>
               <input 
                 type="range" 
                 min="0" 
                 max="1" 
                 step="0.1" 
                 value={volume} 
                 onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                 style={{width: '100%', accentColor: primaryColor, cursor: 'pointer'}}
               />
            </div>

            <div 
               className={`radio-option ${notificationsEnabled ? 'selected' : ''}`}
               onClick={requestNotificationPermission}
               style={{marginBottom: '2rem'}}
            >
              <div className="radio-circle">
                 {notificationsEnabled && <div className="radio-inner" />}
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                 <Bell size={18} />
                 <span className="radio-label">Notificações de Navegador</span>
              </div>
            </div>

            <div style={{ margin: '2rem 0 1rem 0', height: '1px', background: 'var(--border-subtle)' }} />

            <h3 style={{fontSize: '1.2rem'}}>Cor Principal</h3>
            <p className="config-desc">
              Escolha a cor principal do aplicativo para combinar com seu estilo.
            </p>
            
            <div className="color-picker-wrapper">
              <input 
                type="color" 
                value={primaryColor} 
                onChange={(e) => onColorChange(e.target.value)} 
              />
              <span style={{ fontSize: '1.2rem', fontFamily: 'monospace', color: '#fff' }}>
                {primaryColor}
              </span>
            </div>
            
            <button onClick={handleResetColor} className="btn-secondary">
               Restaurar Padrão (Branco)
            </button>
            
            <div style={{ margin: '2rem 0 1rem 0', height: '1px', background: 'var(--border-subtle)' }} />
            
            <h3 style={{fontSize: '1.2rem'}}>Cores das Novas Matérias</h3>
            <p className="config-desc">
              Defina como as cores serão geradas automaticamente ao criar uma nova matéria.
            </p>
            
            <div className="radio-group">
              <div 
                className={`radio-option ${colorMode === 'vibrant' ? 'selected' : ''}`}
                onClick={() => onColorModeChange('vibrant')}
              >
                <div className="radio-circle">
                  <div className="radio-inner" />
                </div>
                <span className="radio-label">Vibrantes / Aleatórias</span>
              </div>
              
              <div 
                className={`radio-option ${colorMode === 'monochrome' ? 'selected' : ''}`}
                onClick={() => onColorModeChange('monochrome')}
              >
                <div className="radio-circle">
                  <div className="radio-inner" />
                </div>
                <span className="radio-label">Tons de Branco/Cinza (Monocromático)</span>
              </div>
            </div>
            
            <div style={{ margin: '2rem 0 1rem 0', height: '1px', background: 'var(--border-subtle)' }} />

            <h3 style={{fontSize: '1.2rem'}}>Plano de Fundo</h3>
            <p className="config-desc">
              Escolha o estilo visual do fundo da aplicação.
            </p>

            <div className="radio-group">
              <div 
                className={`radio-option ${backgroundMode === 'default' ? 'selected' : ''}`}
                onClick={() => onBackgroundModeChange('default')}
              >
                <div className="radio-circle">
                   <div className="radio-inner" />
                </div>
                <span className="radio-label">Padrão (Radial)</span>
              </div>

              <div 
                className={`radio-option ${backgroundMode === 'grid' ? 'selected' : ''}`}
                onClick={() => onBackgroundModeChange('grid')}
              >
                <div className="radio-circle">
                   <div className="radio-inner" />
                </div>
                <span className="radio-label">Grade (Grid)</span>
              </div>
              
              <div 
                className={`radio-option ${backgroundMode === 'stars' ? 'selected' : ''}`}
                onClick={() => onBackgroundModeChange('stars')}
              >
                <div className="radio-circle">
                   <div className="radio-inner" />
                </div>
                <span className="radio-label">Estrelas (Animado)</span>
              </div>

              <div 
                className={`radio-option ${backgroundMode === 'aurora' ? 'selected' : ''}`}
                onClick={() => onBackgroundModeChange('aurora')}
              >
                <div className="radio-circle">
                   <div className="radio-inner" />
                </div>
                <span className="radio-label">Aurora (Animado)</span>
              </div>
              
              <div 
                className={`radio-option ${backgroundMode === 'ocean' ? 'selected' : ''}`}
                onClick={() => onBackgroundModeChange('ocean')}
              >
                <div className="radio-circle">
                   <div className="radio-inner" />
                </div>
                <span className="radio-label">Oceano (Animado)</span>
              </div>
              
              <div 
                className={`radio-option ${backgroundMode === 'sunset' ? 'selected' : ''}`}
                onClick={() => onBackgroundModeChange('sunset')}
              >
                <div className="radio-circle">
                   <div className="radio-inner" />
                </div>
                <span className="radio-label">Entardecer (Animado)</span>
              </div>

              <div 
                className={`radio-option ${backgroundMode === 'dots' ? 'selected' : ''}`}
                onClick={() => onBackgroundModeChange('dots')}
              >
                <div className="radio-circle">
                   <div className="radio-inner" />
                </div>
                <span className="radio-label">Pontilhado (Minimalista)</span>
              </div>

              <div 
                className={`radio-option ${backgroundMode === 'solid' ? 'selected' : ''}`}
                onClick={() => onBackgroundModeChange('solid')}
              >
                <div className="radio-circle">
                   <div className="radio-inner" />
                </div>
                <span className="radio-label">Sólido (Foco Total)</span>
              </div>
            </div>

          </div>
        </div>

        <div className="config-card">
          <div className="stats-header">
            <Database size={22} />
            <h2>Gerenciamento de Dados</h2>
          </div>
          
          <div className="config-section">
            <p className="config-desc">
              Seus dados são salvos localmente no seu navegador. Use as opções abaixo para criar cópias de segurança (Backup) ou transferir seus dados para outro dispositivo.
            </p>
            
            <div className="action-row">
              <button onClick={handleExport} className="btn-primary">
                <Download size={18} /> Exportar Backup
              </button>
              
              <div className="file-input-wrapper">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".json" 
                  className="hidden-input"
                />
                <button onClick={handleImportClick} className="btn-secondary">
                  <Upload size={18} /> Importar Backup
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="config-card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
           <div className="stats-header" style={{ color: '#ef4444', borderBottomColor: 'rgba(239, 68, 68, 0.2)' }}>
            <AlertTriangle size={22} />
            <h2>Zona de Perigo</h2>
          </div>
          
          <div className="config-section">
            <p className="config-desc">
              Esta ação removerá todos os dados deste navegador. Certifique-se de ter um backup antes de prosseguir.
            </p>
            
            <button onClick={handleClearData} className="btn-danger">
              <Trash2 size={18} /> Apagar Tudo e Resetar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};