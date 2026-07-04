import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

const styles = `
@keyframes float1 { 0%,100%{transform:translate(0,0) rotate(0deg)} 33%{transform:translate(30px,-30px) rotate(120deg)} 66%{transform:translate(-20px,20px) rotate(240deg)} }
@keyframes float2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-40px,20px) scale(1.1)} }
@keyframes float3 { 0%,100%{transform:translate(0,0) rotate(0deg)} 50%{transform:translate(20px,40px) rotate(180deg)} }
@keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
@keyframes fadeInUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeInScale { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
@keyframes countUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes slideInRight { from{opacity:0;transform:translateX(60px)} to{opacity:1;transform:translateX(0)} }
@keyframes pulseGlow { 0%,100%{box-shadow:0 0 20px rgba(99,102,241,0.3)} 50%{box-shadow:0 0 40px rgba(99,102,241,0.6)} }
@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
@keyframes typing { from{width:0} to{width:100%} }
@keyframes blink { 50%{border-color:transparent} }

*{box-sizing:border-box;scroll-behavior:smooth}
html,body{margin:0;padding:0}
.animate-fade-in-up{animation:fadeInUp 0.7s ease-out forwards}
.animate-fade-in-scale{animation:fadeInScale 0.6s ease-out forwards}
.animate-slide-right{animation:slideInRight 0.7s ease-out forwards}
.animate-count-up{animation:countUp 0.5s ease-out forwards}
.animate-gradient{background-size:200% auto;animation:gradientShift 4s ease infinite}
.animate-shimmer{background-size:200% 100%;animation:shimmer 3s ease-in-out infinite}
.animate-pulse-glow{animation:pulseGlow 2s ease-in-out infinite}
.animate-float1{animation:float1 8s ease-in-out infinite}
.animate-float2{animation:float2 10s ease-in-out infinite}
.animate-float3{animation:float3 12s ease-in-out infinite}
.stagger-1{animation-delay:0.1s;opacity:0}
.stagger-2{animation-delay:0.2s;opacity:0}
.stagger-3{animation-delay:0.3s;opacity:0}
.stagger-4{animation-delay:0.4s;opacity:0}
.stagger-5{animation-delay:0.5s;opacity:0}
.stagger-6{animation-delay:0.6s;opacity:0}
`;

function ThemeIcon({ dark }: { dark: boolean }) {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      {dark ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      )}
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg className="w-8 h-8 opacity-20 mb-2" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
    </svg>
  );
}

function SocialIcon({ type }: { type: string }) {
  const props = { className: "w-5 h-5", fill: "currentColor" };
  switch (type) {
    case "twitter": return <svg {...props} viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
    case "github": return <svg {...props} viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>;
    case "linkedin": return <svg {...props} viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>;
    default: return <svg {...props} viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /></svg>;
  }
}

