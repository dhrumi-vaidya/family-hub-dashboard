import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Moon, Sun, Menu, X, Smartphone, Zap, Shield, ArrowRight,
  IndianRupee, FileHeart, ListChecks, CircleCheckBig,
  CircleHelp, FileSearch, TriangleAlert, Brain,
  MessageCircle, LayoutDashboard, Database, Puzzle, Users,
  ShieldCheck, EyeOff, Ban, Lock, TrendingUp, ChevronDown,
  House,
} from 'lucide-react';

// ── Scroll-reveal hook ────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transition: `opacity 0.5s ${delay}ms, transform 0.5s ${delay}ms` }}>
      {children}
    </div>
  );
}

// ── Activity types ────────────────────────────────────────────────────────────
interface ActivityItem { id: number; type: 'expense' | 'health' | 'task'; label: string; time: string; fresh?: boolean; }
let uid = 100;
function nowTime() { const d = new Date(); return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`; }
const INIT_ACTIVITY: ActivityItem[] = [
  { id: 1, type: 'expense', label: '₹500 Food',      time: '14:18' },
  { id: 2, type: 'task',    label: 'Task completed',  time: '14:18' },
  { id: 3, type: 'health',  label: 'Report saved',    time: '14:18' },
  { id: 4, type: 'expense', label: '₹500 Food',       time: '14:18' },
  { id: 5, type: 'task',    label: 'Task completed',  time: '14:18' },
];
const TYPE_META = {
  expense: { Icon: IndianRupee, bg: 'bg-green-500/10',  ic: 'text-green-500'  },
  health:  { Icon: FileHeart,   bg: 'bg-blue-500/10',   ic: 'text-blue-500'   },
  task:    { Icon: ListChecks,  bg: 'bg-amber-500/10',  ic: 'text-amber-500'  },
};

// ── FAQ data ──────────────────────────────────────────────────────────────────
const FAQS = [
  { q: 'Is it easy for parents to use?',       a: 'Yes — KutumbOS has a Simple Mode designed for low-tech users. Large buttons, plain language, and guided flows make it accessible for everyone.' },
  { q: 'Do all members need to join?',          a: 'No. The family admin can manage everything. Members can join gradually via invite links.' },
  { q: 'Is my family data safe?',               a: 'Absolutely. Data is isolated per family, encrypted in transit, and never shared or sold.' },
  { q: 'Does it work on mobile?',               a: 'Yes — fully responsive. Works on any modern browser on phone or desktop.' },
  { q: 'What can I track with KutumbOS?',       a: 'Expenses, health records, tasks/responsibilities, and family members — all in one place.' },
  { q: 'Is there a free plan?',                 a: 'Yes. You can start for free with no credit card required.' },
];

const FAMILY_SUGGESTIONS = ['Sharma Family', 'Patel Family', 'Gupta Family', 'Mehta Family', 'Verma Family'];

export default function LandingPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const dark = theme === 'dark';
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [activity, setActivity] = useState<ActivityItem[]>(INIT_ACTIVITY);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [onboardStep, setOnboardStep] = useState(0);
  const [familyName, setFamilyName] = useState('');
  const [scores, setScores] = useState({ spending: 0, tasks: 0, records: 0 });
  const [scoresVisible, setScoresVisible] = useState(false);
  const scoresRef = useRef<HTMLDivElement>(null);
  const [problemClicked, setProblemClicked] = useState<number | null>(null);

  // Animate scores when visible
  useEffect(() => {
    const el = scoresRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setScoresVisible(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!scoresVisible) return;
    const targets = { spending: 23, tasks: 41, records: 12 };
    const duration = 1200;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      setScores({ spending: Math.round(targets.spending * p), tasks: Math.round(targets.tasks * p), records: Math.round(targets.records * p) });
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [scoresVisible]);

  const handleAction = (type: ActivityItem['type']) => {
    setActiveTab(type === 'expense' ? 0 : type === 'health' ? 1 : 2);
    const labels: Record<ActivityItem['type'], string> = { expense: '₹200 added', health: 'Report saved', task: 'Task assigned' };
    const item: ActivityItem = { id: uid++, type, label: labels[type], time: nowTime(), fresh: true };
    setLastAdded(labels[type]);
    setActivity(prev => [item, ...prev].slice(0, 8));
    setTimeout(() => setActivity(prev => prev.map(a => a.id === item.id ? { ...a, fresh: false } : a)), 600);
    setTimeout(() => setActiveTab(-1), 400);
    setTimeout(() => setLastAdded(null), 2000);
  };

  const PROBLEM_STORIES = [
    { color: 'red',    title: '"Who paid for this?"',    story: 'With KutumbOS, every expense is logged with who paid, when, and why. No more arguments.' },
    { color: 'blue',   title: '"Where is that report?"', story: 'Health records are stored and searchable. Find any document in seconds.' },
    { color: 'amber',  title: '"I told you to do this!"',story: 'Tasks are assigned with deadlines and tracked. Everyone knows what\'s pending.' },
    { color: 'purple', title: '"Ask mom/dad, they know"', story: 'KutumbOS distributes knowledge. Anyone can check the dashboard — no single point of failure.' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">

        {/* ── Navbar ── */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur border-b border-border/40 transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <a href="#" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">K</span>
                </div>
                <span className="font-bold text-lg">KutumbOS</span>
              </a>
              <div className="hidden md:flex items-center gap-8">
                {['#features','#how-it-works','#trust','#faq'].map((href, i) => (
                  <a key={href} href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {['Features','How it works','Security','FAQ'][i]}
                  </a>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-secondary transition-colors" aria-label="Toggle theme">
                  {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <a href="#final-cta" onClick={() => navigate('/simple-register')} className="hidden md:inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                  Get Started
                </a>
                <button className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
                  {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
          {menuOpen && (
            <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
              {['Features','How it works','Security','FAQ'].map((l, i) => (
                <a key={l} href={['#features','#how-it-works','#trust','#faq'][i]} onClick={() => setMenuOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground">{l}</a>
              ))}
              <button onClick={() => navigate('/simple-register')} className="w-full mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Get Started</button>
            </div>
          )}
        </nav>

        <main>
          {/* ── Hero ── */}
          <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 -z-20" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Copy */}
                <Reveal>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Family Operating System
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] tracking-tight mb-6">
                    Your family runs on chats, memory… and guesswork.
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
                    Expenses are in WhatsApp. Reports are in gallery. Tasks are in someone's head.{' '}
                    <span className="text-foreground font-medium">KutumbOS turns this into a system.</span>
                  </p>
                  <div className="flex flex-wrap gap-3 mb-10">
                    <button onClick={() => navigate('/simple-register')} className="inline-flex items-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20">
                      Start in 2 minutes
                    </button>
                    <a href="#features" className="inline-flex items-center px-6 py-3 rounded-xl border border-border bg-card text-foreground font-medium text-sm hover:bg-secondary transition-all">
                      Try it live ↓
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-6">
                    {[{ Icon: Smartphone, label: 'Works on mobile' }, { Icon: Zap, label: 'No setup required' }, { Icon: Shield, label: 'Private family data' }].map(({ Icon, label }) => (
                      <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon className="w-4 h-4 text-primary" />{label}
                      </div>
                    ))}
                  </div>
                </Reveal>

                {/* Interactive demo card */}
                <Reveal delay={150}>
                  <div className="relative w-full max-w-md mx-auto">
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-2xl shadow-primary/5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-xs font-medium text-muted-foreground">Live Demo</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Sharma Family</span>
                      </div>
                      {/* Action buttons */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {([['expense', IndianRupee, 'text-green-500', 'Add expense'], ['health', FileHeart, 'text-blue-500', 'Upload report'], ['task', ListChecks, 'text-amber-500', 'Assign task']] as const).map(([type, Icon, ic, label], idx) => (
                          <button key={label} onClick={() => handleAction(type as ActivityItem['type'])}
                            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 cursor-pointer
                              ${activeTab === idx ? 'border-primary/30 bg-primary/5 scale-[1.02]' : 'border-border hover:border-primary/20 hover:bg-secondary'}`}>
                            <Icon className={`w-4 h-4 ${ic}`} />
                            <span className="text-[10px] font-medium text-foreground">{label}</span>
                          </button>
                        ))}
                      </div>
                      {/* Feed */}
                      <div className="space-y-2 min-h-[140px]">
                        {activity.map(item => {
                          const { Icon, bg, ic } = TYPE_META[item.type];
                          return (
                            <div key={item.id} className={`flex items-center gap-3 p-2.5 rounded-lg transition-all duration-300 ${bg} ${item.fresh ? 'scale-[1.02] shadow-sm' : ''}`}
                              style={{ opacity: 1, transform: item.fresh ? 'translateY(-2px)' : 'none' }}>
                              <Icon className={`w-4 h-4 ${ic} shrink-0`} />
                              <span className="text-xs font-medium text-foreground flex-1">{item.label}</span>
                              <CircleCheckBig className="w-3.5 h-3.5 text-green-500 shrink-0" />
                              <span className="text-[10px] text-muted-foreground">{item.time}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {/* Toast */}
                    {lastAdded && (
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-4 py-1.5 rounded-full shadow-lg animate-bounce">
                        ✓ {lastAdded}
                      </div>
                    )}
                    <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-3xl -z-10" />
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* ── Problems section ── */}
          <section className="py-20 lg:py-28 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Reveal className="text-center mb-14">
                <span className="text-sm font-medium text-primary mb-3 block">Sound familiar?</span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">This already happens in your family</h2>
              </Reveal>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {PROBLEM_STORIES.map((p, i) => {
                  const icons = [CircleHelp, FileSearch, TriangleAlert, Brain];
                  const colors = ['red','blue','amber','purple'];
                  const Icon = icons[i]; const c = colors[i];
                  return (
                    <Reveal key={i} delay={i * 80}>
                      <button onClick={() => setProblemClicked(problemClicked === i ? null : i)}
                        className={`w-full text-left p-6 rounded-2xl border bg-card transition-all duration-300 hover:border-${c}-500/30 group cursor-pointer`}>
                        <div className={`w-10 h-10 rounded-xl bg-${c}-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <Icon className={`w-5 h-5 text-${c}-500`} />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">{p.title}</h3>
                        {problemClicked === i
                          ? <p className="text-sm text-primary font-medium">{p.story}</p>
                          : <p className="text-sm text-muted-foreground">Click to see the real story</p>}
                      </button>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── Chaos → System ── */}
          <section className="py-20 lg:py-28 bg-secondary/30">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <Reveal className="text-center mb-14">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">From chaos → to system</h2>
                <p className="text-muted-foreground mt-3">Every problem your family has, solved</p>
              </Reveal>
              <div className="space-y-4">
                {[
                  [MessageCircle,'Chat-based','Lost in messages',LayoutDashboard,'Structured dashboard','Everything at a glance'],
                  [Brain,'Memory-driven','One person knows all',Database,'Tracked data','Searchable records'],
                  [Puzzle,'Scattered tools','WhatsApp + Notes + Gallery',Users,'Clear responsibilities','Everyone knows their role'],
                ].map(([LIcon,lt,ls,RIcon,rt,rs], i) => (
                  <Reveal key={i} delay={i * 80}>
                    <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-stretch">
                      <div className="flex items-center gap-3 p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                        <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                          {/* @ts-ignore */}
                          <LIcon className="w-4 h-4 text-destructive" />
                        </div>
                        <div><div className="text-sm font-semibold">{lt as string}</div><div className="text-xs text-muted-foreground mt-0.5">{ls as string}</div></div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <ArrowRight className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          {/* @ts-ignore */}
                          <RIcon className="w-4 h-4 text-primary" />
                        </div>
                        <div><div className="text-sm font-semibold">{rt as string}</div><div className="text-xs text-muted-foreground mt-0.5">{rs as string}</div></div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
              <Reveal className="text-center mt-10">
                <a href="#how-it-works" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity hover:shadow-lg hover:shadow-primary/20">
                  See how it works <ArrowRight className="w-4 h-4" />
                </a>
              </Reveal>
            </div>
          </section>

          {/* ── Features ── */}
          <section id="features" className="py-20 lg:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Reveal className="text-center mb-14">
                <span className="text-sm font-medium text-primary mb-3 block">Modules</span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything your family needs — in one place</h2>
                <p className="text-muted-foreground mt-3 max-w-lg mx-auto">Click any module to try it live</p>
              </Reveal>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { Icon: IndianRupee, color: 'green',  title: 'Expenses', desc: 'Track every rupee across the family' },
                  { Icon: FileHeart,   color: 'rose',   title: 'Health',   desc: 'Store and access medical records' },
                  { Icon: ListChecks,  color: 'amber',  title: 'Tasks',    desc: 'Assign and track responsibilities' },
                  { Icon: Lock,        color: 'purple', title: 'Access',   desc: 'Role-based family permissions' },
                ].map(({ Icon, color, title, desc }, i) => (
                  <Reveal key={title} delay={i * 80}>
                    <button onClick={() => navigate('/simple-register')}
                      className={`w-full text-left p-6 rounded-2xl border bg-card transition-all hover:border-${color}-500/20 hover:shadow-md group`}>
                      <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-5 h-5 text-${color}-500`} />
                      </div>
                      <h3 className="font-semibold mb-1">{title}</h3>
                      <p className="text-sm text-muted-foreground">{desc}</p>
                    </button>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── How it works ── */}
          <section id="how-it-works" className="py-20 lg:py-28 bg-secondary/30">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <Reveal className="text-center mb-14">
                <span className="text-sm font-medium text-primary mb-3 block">Getting started</span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Set up in under 2 minutes</h2>
                <p className="text-muted-foreground mt-3">Try the onboarding right here</p>
              </Reveal>
              {/* Step tabs */}
              <div className="flex items-center justify-center gap-2 mb-10">
                {[{ Icon: House, label: 'Create Family' }, { Icon: Users, label: 'Invite Members' }, { Icon: LayoutDashboard, label: 'Start Using' }].map(({ Icon, label }, i) => (
                  <div key={label} className="flex items-center gap-2">
                    <button onClick={() => setOnboardStep(i)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${onboardStep === i ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
                      <Icon className="w-3 h-3" /><span className="hidden sm:inline">{label}</span><span className="sm:hidden">{i+1}</span>
                    </button>
                    {i < 2 && <div className="w-8 h-0.5 rounded-full bg-border" />}
                  </div>
                ))}
              </div>
              <Reveal>
                <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-lg">
                  {onboardStep === 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center"><House className="w-4 h-4 text-primary" /></div>
                        <div><h3 className="font-semibold">Name your family</h3><p className="text-xs text-muted-foreground">This creates your private family space</p></div>
                      </div>
                      <div className="relative">
                        <input type="text" placeholder="e.g., Sharma Family" value={familyName}
                          onChange={e => setFamilyName(e.target.value)}
                          className="w-full p-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30" />
                        <button onClick={() => setFamilyName(FAMILY_SUGGESTIONS[Math.floor(Math.random() * FAMILY_SUGGESTIONS.length)])}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-primary hover:underline">Try suggestion</button>
                      </div>
                      <button onClick={() => setOnboardStep(1)}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                        Create Family <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {onboardStep === 1 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center"><Users className="w-4 h-4 text-primary" /></div>
                        <div><h3 className="font-semibold">Invite your family</h3><p className="text-xs text-muted-foreground">Share a link or enter their email</p></div>
                      </div>
                      <input type="email" placeholder="member@email.com" className="w-full p-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                      <button onClick={() => setOnboardStep(2)}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                        Send Invite <ArrowRight className="w-4 h-4" />
                      </button>
                      <button onClick={() => setOnboardStep(2)} className="w-full text-xs text-muted-foreground hover:text-foreground text-center">Skip for now →</button>
                    </div>
                  )}
                  {onboardStep === 2 && (
                    <div className="space-y-4 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto">
                        <CircleCheckBig className="w-8 h-8 text-green-500" />
                      </div>
                      <h3 className="font-semibold text-lg">You're all set{familyName ? `, ${familyName}` : ''}!</h3>
                      <p className="text-sm text-muted-foreground">Your family system is ready. Start adding expenses, tasks, and health records.</p>
                      <button onClick={() => navigate('/simple-register')}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                        Go to Dashboard <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </Reveal>
            </div>
          </section>

          {/* ── Security ── */}
          <section id="trust" className="py-20 lg:py-28 bg-secondary/30">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <Reveal className="text-center mb-14">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Your family data stays yours</h2>
                <p className="text-muted-foreground mt-3 max-w-lg mx-auto">Built with privacy-first architecture from day one</p>
              </Reveal>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { Icon: ShieldCheck, title: 'Family-level isolation',  desc: 'Your data is completely separated from other families' },
                  { Icon: Lock,        title: 'Role-based access',        desc: 'Control who sees and manages what in your family' },
                  { Icon: EyeOff,      title: 'No ads, ever',             desc: 'Your family data is never used for advertising' },
                  { Icon: Ban,         title: 'No data selling',          desc: 'We never sell, share, or monetize your information' },
                ].map(({ Icon, title, desc }, i) => (
                  <Reveal key={title} delay={i * 80}>
                    <div className="flex gap-4 p-5 rounded-2xl border border-border bg-card">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div><h3 className="font-semibold text-sm mb-1">{title}</h3><p className="text-sm text-muted-foreground">{desc}</p></div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── Family Score ── */}
          <section className="py-20 lg:py-28">
            <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
              <Reveal className="text-center mb-10">
                <span className="text-sm font-medium text-primary mb-3 block">Family score</span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">How organized is your family?</h2>
                <p className="text-muted-foreground mt-3">Most families score below 50%</p>
              </Reveal>
              <Reveal>
                <div ref={scoresRef} className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-lg space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-border">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-amber-500" />
                    </div>
                    <div><div className="font-bold text-lg">Your Family Score</div><div className="text-xs text-muted-foreground">Based on typical Indian family</div></div>
                  </div>
                  {[
                    { label: 'Spending clarity', value: scores.spending, color: 'bg-green-500' },
                    { label: 'Tasks tracked',    value: scores.tasks,    color: 'bg-amber-500' },
                    { label: 'Records stored',   value: scores.records,  color: 'bg-red-500'   },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-bold">{value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div className={`h-full rounded-full ${color} transition-all duration-1000`} style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-border">
                    <button onClick={() => navigate('/simple-register')}
                      className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                      Fix this in 2 minutes
                    </button>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section id="faq" className="py-20 lg:py-28 bg-secondary/30">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
              <Reveal className="text-center mb-14">
                <span className="text-sm font-medium text-primary mb-3 block">FAQ</span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Common questions</h2>
              </Reveal>
              <Reveal>
                <div className="space-y-3">
                  {FAQS.map((faq, i) => (
                    <div key={i} className="border border-border bg-card rounded-xl px-5 transition-shadow data-[open=true]:shadow-sm">
                      <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="flex w-full items-center justify-between py-4 text-sm font-medium text-left hover:no-underline">
                        {faq.q}
                        <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                      </button>
                      {openFaq === i && (
                        <div className="pb-4 text-sm text-muted-foreground">{faq.a}</div>
                      )}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>

          {/* ── Final CTA ── */}
          <section id="final-cta" className="py-20 lg:py-28 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <Reveal>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">Stop managing your family in chaos</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">You already have the data. You just don't have a system.</p>
                <button onClick={() => navigate('/simple-register')}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-medium text-base hover:shadow-xl hover:shadow-primary/20 transition-shadow">
                  Start your family system <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-xs text-muted-foreground mt-4">Free to start · No credit card required · 2 minutes setup</p>
              </Reveal>
            </div>
          </section>
        </main>

        {/* ── Footer ── */}
        <footer className="border-t border-border py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">K</span>
              </div>
              <span className="font-semibold text-sm">KutumbOS</span>
            </div>
            <p className="text-xs text-muted-foreground">© 2026 KutumbOS. Your family, organized.</p>
          </div>
        </footer>
      </div>
  );
}
