import React, { useState } from 'react';
import { Settings, X, RotateCcw } from 'lucide-react';
import ResponsiveLogo from '../common/ResponsiveLogo';

interface LogoControlProps {
  onLogoChange: (settings: LogoSettings) => void;
  currentSettings: LogoSettings;
}

export interface LogoSettings {
  height: number;
  width: 'auto' | number;
  opacity: number;
  brightness: number;
  contrast: number;
  filter: string;
  transform: string;
}

const LogoControl: React.FC<LogoControlProps> = ({ onLogoChange, currentSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<LogoSettings>(currentSettings);

  const handleSettingChange = (key: keyof LogoSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onLogoChange(newSettings);
  };

  const resetSettings = () => {
    const defaultSettings: LogoSettings = {
      height: 80,
      width: 'auto',
      opacity: 100,
      brightness: 100,
      contrast: 100,
      filter: 'none',
      transform: 'none'
    };
    setSettings(defaultSettings);
    onLogoChange(defaultSettings);
  };

  const getLogoStyle = () => {
    return {
      height: `${settings.height}px`,
      width: settings.width === 'auto' ? 'auto' : `${settings.width}px`,
      opacity: settings.opacity / 100,
      filter: `brightness(${settings.brightness}%) contrast(${settings.contrast}%) ${settings.filter}`,
      transform: settings.transform
    };
  };

  return (
    <>
      {/* Control Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-lion-500 text-white p-3 rounded-full shadow-lg hover:bg-lion-600 transition-colors duration-200"
        title="Logo Control"
      >
        <Settings size={20} />
      </button>

      {/* Control Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Logo Control</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Preview */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="text-sm font-medium mb-2">Preview</h4>
                <div className="flex justify-center items-center">
                  <ResponsiveLogo 
                    size="medium"
                    alt="Logo Preview" 
                    style={{
                      ...getLogoStyle(),
                      transformOrigin: 'center center',
                      display: 'block',
                      margin: '0 auto'
                    }}
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Height Control */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Height: {settings.height}px
                </label>
                <input
                  type="range"
                  min="20"
                  max="200"
                  value={settings.height}
                  onChange={(e) => handleSettingChange('height', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Width Control */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Width: {settings.width === 'auto' ? 'Auto' : `${settings.width}px`}
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSettingChange('width', 'auto')}
                    className={`px-3 py-1 rounded text-sm ${
                      settings.width === 'auto' 
                        ? 'bg-lion-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Auto
                  </button>
                  <input
                    type="number"
                    min="20"
                    max="300"
                    value={settings.width === 'auto' ? '' : settings.width}
                    onChange={(e) => handleSettingChange('width', parseInt(e.target.value) || 'auto')}
                    className="flex-1 px-3 py-1 border rounded text-sm"
                    placeholder="Custom width"
                  />
                </div>
              </div>

              {/* Opacity Control */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Opacity: {settings.opacity}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={settings.opacity}
                  onChange={(e) => handleSettingChange('opacity', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Brightness Control */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Brightness: {settings.brightness}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={settings.brightness}
                  onChange={(e) => handleSettingChange('brightness', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Contrast Control */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Contrast: {settings.contrast}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={settings.contrast}
                  onChange={(e) => handleSettingChange('contrast', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Filter Presets */}
              <div>
                <label className="block text-sm font-medium mb-2">Filter Effects</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSettingChange('filter', 'none')}
                    className={`px-3 py-2 rounded text-sm ${
                      settings.filter === 'none' 
                        ? 'bg-lion-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => handleSettingChange('filter', 'grayscale(100%)')}
                    className={`px-3 py-2 rounded text-sm ${
                      settings.filter === 'grayscale(100%)' 
                        ? 'bg-lion-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Grayscale
                  </button>
                  <button
                    onClick={() => handleSettingChange('filter', 'sepia(100%)')}
                    className={`px-3 py-2 rounded text-sm ${
                      settings.filter === 'sepia(100%)' 
                        ? 'bg-lion-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Sepia
                  </button>
                  <button
                    onClick={() => handleSettingChange('filter', 'invert(100%)')}
                    className={`px-3 py-2 rounded text-sm ${
                      settings.filter === 'invert(100%)' 
                        ? 'bg-lion-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Invert
                  </button>
                </div>
              </div>

              {/* Transform Effects */}
              <div>
                <label className="block text-sm font-medium mb-2">Transform Effects</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSettingChange('transform', 'none')}
                    className={`px-3 py-2 rounded text-sm ${
                      settings.transform === 'none' 
                        ? 'bg-lion-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => handleSettingChange('transform', 'rotate(90deg)')}
                    className={`px-3 py-2 rounded text-sm ${
                      settings.transform === 'rotate(90deg)' 
                        ? 'bg-lion-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Rotate 90°
                  </button>
                  <button
                    onClick={() => handleSettingChange('transform', 'scaleX(-1)')}
                    className={`px-3 py-2 rounded text-sm ${
                      settings.transform === 'scaleX(-1)' 
                        ? 'bg-lion-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Flip H
                  </button>
                  <button
                    onClick={() => handleSettingChange('transform', 'scaleY(-1)')}
                    className={`px-3 py-2 rounded text-sm ${
                      settings.transform === 'scaleY(-1)' 
                        ? 'bg-lion-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Flip V
                  </button>
                </div>
              </div>

              {/* Reset Button */}
              <div className="pt-4 border-t">
                <button
                  onClick={resetSettings}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <RotateCcw size={16} />
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoControl; 