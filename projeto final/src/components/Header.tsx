import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, TrendingUp, Key, Check, HelpCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './Button';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
    } else {
      localStorage.removeItem('gemini_api_key');
    }
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      setIsKeyModalOpen(false);
    }, 1500);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname.startsWith('/simular');
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5.5 h-5.5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                FinAI
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 tracking-wider uppercase">
                Educador Inteligente
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden sm:flex items-center gap-1.5">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive('/') 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
              }`}
            >
              Simulador
            </Link>
            <Link
              to="/historico"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive('/historico') 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
              }`}
            >
              Histórico
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsKeyModalOpen(true)}
              className="!p-2.5 rounded-xl border-slate-200 dark:border-slate-800 relative hover:border-indigo-300 dark:hover:border-indigo-800"
              title="Configurar Chave do Gemini"
            >
              <Key className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              {localStorage.getItem('gemini_api_key') && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="!p-2.5 rounded-xl border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800"
              title={theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-slate-500" />
              ) : (
                <Sun className="w-4 h-4 text-slate-400" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Mobile Footer (Fixed for Mobile) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex justify-around items-center h-16 px-6">
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 text-xs transition-colors ${
            isActive('/') ? 'text-emerald-500 font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <span>Simulador</span>
        </Link>
        <Link
          to="/historico"
          className={`flex flex-col items-center gap-1 text-xs transition-colors ${
            isActive('/historico') ? 'text-emerald-500 font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <TrendingUp className="w-5 h-5 rotate-90" /> {/* Just a list layout or clock */}
          <span>Histórico</span>
        </Link>
      </nav>

      {/* Key Config Modal */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-slide-up">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500">
                  <Key className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Chave de API do Gemini
                </h3>
              </div>
              <button
                onClick={() => setIsKeyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveKey} className="flex flex-col gap-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Para obter insights financeiros reais gerados pela inteligência artificial, você pode inserir sua chave do Google Gemini.
              </p>
              
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 dark:border-amber-900/50 flex gap-2.5 items-start">
                <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
                  <strong>Dica:</strong> Se você deixar o campo em branco ou sem salvar, o site usará o <strong>Modo Demo (Mock)</strong> que gera conselhos pré-configurados e simulações para teste.
                </p>
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsKeyModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="ai" size="sm">
                  {showSavedToast ? (
                    <span className="flex items-center gap-1">
                      <Check className="w-4 h-4" /> Salvo!
                    </span>
                  ) : (
                    'Salvar Chave'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
