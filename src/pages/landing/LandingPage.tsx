import { useNavigate } from 'react-router-dom';
import { Moon, Sun, CheckCircle2, Shield, Smartphone, Zap } from 'lucide-react';
import { useState } from 'react';

const ACTIVITY = [
  { icon: '✓', label: 'Task completed', bg: 'bg-orange-50 dark:bg-orange-950/30', ic: 'text-orange-500', time: '18:52' },
  { icon: '⬆', label: 'Report saved',   bg: 'bg-blue-50 dark:bg-blue-950/30',     ic: 'text-blue-500',   time: '18:52' },
  { icon: '₹', label: '₹500 Food',       bg: 'bg-green-50 dark:bg-green-950/30',   ic: 'text-green-600',  time: '18:51' },
  { icon: '✓', label: 'Task completed', bg: 'bg-orange-50 dark:bg-orange-950/30', ic: 'text-orange-500', time: '18:51' },
  { icon: '⬆', label: 'Report saved',   bg: 'bg-blue-50 dark:bg-blue-950/30',     ic: 'text-blue-500',   time: '18:51' },
];

const QUICK_ACTIONS = [
  { icon: '₹', label: 'Add expense',   color: 'text-green-600' },
  { icon: '⬆', label: 'Upload report', color: 'text-blue-500'  },
  { icon: '✓', label: 'Assign task',   color: 'text-orange-500'},
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-[#f4f4f0] dark:bg-zinc-950">

        {/* ── Navbar ── */}
        <nav className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm select-none">K</div>
            <span className="font-semibold text-zinc-900 dark:text-white text-lg">KutumbOS</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-zinc-600 dark:text-zinc-400">
            {['Features', 'How it works', 'Security', 'FAQ'].map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`}
                className="hover:text-zinc-900 dark:hover:text-white transition-colors">{l}</a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setDark(!dark)} aria-label="Toggle theme"
              className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button onClick={() => navigate('/simple-register')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2 rounded-full transition-colors">
              Get Started
            </button>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="max-w-7xl mx-auto px-8 pt-16 pb-24 grid md:grid-cols-2 gap-12 items-center">

          {/* Copy */}
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full px-4 py-1.5 text-xs text-zinc-600 dark:text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              Family Operating System
            </span>

            <h1 className="text-5xl font-extrabold leading-tight text-zinc-900 dark:text-white tracking-tight">
              Your family runs on chats, memory…{' '}
              <span className="text-zinc-400 dark:text-zinc-500">and guesswork.</span>
            </h1>

            <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed max-w-md">
              Expenses are in WhatsApp. Reports are in gallery. Tasks are in someone's head.{' '}
              <span className="text-zinc-800 dark:text-zinc-200 font-medium">KutumbOS turns this into a system.</span>
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button onClick={() => navigate('/simple-register')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
                Start in 2 minutes
              </button>
              <button onClick={() => navigate('/login')}
                className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white font-medium text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 transition-colors">
                Try it live <span className="ml-1">↓</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-5 pt-2 text-xs text-zinc-500 dark:text-zinc-500">
              <span className="flex items-center gap-1.5"><Smartphone className="h-3.5 w-3.5" /> Works on mobile</span>
              <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5" /> No setup required</span>
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> Private family data</span>
            </div>
          </div>

          {/* Mock dashboard card */}
          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">

              {/* Card header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Live Demo
                </div>
                <span className="text-xs text-zinc-400">Sharma Family</span>
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-3 gap-2 p-4">
                {QUICK_ACTIONS.map((a) => (
                  <div key={a.label} className="flex flex-col items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl py-3 px-2">
                    <span className={`text-lg font-bold ${a.color}`}>{a.icon}</span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 text-center leading-tight">{a.label}</span>
                  </div>
                ))}
              </div>

              {/* Activity feed */}
              <div className="px-4 pb-4 space-y-2">
                {ACTIVITY.map((item, i) => (
                  <div key={i} className={`flex items-center justify-between px-3 py-2.5 rounded-lg ${item.bg}`}>
                    <div className="flex items-center gap-2.5">
                      <span className={`text-sm font-bold ${item.ic}`}>{item.icon}</span>
                      <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      <span className="text-[10px] text-zinc-400">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