export default function Genrate({
  accentColor = '#6366F1',
  dark: initialDark = false,
  onThemeToggle,
}) {
  const [dark, setDark] = useState(initialDark);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [visibleSections, setVisibleSections] = useState>(new Set());
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [countsVisible, setCountsVisible] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('genrate-theme');
    if (stored !== null) setDark(stored === 'dark');
  }, []);

  useEffect(() => {
    localStorage.setItem('genrate-theme', dark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ['hero', 'features', 'stats', 'testimonials', 'cta'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set(prev).add(entry.target.id));
        }
      });
    }, { threshold: 0.15 });
    const sections = document.querySelectorAll('[data-observe]');
    sections.forEach(el => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    if (visibleSections.has('stats')) {
      setCountsVisible(true);
    }
  }, [visibleSections]);

  const toggleTheme = useCallback(() => {
    setDark(prev => { const next = !prev; onThemeToggle?.(); return next; });
  }, [onThemeToggle]);

  const navLinks = [
    { id: 'features', label: 'Features' },
    { id: 'stats', label: 'Stats' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'cta', label: 'Get Started' },
  ];

  return (
    <div className={dark ? 'dark' : ''}>
      <style>{styles}</style>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg shadow-black/5'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a href="#" className="flex items-center gap-2 group">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-110`}>A</div>
              <span className={`font-bold text-lg ${dark ? 'text-white' : 'text-gray-900'}`}>Acme</span>
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <a key={link.id} href={`#${link.id}`}
                  onClick={(e) => { e.preventDefault(); document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' }); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeSection === link.id
                      ? `text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20`
                      : `${dark ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
                  }`}
                >{link.label}</a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  dark ? 'text-yellow-400 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Toggle theme"
              ><ThemeIcon dark={dark} /></button>

              <a href="#cta" onClick={(e) => { e.preventDefault(); document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="hidden md:inline-flex items-center px-5 py-2.5 rounded-xl text-white text-sm font-semibold bg-gradient-to-r animate-gradient hover:shadow-lg transition-all duration-300 hover:scale-105"
                style={{ backgroundImage: `linear-gradient(135deg, ${accentColor}, #7c3aed, ${accentColor})` }}
              >Get Started <ArrowIcon /></a>

              <button onClick={() => setMobileOpen(!mobileOpen)}
                className={`md:hidden p-2 rounded-lg ${
                  dark ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
                }`}
                aria-label="Menu"
              ><MenuIcon open={mobileOpen} /></button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className={`px-4 py-3 space-y-1 border-t ${
            dark ? 'border-white/10 bg-gray-900/95' : 'border-gray-200 bg-white/95'
          }`}>
            {navLinks.map(link => (
              <a key={link.id} href={`#${link.id}`}
                onClick={(e) => { e.preventDefault(); document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' }); setMobileOpen(false); }}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  activeSection === link.id
                    ? `text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20`
                    : `${dark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
                }`}
              >{link.label}</a>
            ))}
            <a href="#cta" onClick={(e) => { e.preventDefault(); document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' }); setMobileOpen(false); }}
              className={`block px-4 py-2.5 rounded-lg text-sm font-semibold text-center text-white bg-gradient-to-r from-indigo-600 to-purple-700`}
            >Get Started</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="hero" className={`relative min-h-screen flex items-center overflow-hidden ${
        dark ? 'bg-gray-950' : 'bg-gray-50'
      }`}>
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl animate-float1`}
            style={{ background: `radial-gradient(circle, ${accentColor}, transparent 70%)` }}
          />
          <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 blur-3xl animate-float2`}
            style={{ background: `radial-gradient(circle, #7c3aed, transparent 70%)` }}
          />
          <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl animate-float3"
            style={{ background: `radial-gradient(circle, ${accentColor}, transparent 70%)` }}
          />
          <div className={`absolute inset-0 ${
            dark
              ? 'bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)]'
              : 'bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)]'
          }`} />
        </div>

        {/* Grid pattern overlay */}
        <div className={`absolute inset-0 opacity-[0.03] ${
          dark ? '' : ''
        }`}
          style={{ backgroundImage: `linear-gradient(${accentColor} 1px, transparent 1px), linear-gradient(90deg, ${accentColor} 1px, transparent 1px)`, backgroundSize: '60px 60px' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-32 md:py-40">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`${visibleSections.has('hero') ? 'animate-fade-in-up' : 'opacity-0'}`} data-observe id="hero-observe">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6 border"
                style={{ borderColor: `${accentColor}40`, color: accentColor, backgroundColor: `${accentColor}10` }}
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                Now in Public Beta
              </div>

              <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 ${
                dark ? 'text-white' : 'text-gray-900'
              }`}>
                Build Smarter
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r animate-gradient"
                  style={{ backgroundImage: `linear-gradient(135deg, ${accentColor}, #7c3aed, #ec4899, ${accentColor})`, backgroundSize: '200% auto' }}
                >Faster, Together</span>
              </h1>

              <p className={`text-lg md:text-xl mb-8 max-w-lg ${
                dark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                The all-in-one platform that combines powerful automation, real-time collaboration, and AI-driven insights to supercharge your workflow.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#cta" onClick={(e) => { e.preventDefault(); document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-white font-semibold text-base hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse-glow"
                  style={{ background: `linear-gradient(135deg, ${accentColor}, #7c3aed)` }}
                >Start Free Trial <ArrowIcon /></a>
                <a href="#features"
                  onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className={`inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold text-base border transition-all duration-300 hover:scale-105 ${
                    dark
                      ? 'border-white/20 text-white hover:bg-white/10'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >Learn More</a>
              </div>

              <div className="flex items-center gap-4 mt-10">
                <div className="flex -space-x-2">
                  {['#6366F1','#EC4899','#22C55E','#F97316'].map((color, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 ${dark ? 'border-gray-800' : 'border-white'} flex items-center justify-center text-white text-[10px] font-bold`}
                      style={{ backgroundColor: color }}
                    >{['SC','MR','EN','JD'][i]}</div>
                  ))}
                </div>
                <div className={`text-sm ${
                  dark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <span className="font-semibold text-gray-900 dark:text-white">4.9/5</span> from 2,000+ reviews
                </div>
              </div>
            </div>

            {/* Hero right - mockup */}
            <div className={`relative ${visibleSections.has('hero') ? 'animate-fade-in-scale' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              <div className={`relative rounded-2xl overflow-hidden shadow-2xl border ${
                dark ? 'border-white/10 bg-gray-900' : 'border-gray-200 bg-white'
              }`}>
                <div className={`flex items-center gap-1.5 px-4 py-3 border-b ${
                  dark ? 'border-white/10 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <div className={`ml-4 text-xs ${
                    dark ? 'text-gray-500' : 'text-gray-400'
                  }`}>app.acme.com</div>
                </div>
                <div className="p-6 space-y-4">
                  <div className={`h-4 rounded-full w-3/4 animate-shimmer ${
                    dark ? 'bg-gray-800' : 'bg-gray-200'
                  }`} />
                  <div className={`h-4 rounded-full w-1/2 animate-shimmer ${
                    dark ? 'bg-gray-800' : 'bg-gray-200'
                  }`} />
                  <div className="grid grid-cols-3 gap-3 mt-6">
                    {[1,2,3].map(i => (
                      <div key={i} className={`p-3 rounded-xl border ${
                        dark ? 'border-white/5 bg-gray-800/50' : 'border-gray-100 bg-gray-50'
                      }`}>
                        <div className={`w-8 h-8 rounded-lg mb-2 animate-shimmer ${
                          dark ? 'bg-gray-700' : 'bg-gray-200'
                        }`} />
                        <div className={`h-3 rounded w-3/4 animate-shimmer ${
                          dark ? 'bg-gray-700' : 'bg-gray-200'
                        }`} />
                      </div>
                    ))}
                  </div>
                  <div className={`h-20 rounded-xl animate-shimmer ${
                    dark ? 'bg-gray-800' : 'bg-gray-200'
                  }`} />
                </div>
              </div>

              {/* Floating badge */}
              <div className={`absolute -bottom-4 -right-4 px-4 py-2 rounded-xl shadow-lg backdrop-blur-sm border text-sm font-medium animate-float3 ${
                dark ? 'bg-gray-800/90 border-white/10 text-white' : 'bg-white/90 border-gray-200 text-gray-800'
              }`}>
                <span className="text-green-400">▲</span> 99.9% Uptime
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className={`text-xs ${
            dark ? 'text-gray-600' : 'text-gray-400'
          }`}>Scroll to explore</span>
          <div className={`w-5 h-8 rounded-full border-2 flex items-start justify-center p-1 ${
            dark ? 'border-gray-700' : 'border-gray-300'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${
              dark ? 'bg-gray-400' : 'bg-gray-500'
            }`} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className={`relative py-24 md:py-32 overflow-hidden ${
        dark ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-4 ${
              dark ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
            }`}>Everything You Need</span>
            <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${
              dark ? 'text-white' : 'text-gray-900'
            }`}>
              Powerful Features for
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r animate-gradient"
                style={{ backgroundImage: `linear-gradient(135deg, ${accentColor}, #7c3aed)`, backgroundSize: '200% auto' }}
              >Modern Teams</span>
            </h2>
            <p className={`text-lg ${
              dark ? 'text-gray-400' : 'text-gray-600'
            }`}>Everything you need to build, deploy, and scale your next project.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className={`group relative p-6 rounded-2xl border transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
              visibleSections.has('features') ? 'animate-fade-in-up' : 'opacity-0'
            } stagger-1 ${
              dark
                ? 'border-white/5 bg-gray-800/50 hover:border-white/20 hover:shadow-indigo-500/10'
                : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-indigo-500/10'
            }`}
              style={{ animationDelay: '0.0s' }}
              data-observe
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                dark ? 'bg-indigo-900/30' : 'bg-indigo-100'
              }`}>{'⚡'}</div>
              <h3 className={`text-lg font-semibold mb-2 ${
                dark ? 'text-white' : 'text-gray-900'
              }`}>Lightning Fast</h3>
              <p className={`text-sm leading-relaxed ${
                dark ? 'text-gray-400' : 'text-gray-600'
              }`}>Optimized for performance with sub-second response times and instant updates across all devices.</p>
              <div className={`mt-4 flex items-center gap-1 text-sm font-medium ${
                dark ? 'text-indigo-400' : 'text-indigo-600'
              } opacity-0 group-hover:opacity-100 transition-opacity`}>
                Learn more <span className="text-lg">→</span>
              </div>
            </div>
            <div className={`group relative p-6 rounded-2xl border transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
              visibleSections.has('features') ? 'animate-fade-in-up' : 'opacity-0'
            } stagger-2 ${
              dark
                ? 'border-white/5 bg-gray-800/50 hover:border-white/20 hover:shadow-indigo-500/10'
                : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-indigo-500/10'
            }`}
              style={{ animationDelay: '0.1s' }}
              data-observe
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                dark ? 'bg-indigo-900/30' : 'bg-indigo-100'
              }`}>{'🛡️'}</div>
              <h3 className={`text-lg font-semibold mb-2 ${
                dark ? 'text-white' : 'text-gray-900'
              }`}>Secure by Default</h3>
              <p className={`text-sm leading-relaxed ${
                dark ? 'text-gray-400' : 'text-gray-600'
              }`}>Enterprise-grade security with end-to-end encryption, SOC 2 compliance, and zero-trust architecture.</p>
              <div className={`mt-4 flex items-center gap-1 text-sm font-medium ${
                dark ? 'text-indigo-400' : 'text-indigo-600'
              } opacity-0 group-hover:opacity-100 transition-opacity`}>
                Learn more <span className="text-lg">→</span>
              </div>
            </div>
            <div className={`group relative p-6 rounded-2xl border transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
              visibleSections.has('features') ? 'animate-fade-in-up' : 'opacity-0'
            } stagger-3 ${
              dark
                ? 'border-white/5 bg-gray-800/50 hover:border-white/20 hover:shadow-indigo-500/10'
                : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-indigo-500/10'
            }`}
              style={{ animationDelay: '0.2s' }}
              data-observe
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                dark ? 'bg-indigo-900/30' : 'bg-indigo-100'
              }`}>{'📊'}</div>
              <h3 className={`text-lg font-semibold mb-2 ${
                dark ? 'text-white' : 'text-gray-900'
              }`}>Smart Analytics</h3>
              <p className={`text-sm leading-relaxed ${
                dark ? 'text-gray-400' : 'text-gray-600'
              }`}>Real-time insights with AI-powered dashboards, custom reports, and predictive trend analysis.</p>
              <div className={`mt-4 flex items-center gap-1 text-sm font-medium ${
                dark ? 'text-indigo-400' : 'text-indigo-600'
              } opacity-0 group-hover:opacity-100 transition-opacity`}>
                Learn more <span className="text-lg">→</span>
              </div>
            </div>
            <div className={`group relative p-6 rounded-2xl border transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
              visibleSections.has('features') ? 'animate-fade-in-up' : 'opacity-0'
            } stagger-4 ${
              dark
                ? 'border-white/5 bg-gray-800/50 hover:border-white/20 hover:shadow-indigo-500/10'
                : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-indigo-500/10'
            }`}
              style={{ animationDelay: '0.3s' }}
              data-observe
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                dark ? 'bg-indigo-900/30' : 'bg-indigo-100'
              }`}>{'🌍'}</div>
              <h3 className={`text-lg font-semibold mb-2 ${
                dark ? 'text-white' : 'text-gray-900'
              }`}>Global Scale</h3>
              <p className={`text-sm leading-relaxed ${
                dark ? 'text-gray-400' : 'text-gray-600'
              }`}>99.99% uptime with auto-scaling infrastructure across 30+ global data centers.</p>
              <div className={`mt-4 flex items-center gap-1 text-sm font-medium ${
                dark ? 'text-indigo-400' : 'text-indigo-600'
              } opacity-0 group-hover:opacity-100 transition-opacity`}>
                Learn more <span className="text-lg">→</span>
              </div>
            </div>
            <div className={`group relative p-6 rounded-2xl border transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
              visibleSections.has('features') ? 'animate-fade-in-up' : 'opacity-0'
            } stagger-5 ${
              dark
                ? 'border-white/5 bg-gray-800/50 hover:border-white/20 hover:shadow-indigo-500/10'
                : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-indigo-500/10'
            }`}
              style={{ animationDelay: '0.4s' }}
              data-observe
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                dark ? 'bg-indigo-900/30' : 'bg-indigo-100'
              }`}>{'🤝'}</div>
              <h3 className={`text-lg font-semibold mb-2 ${
                dark ? 'text-white' : 'text-gray-900'
              }`}>Team Collaboration</h3>
              <p className={`text-sm leading-relaxed ${
                dark ? 'text-gray-400' : 'text-gray-600'
              }`}>Built for teams with real-time editing, version control, and granular permission management.</p>
              <div className={`mt-4 flex items-center gap-1 text-sm font-medium ${
                dark ? 'text-indigo-400' : 'text-indigo-600'
              } opacity-0 group-hover:opacity-100 transition-opacity`}>
                Learn more <span className="text-lg">→</span>
              </div>
            </div>
            <div className={`group relative p-6 rounded-2xl border transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
              visibleSections.has('features') ? 'animate-fade-in-up' : 'opacity-0'
            } stagger-6 ${
              dark
                ? 'border-white/5 bg-gray-800/50 hover:border-white/20 hover:shadow-indigo-500/10'
                : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-indigo-500/10'
            }`}
              style={{ animationDelay: '0.5s' }}
              data-observe
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                dark ? 'bg-indigo-900/30' : 'bg-indigo-100'
              }`}>{'🔌'}</div>
              <h3 className={`text-lg font-semibold mb-2 ${
                dark ? 'text-white' : 'text-gray-900'
              }`}>API First</h3>
              <p className={`text-sm leading-relaxed ${
                dark ? 'text-gray-400' : 'text-gray-600'
              }`}>RESTful and GraphQL APIs with webhook support, SDKs in 12 languages, and detailed documentation.</p>
              <div className={`mt-4 flex items-center gap-1 text-sm font-medium ${
                dark ? 'text-indigo-400' : 'text-indigo-600'
              } opacity-0 group-hover:opacity-100 transition-opacity`}>
                Learn more <span className="text-lg">→</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className={`relative py-20 overflow-hidden ${
        dark ? 'bg-gray-950' : 'bg-indigo-50'
      }`} data-observe>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        <div className={`text-center ${countsVisible ? 'animate-count-up' : 'opacity-0'}`} style={{ animationDelay: '0.00s' }}>
              <div className={`text-3xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700`}>99.9%</div>
              <div className={`text-sm ${
                dark ? 'text-gray-400' : 'text-gray-600'
              }`}>Uptime SLA</div>
            </div>
            <div className={`text-center ${countsVisible ? 'animate-count-up' : 'opacity-0'}`} style={{ animationDelay: '0.15s' }}>
              <div className={`text-3xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700`}>10M+</div>
              <div className={`text-sm ${
                dark ? 'text-gray-400' : 'text-gray-600'
              }`}>Requests/Day</div>
            </div>
            <div className={`text-center ${countsVisible ? 'animate-count-up' : 'opacity-0'}`} style={{ animationDelay: '0.30s' }}>
              <div className={`text-3xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700`}>50K+</div>
              <div className={`text-sm ${
                dark ? 'text-gray-400' : 'text-gray-600'
              }`}>Active Users</div>
            </div>
            <div className={`text-center ${countsVisible ? 'animate-count-up' : 'opacity-0'}`} style={{ animationDelay: '0.45s' }}>
              <div className={`text-3xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700`}>150+</div>
              <div className={`text-sm ${
                dark ? 'text-gray-400' : 'text-gray-600'
              }`}>Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className={`relative py-24 md:py-32 overflow-hidden ${
        dark ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-4 ${
            dark ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
          }`}>What People Say</span>
          <h2 className={`text-3xl md:text-5xl font-bold mb-12 ${
            dark ? 'text-white' : 'text-gray-900'
          }`}>Loved by Teams Worldwide</h2>

          <div className="relative">
            <div className={`relative p-8 md:p-12 rounded-2xl border ${
              visibleSections.has('testimonials') ? 'animate-fade-in-up' : 'opacity-0'
            } ${
              dark ? 'border-white/10 bg-gray-800/50' : 'border-gray-100 bg-gray-50'
            }`} data-observe>
              <QuoteIcon />
              <p className={`text-lg md:text-xl leading-relaxed mb-8 italic ${
                dark ? 'text-gray-300' : 'text-gray-700'
              }`}>"{testimonials[activeTestimonial].quote}"</p>
              <div className="flex items-center justify-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white text-sm font-bold`}>{testimonials[activeTestimonial].avatar}</div>
                <div className="text-left">
                  <div className={`font-semibold text-sm ${
                    dark ? 'text-white' : 'text-gray-900'
                  }`}>{testimonials[activeTestimonial].name}</div>
                  <div className={`text-xs ${
                    dark ? 'text-gray-500' : 'text-gray-500'
                  }`}>{testimonials[activeTestimonial].role}</div>
                </div>
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
                            <button key={i} onClick={() => setActiveTestimonial(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeTestimonial === i
                    ? `w-8 bg-indigo-500`
                    : `${dark ? 'bg-gray-700' : 'bg-gray-300'} hover:bg-indigo-300`
                }`}
                aria-label={`Testimonial ${i + 1}`}
              />
              <button key={i} onClick={() => setActiveTestimonial(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeTestimonial === i
                    ? `w-8 bg-indigo-500`
                    : `${dark ? 'bg-gray-700' : 'bg-gray-300'} hover:bg-indigo-300`
                }`}
                aria-label={`Testimonial ${i + 1}`}
              />
              <button key={i} onClick={() => setActiveTestimonial(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeTestimonial === i
                    ? `w-8 bg-indigo-500`
                    : `${dark ? 'bg-gray-700' : 'bg-gray-300'} hover:bg-indigo-300`
                }`}
                aria-label={`Testimonial ${i + 1}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className={`relative py-24 overflow-hidden ${
        dark ? 'bg-gray-950' : 'bg-indigo-50'
      }`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${
            dark ? 'from-gray-900 to-transparent' : 'from-white to-transparent'
          }`} />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className={`p-8 md:p-12 rounded-3xl border backdrop-blur-sm ${
            dark
              ? 'bg-gray-800/50 border-white/10'
              : 'bg-white/80 border-gray-200'
          }`}
            style={{ boxShadow: `0 0 60px ${accentColor}15` }}
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              dark ? 'text-white' : 'text-gray-900'
            }`}>
              Ready to Get Started?
            </h2>
            <p className={`text-lg mb-8 max-w-lg mx-auto ${
              dark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Join 50,000+ teams already building smarter. Start your free trial today — no credit card required.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" placeholder="Enter your email"
                className={`flex-1 px-5 py-3 rounded-xl text-sm border outline-none transition-all duration-200 focus:ring-2 ${
                  dark
                    ? 'bg-gray-900 border-white/10 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
              />
              <button className="px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{ background: `linear-gradient(135deg, ${accentColor}, #7c3aed)` }}
              >Get Started <ArrowIcon /></button>
            </div>

            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-1.5 text-xs text-gray-400"><CheckIcon /> No credit card</div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400"><CheckIcon /> 14-day free trial</div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400"><CheckIcon /> Cancel anytime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative border-t ${
        dark ? 'border-white/10 bg-gray-950' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 md:col-span-1">
              <a href="#" className="flex items-center gap-2 mb-4">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white font-bold text-sm`}>A</div>
                <span className={`font-bold text-lg ${
                  dark ? 'text-white' : 'text-gray-900'
                }`}>Acme</span>
              </a>
              <p className={`text-sm mb-6 max-w-xs ${
                dark ? 'text-gray-500' : 'text-gray-500'
              }`}>Building the future of work, one feature at a time.</p>
              <div className="flex gap-3">
                {['twitter', 'github', 'linkedin'].map(platform => (
                  <a key={platform} href="#" className={`p-2 rounded-lg transition-all hover:scale-110 ${
                    dark ? 'text-gray-500 hover:text-indigo-400 hover:bg-indigo-900/20' : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-100'
                  }`} aria-label={platform}>
                    <SocialIcon type={platform} />
                  </a>
                ))}
              </div>
            </div>
                        <div>
              <h3 className={`font-semibold text-sm mb-4 ${
                dark ? 'text-white' : 'text-gray-900'
              }`}>Product</h3>
              <ul className="space-y-3">
                                <li>
                  <a href="#" className={`text-sm transition-colors ${
                    dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}>Features</a>
                </li>
                <li>
                  <a href="#" className={`text-sm transition-colors ${
                    dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}>Pricing</a>
                </li>
                <li>
                  <a href="#" className={`text-sm transition-colors ${
                    dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}>Integrations</a>
                </li>
                <li>
                  <a href="#" className={`text-sm transition-colors ${
                    dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}>Changelog</a>
                </li>
                <li>
                  <a href="#" className={`text-sm transition-colors ${
                    dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}>Roadmap</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className={`font-semibold text-sm mb-4 ${
                dark ? 'text-white' : 'text-gray-900'
              }`}>Company</h3>
              <ul className="space-y-3">
                                <li>
                  <a href="#" className={`text-sm transition-colors ${
                    dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}>About</a>
                </li>
                <li>
                  <a href="#" className={`text-sm transition-colors ${
                    dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}>Careers</a>
                </li>
                <li>
                  <a href="#" className={`text-sm transition-colors ${
                    dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}>Blog</a>
                </li>
                <li>
                  <a href="#" className={`text-sm transition-colors ${
                    dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}>Press</a>
                </li>
                <li>
                  <a href="#" className={`text-sm transition-colors ${
                    dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}>Partners</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className={`font-semibold text-sm mb-4 ${
                dark ? 'text-white' : 'text-gray-900'
              }`}>Resources</h3>
              <ul className="space-y-3">
                                <li>
                  <a href="#" className={`text-sm transition-colors ${
                    dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}>Documentation</a>
                </li>
                <li>
                  <a href="#" className={`text-sm transition-colors ${
                    dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}>API Reference</a>
                </li>
                <li>
                  <a href="#" className={`text-sm transition-colors ${
                    dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}>Guides</a>
                </li>
                <li>
                  <a href="#" className={`text-sm transition-colors ${
                    dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}>Community</a>
                </li>
                <li>
                  <a href="#" className={`text-sm transition-colors ${
                    dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}>Status</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className={`font-semibold text-sm mb-4 ${
                dark ? 'text-white' : 'text-gray-900'
              }`}>Legal</h3>
              <ul className="space-y-3">
                                <li>
                  <a href="#" className={`text-sm transition-colors ${
                    dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}>Privacy</a>
                </li>
                <li>
                  <a href="#" className={`text-sm transition-colors ${
                    dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}>Terms</a>
                </li>
                <li>
                  <a href="#" className={`text-sm transition-colors ${
                    dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}>Security</a>
                </li>
                <li>
                  <a href="#" className={`text-sm transition-colors ${
                    dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}>Cookies</a>
                </li>
                <li>
                  <a href="#" className={`text-sm transition-colors ${
                    dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}>GDPR</a>
                </li>
              </ul>
            </div>
          </div>

          <div className={`mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
            dark ? 'border-white/10' : 'border-gray-200'
          }`}>
            <p className={`text-xs ${
              dark ? 'text-gray-600' : 'text-gray-400'
            }`}>&copy; {new Date().getFullYear()} Acme Inc. All rights reserved.</p>
            <div className="flex gap-6 text-xs">
              <a href="#" className={dark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'}>Privacy Policy</a>
              <a href="#" className={dark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'}>Terms of Service</a>
              <a href="#" className={dark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'}>Cookie Policy</a>
            </div>
          </div>
        </div>

        {/* Back to top */}
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-6 right-6 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 z-40 ${
            scrolled
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 pointer-events-none'
          } ${
            dark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          style={{ boxShadow: scrolled ? `0 4px 20px ${accentColor}30` : 'none' }}
          aria-label="Back to top"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </footer>
    </div>
  );
}

Genrate.propTypes = {
  accentColor: PropTypes.string,
  dark: PropTypes.bool,
  onThemeToggle: PropTypes.func,
};