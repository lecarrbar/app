import { Radio, Home, BookOpen, ClipboardCheck, BarChart3 } from 'lucide-react';
import type { AppView } from '@/types/question';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onGoHome: () => void;
}

const navItems: { view: AppView; label: string; icon: typeof Home }[] = [
  { view: 'home', label: 'Home', icon: Home },
  { view: 'study', label: 'Study', icon: BookOpen },
  { view: 'exam', label: 'Practice Exam', icon: ClipboardCheck },
  { view: 'progress', label: 'Progress', icon: BarChart3 },
];

export function Navbar({ currentView, onNavigate, onGoHome }: NavbarProps) {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={onGoHome}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white leading-tight">Ham Radio Tutor</span>
              <span className="text-[10px] text-slate-400 leading-tight uppercase tracking-wider">Technician Class</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const isActive = currentView === item.view;
              const Icon = item.icon;
              return (
                <button
                  key={item.view}
                  onClick={() => onNavigate(item.view)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Mobile Nav - simplified */}
          <div className="flex md:hidden items-center gap-1">
            {navItems.map(item => {
              const isActive = currentView === item.view;
              const Icon = item.icon;
              return (
                <button
                  key={item.view}
                  onClick={() => onNavigate(item.view)}
                  className={`p-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
