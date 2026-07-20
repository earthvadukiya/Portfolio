"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { viewport, clamp01 } from "@/lib/viewport-state";

const Scene = dynamic(() => import("@/components/three/scene"), { ssr: false });

/* ------------------------------------------------------------------ data */

type Skill = { n: string; i?: string };

const SKILLS: Skill[] = [
  { n: "Python", i: "devicon-python-plain colored" },
  { n: "JavaScript", i: "devicon-javascript-plain colored" },
  { n: "TypeScript", i: "devicon-typescript-plain colored" },
  { n: "React", i: "devicon-react-original colored" },
  { n: "Next.js", i: "devicon-nextjs-plain" },
  { n: "Node.js", i: "devicon-nodejs-plain colored" },
  { n: "NestJS", i: "devicon-nestjs-plain colored" },
  { n: "Express.js", i: "devicon-express-original" },
  { n: "FastAPI", i: "devicon-fastapi-plain colored" },
  { n: "PHP", i: "devicon-php-plain colored" },
  { n: "HTML5", i: "devicon-html5-plain colored" },
  { n: "CSS3", i: "devicon-css3-plain colored" },
  { n: "GraphQL", i: "devicon-graphql-plain colored" },
  { n: ".NET", i: "devicon-dot-net-plain colored" },
  { n: "Webpack", i: "devicon-webpack-plain colored" },
  { n: "Storybook", i: "devicon-storybook-plain colored" },
  { n: "WordPress", i: "devicon-wordpress-plain colored" },
  { n: "MySQL", i: "devicon-mysql-plain colored" },
  { n: "MongoDB", i: "devicon-mongodb-plain colored" },
  { n: "Supabase", i: "devicon-supabase-plain colored" },
  { n: "Redis", i: "devicon-redis-plain colored" },
  { n: "Firebase", i: "devicon-firebase-plain colored" },
  { n: "Cloudflare", i: "devicon-cloudflare-plain colored" },
  { n: "Vercel", i: "devicon-vercel-original" },
  { n: "Netlify", i: "devicon-netlify-plain colored" },
  { n: "Azure", i: "devicon-azure-plain colored" },
  { n: "Google Cloud", i: "devicon-googlecloud-plain colored" },
  { n: "Heroku", i: "devicon-heroku-plain colored" },
  { n: "Oracle", i: "devicon-oracle-original colored" },
  { n: "Git", i: "devicon-git-plain colored" },
  { n: "GitHub", i: "devicon-github-original" },
  { n: "Docker", i: "devicon-docker-plain colored" },
  { n: "Selenium", i: "devicon-selenium-original colored" },
  { n: "Canva", i: "devicon-canva-original colored" },
  { n: "Blender", i: "devicon-blender-original colored" },
  { n: "Unity", i: "devicon-unity-original" },
  { n: "Unreal Engine", i: "devicon-unrealengine-original" },
  { n: "OpenGL", i: "devicon-opengl-plain colored" },
  { n: "NPM" }, { n: "JWT" }, { n: "WindiCSS" }, { n: "WebGL" }, { n: "Web3.js" },
  { n: "Render" }, { n: "Playwright" }, { n: "Puppeteer" }, { n: "Sketch" }, { n: "SketchUp" },
  { n: "After Effects" }, { n: "nVIDIA" }, { n: "Steam" }, { n: "Epic Games" }, { n: "Xbox" },
  { n: "PlayStation" }, { n: "Riot Games" }, { n: "Ubisoft" },
];

const JOURNEY = [
  { k: "01", t: "The Spark", d: "HiAnime got shut down. Instead of waiting for someone else to rebuild it, I decided to build my own streaming platform from nothing." },
  { k: "02", t: "The Grind", d: "Dozens of failed projects. Build, break, learn, repeat — every single failure taught me more than any tutorial ever could." },
  { k: "03", t: "The Click", d: "One day it all connected. offanime.cc went live — fully automatic, self-sourcing, running 24/7 with almost no maintenance." },
  { k: "04", t: "Today", d: "I build modern web apps, AI-powered products and scalable platforms — pushing myself to learn something new on every build." },
  { k: "05", t: "What's Next", d: "Not just websites — products people remember. Real impact through technology. This is only the beginning." },
];

const STATS = [
  { num: 2, suffix: "", label: "Flagship platforms" },
  { num: 5, suffix: "", label: "Open-source engines" },
  { num: 6, suffix: "", label: "Client sites shipped" },
  { num: 100, suffix: "%", label: "Self-taught" },
];

const PRODUCTS = [
  {
    idx: "01", tag: "Founder & Developer · Live",
    name: "offanime.cc", url: "https://offanime.cc",
    desc: "A fully automatic anime & movie streaming platform — sourcing, organizing and serving a huge library 24/7 with a fast, clean watching experience and almost no manual maintenance.",
    tech: ["Automation", "Streaming", "Frontend", "Scale"],
  },
  {
    idx: "02", tag: "Founder & Developer · Live",
    name: "animetoonsekai.com", url: "https://animetoonsekai.com",
    desc: "Another streaming platform built on the lessons from offanime — a smooth, modern viewing experience powered entirely by my own scraping and proxy infrastructure.",
    tech: ["Streaming", "APIs", "UX", "Performance"],
  },
];

const REPOS = [
  { idx: "01", kind: "proxy", n: "megaplayproxy", url: "https://github.com/MonkyeDLuffy/megaplayproxy", desc: "Streaming proxy for reliable media playback across sources." },
  { idx: "02", kind: "api", n: "animepahe_api", url: "https://github.com/MonkyeDLuffy/animepahe_api", desc: "API wrapper exposing AnimePahe content in a clean format." },
  { idx: "03", kind: "scraper", n: "anime-details-api", url: "https://github.com/MonkyeDLuffy/anime-details-api", desc: "Scraper + API serving rich anime metadata on demand." },
  { idx: "04", kind: "proxy", n: "animepaheproxy", url: "https://github.com/MonkyeDLuffy/animepaheproxy", desc: "Dedicated proxy layer for AnimePahe streams and assets." },
  { idx: "05", kind: "proxy", n: "animekaiproxy", url: "https://github.com/MonkyeDLuffy/animekaiproxy", desc: "Proxy for AnimeKai sources — fast and unblocked playback." },
];

const CLIENTS = [
  { badge: "Healthcare", n: "Venus Hospital", url: "https://v0-venushospital.vercel.app/index.html", desc: "Modern, trustworthy hospital site with clear patient-facing information." },
  { badge: "Healthcare · Demo", n: "Venus Hospital II", url: "https://venus-hosptal-demo-2.netlify.app/", desc: "An alternate design direction for the Venus Hospital brand." },
  { badge: "Restaurant", n: "Om Tasty Bite", url: "https://om-tasty-bite.vercel.app/", desc: "Warm, appetizing restaurant site with rich menu presentation." },
  { badge: "Client Build", n: "Sandbox Build I", url: "https://3000-ijl98p72iv3kxtmxs33mt-b9b802c4.sandbox.novita.ai/#top", desc: "Custom web app built and delivered to a client brief." },
  { badge: "Client Build", n: "Sandbox Build II", url: "https://3000-ina6itjs9tixds8hn2t57-de59bda9.sandbox.novita.ai/", desc: "Another bespoke site built to a client's requirements." },
  { badge: "Client Build", n: "Sandbox Build III", url: "https://3000-ioevu4vx2926e5cw2kosu-b32ec7bb.sandbox.gensparksite.com/", desc: "Custom front-end build delivered for a client." },
];

const mono = (n: string) => (n.replace(/[^A-Za-z0-9]/g, "")[0] || "?").toUpperCase();

/* ------------------------------------------------------------------ page */

export default function Home() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    /* ---- viewport state feeds the 3D scene ---- */
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      viewport.scroll = h > 0 ? window.scrollY / h : 0;
      viewport.heroProgress = clamp01(window.scrollY / Math.max(1, window.innerHeight));
    };
    const dot = document.querySelector<HTMLElement>(".cursor-dot");
    const ring = document.querySelector<HTMLElement>(".cursor-ring");
    let rx = 0, ry = 0, mx = 0, my = 0, raf = 0;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      viewport.targetPointerX = (mx / window.innerWidth) * 2 - 1;
      viewport.targetPointerY = (my / window.innerHeight) * 2 - 1;
      if (dot) { dot.style.left = mx + "px"; dot.style.top = my + "px"; }
    };
    const loop = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      if (ring) { ring.style.left = rx + "px"; ring.style.top = ry + "px"; }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove);
    onScroll(); loop();

    const hoverEls = document.querySelectorAll("a, button, .chip, .hoverable");
    const enter = () => ring?.classList.add("hover");
    const leave = () => ring?.classList.remove("hover");
    hoverEls.forEach((el) => { el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave); });

    /* ---- count-up ---- */
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target as HTMLElement;
        const target = +(el.dataset.count || "0");
        let cur = 0; const step = Math.max(1, Math.ceil(target / 40));
        const t = setInterval(() => { cur += step; if (cur >= target) { cur = target; clearInterval(t); } el.textContent = String(cur); }, 30);
        countIO.unobserve(el);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => countIO.observe(el));

    /* ---- GSAP ---- */
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(".reveal, .wipe, .stagger > *", { autoAlpha: 1, clearProps: "all" });
        gsap.set(".tl-fill", { scaleY: 1 });
        return;
      }
      // simple reveals
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.fromTo(el, { y: 46, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" } });
      });
      // staggered children
      gsap.utils.toArray<HTMLElement>(".stagger").forEach((el) => {
        gsap.fromTo(el.children, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out", stagger: 0.09,
          scrollTrigger: { trigger: el, start: "top 82%" } });
      });
      // heading wipes
      gsap.utils.toArray<HTMLElement>(".wipe").forEach((el) => {
        gsap.fromTo(el, { clipPath: "inset(0 100% 0 0)", autoAlpha: 1 }, { clipPath: "inset(0 0% 0 0)", duration: 1.2, ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 86%" } });
      });
      // parallax
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
        const sp = parseFloat(el.dataset.speed || "0");
        gsap.to(el, { yPercent: sp * -14, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      });
      // hero depth wordmark
      gsap.to(".hero-word", { autoAlpha: 0, y: -120, scale: 1.15, ease: "none",
        scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true } });

      // timeline line fill
      gsap.fromTo(".tl-fill", { scaleY: 0 }, { scaleY: 1, ease: "none",
        scrollTrigger: { trigger: "#about", start: "top 55%", end: "bottom 75%", scrub: true } });

      // WORK — pinned horizontal showcase
      const work = document.querySelector<HTMLElement>("#work");
      const track = document.querySelector<HTMLElement>(".work-track");
      if (work && track) {
        const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
        gsap.to(track, {
          x: () => -dist(), ease: "none",
          scrollTrigger: {
            trigger: work, start: "top top", end: () => "+=" + dist(),
            pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
          },
        });
      }

      // refresh once layout/fonts settle
      const rf = setTimeout(() => ScrollTrigger.refresh(), 700);
      return () => clearTimeout(rf);
    }, root);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
      hoverEls.forEach((el) => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); });
      countIO.disconnect();
      ctx.revert();
    };
  }, []);

  const ROWS = 4;
  const dur = ["38s", "47s", "42s", "52s"];
  const buckets: Skill[][] = Array.from({ length: ROWS }, () => []);
  SKILLS.forEach((s, idx) => buckets[idx % ROWS].push(s));

  return (
    <>
      <Scene />
      <div className="hero-word pointer-events-none fixed inset-0 -z-[1] flex items-center justify-center">
        <span className="select-none font-display text-[26vw] font-bold leading-none tracking-tighter text-white/[0.03]">EARTH</span>
      </div>
      <div className="cursor-ring" />
      <div className="cursor-dot" />

      <main ref={root} className="relative z-10">
        {/* NAV */}
        <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-white/5 bg-black/30 px-[6vw] py-4 backdrop-blur-md">
          <a href="#top" className="font-display text-xl font-bold tracking-tight">earth<span className="text-[var(--crimson)]">.</span></a>
          <div className="hidden gap-8 text-sm text-[var(--muted-foreground)] md:flex">
            {[["Story", "#about"], ["Work", "#work"], ["Open Source", "#infra"], ["Clients", "#clients"], ["Skills", "#skills"], ["Contact", "#contact"]].map(([label, href]) => (
              <a key={href} href={href} className="transition-colors hover:text-white">{label}</a>
            ))}
          </div>
        </nav>

        {/* HERO */}
        <section id="top" className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-[6vw]">
          <div className="relative w-full max-w-3xl border border-white/10 bg-black/20 p-2 backdrop-blur-[3px]">
            <div className="relative overflow-hidden border border-white/10 px-6 py-12 sm:py-16">
              <div className="mb-6 flex items-center justify-center gap-2">
                <span className="relative flex h-3 w-3 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--crimson)] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--crimson)]" />
                </span>
                <p className="text-xs text-[var(--crimson-soft)]">Available for New Projects</p>
              </div>
              <h1 className="font-display text-center text-5xl font-extrabold leading-[1.02] tracking-tighter sm:text-6xl md:text-7xl">
                Hi, I&apos;m <span className="text-gradient text-shimmer">Earth.</span><br />I build for the web.
              </h1>
              <p className="mx-auto mt-6 max-w-xl px-2 text-center text-sm text-white/60 md:text-base">
                Self-taught full-stack developer. I build modern web apps, AI-powered products, streaming platforms and the infrastructure behind them.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <a href="#work"><LiquidButton className="rounded-full border border-white/15 text-white" size="xl">View my work</LiquidButton></a>
                <a href="#contact" className="hoverable rounded-full border border-white/15 px-7 py-3 text-sm text-white/80 transition-colors hover:border-[var(--purple)] hover:text-white">Get in touch</a>
              </div>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[0.7rem] uppercase tracking-[0.25em] text-white/40">Scroll to disperse ↓</div>
        </section>

        <div className="relative z-10 bg-background/85">
          {/* STORY — vertical timeline */}
          <section id="about" className="px-[6vw] py-[16vh]">
            <Eyebrow>01 — My Story</Eyebrow>
            <h2 className="wipe font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Built from <span className="text-[var(--crimson)]">failure.</span>
            </h2>
            <p className="reveal mt-5 max-w-2xl text-[1.05rem] text-[#d6cfd5]">
              I&apos;m <strong className="text-white">Earth</strong> — a self-taught full-stack developer who believes the best way to learn is by <span className="font-semibold text-[var(--crimson-soft)]">building</span>. Here&apos;s how it went.
            </p>

            <div className="relative mt-16 pl-[52px] sm:pl-[92px]">
              {/* the line */}
              <div className="absolute left-[14px] top-2 bottom-2 w-px bg-white/10 sm:left-[46px]">
                <div className="tl-fill absolute inset-x-0 top-0 h-full origin-top scale-y-0 bg-gradient-to-b from-[var(--crimson)] via-[var(--crimson-soft)] to-[var(--purple)]" />
              </div>
              <div className="space-y-14">
                {JOURNEY.map((j) => (
                  <div key={j.k} className="reveal relative">
                    <span className="absolute -left-[52px] top-1 flex h-7 w-7 items-center justify-center rounded-full border border-[var(--crimson)]/50 bg-background text-[0.65rem] font-bold text-[var(--crimson-soft)] sm:-left-[92px] sm:h-9 sm:w-9 sm:text-xs">{j.k}</span>
                    <h3 className="font-display text-2xl font-bold sm:text-3xl">{j.t}</h3>
                    <p className="mt-2 max-w-2xl text-[var(--muted-foreground)]">{j.d}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* stats strip */}
            <div className="stagger mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="bg-background/40 p-7 text-center">
                  <div className="font-display text-4xl font-bold text-[var(--crimson-soft)] sm:text-5xl">
                    <span data-count={s.num}>0</span>{s.suffix && <span className="text-[var(--purple-soft)]">{s.suffix}</span>}
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-wider text-[var(--muted-foreground)]">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* WORK — pinned horizontal showcase */}
          <section id="work" className="relative h-screen overflow-hidden">
            <div className="work-track flex h-full w-max items-center">
              {/* intro panel */}
              <div className="flex h-full w-screen shrink-0 flex-col justify-center px-[6vw]">
                <Eyebrow>02 — Flagship Products</Eyebrow>
                <h2 className="font-display text-5xl font-bold leading-[1.02] tracking-tighter sm:text-7xl md:text-8xl">
                  Platforms<br />I <span className="text-[var(--crimson)]">own.</span>
                </h2>
                <p className="mt-6 max-w-md text-[var(--muted-foreground)]">Full streaming platforms — built, automated and running live. Keep scrolling — they slide. →</p>
              </div>
              {/* product panels */}
              {PRODUCTS.map((p) => (
                <article key={p.name} className="flex h-full w-screen shrink-0 items-center px-[6vw]">
                  <div className="grid w-full items-center gap-10 lg:grid-cols-2">
                    <div>
                      <div className="font-display text-[7rem] font-bold leading-none text-white/5 sm:text-[10rem]">{p.idx}</div>
                      <span className="text-xs uppercase tracking-[0.25em] text-[var(--purple-soft)]">{p.tag}</span>
                      <h3 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-6xl">
                        <a href={p.url} target="_blank" rel="noopener" className="transition-colors hover:text-[var(--crimson-soft)]">{p.name} ↗</a>
                      </h3>
                      <p className="mt-5 max-w-md text-[var(--muted-foreground)]">{p.desc}</p>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {p.tech.map((t) => (<span key={t} className="rounded-full border border-white/[0.1] px-3 py-1.5 text-xs text-[var(--muted-foreground)]">{t}</span>))}
                      </div>
                      <a href={p.url} target="_blank" rel="noopener" className="mt-7 inline-block">
                        <LiquidButton className="rounded-full border border-white/15 text-white" size="lg">Visit site ↗</LiquidButton>
                      </a>
                    </div>
                    <div className="hidden overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0a0e] shadow-[0_40px_120px_rgba(0,0,0,0.6)] lg:block">
                      <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
                        <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" /><i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" /><i className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                        <span className="ml-3 rounded bg-white/5 px-3 py-1 text-xs text-[var(--muted-foreground)]">{p.name}</span>
                      </div>
                      <div className="grid grid-cols-5 gap-2.5 p-5">
                        {Array.from({ length: 15 }).map((_, k) => (
                          <div key={k} className="aspect-[2/3] animate-pulse rounded-md" style={{
                            background: k % 3 === 0 ? "linear-gradient(135deg, var(--crimson), var(--crimson-deep))" : k % 3 === 1 ? "linear-gradient(135deg, var(--purple), var(--crimson))" : "linear-gradient(135deg, var(--crimson-soft), var(--purple))",
                            animationDelay: `${(k % 5) * 0.2}s`, opacity: 0.85 }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* OPEN SOURCE — terminal index */}
          <section id="infra" className="px-[6vw] py-[16vh]">
            <Eyebrow>03 — Open Source &amp; Infrastructure</Eyebrow>
            <h2 className="wipe font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              The engines <span className="text-[var(--crimson)]">underneath.</span>
            </h2>
            <p className="reveal mt-4 max-w-2xl text-[var(--muted-foreground)]">The proxies, APIs and scrapers I wrote to power my platforms — all open on GitHub.</p>

            <div className="reveal mono-font mt-12 overflow-hidden rounded-xl border border-white/[0.1] bg-[#070609]/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 border-b border-white/[0.08] px-4 py-3">
                <i className="h-3 w-3 rounded-full bg-[#ff5f57]" /><i className="h-3 w-3 rounded-full bg-[#febc2e]" /><i className="h-3 w-3 rounded-full bg-[#28c840]" />
                <span className="ml-3 text-xs text-[var(--muted-foreground)]">~/earth/infrastructure — zsh</span>
              </div>
              <div className="stagger p-2 sm:p-3">
                {REPOS.map((r) => (
                  <a key={r.n} href={r.url} target="_blank" rel="noopener"
                    className="term-row group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-lg px-3 py-4 sm:px-5">
                    <span className="text-sm text-[var(--crimson-soft)]">{r.idx}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-base text-white sm:text-lg">
                        <span className="text-[var(--purple-soft)]">git clone</span> {r.n}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-[var(--muted-foreground)]">{r.desc}</span>
                    </span>
                    <span className="whitespace-nowrap text-xs uppercase tracking-widest text-[var(--muted-foreground)] group-hover:text-[var(--crimson-soft)]">[{r.kind}] →</span>
                  </a>
                ))}
                <a href="https://github.com/MonkyeDLuffy" target="_blank" rel="noopener" className="mt-1 flex items-center gap-2 px-3 py-3 text-sm text-[var(--muted-foreground)] hover:text-white sm:px-5">
                  <span className="text-[var(--crimson-soft)]">$</span> ls github.com/@MonkyeDLuffy<span className="term-caret ml-1 inline-block h-4 w-2 bg-[var(--crimson)]" />
                </a>
              </div>
            </div>
          </section>

          {/* CLIENTS — giant hover-reveal list */}
          <section id="clients" className="px-[6vw] py-[16vh]">
            <Eyebrow>04 — Client Work</Eyebrow>
            <h2 className="wipe font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Built for <span className="text-[var(--crimson)]">clients.</span>
            </h2>
            <div className="stagger mt-12 border-t border-white/10">
              {CLIENTS.map((c, i) => (
                <a key={c.n + i} href={c.url} target="_blank" rel="noopener"
                  className="big-row group flex flex-col gap-2 border-b border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between sm:py-7">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-[var(--muted-foreground)]">0{i + 1}</span>
                    <span className="name font-display text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl">{c.n}</span>
                  </div>
                  <div className="detail flex items-center gap-5 pl-8 sm:pl-0">
                    <span className="hidden max-w-xs text-right text-sm text-[var(--muted-foreground)] lg:block">{c.desc}</span>
                    <span className="whitespace-nowrap rounded-full border border-[var(--border)] px-3 py-1 text-[0.7rem] uppercase tracking-[0.15em] text-[var(--purple-soft)]">{c.badge}</span>
                    <span className="whitespace-nowrap text-sm text-[var(--crimson-soft)]">View ↗</span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* SKILLS — 3D tilted marquee */}
          <section id="skills" className="overflow-hidden py-[16vh]">
            <div className="px-[6vw]">
              <Eyebrow>05 — Skills &amp; Tools</Eyebrow>
              <h2 className="wipe font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                My <span className="text-[var(--crimson)]">arsenal.</span>
              </h2>
              <p className="reveal mt-4 max-w-xl text-[var(--muted-foreground)]">Everything I build with — tilted into motion. Hover to pause a lane.</p>
            </div>
            <div className="skills-3d reveal mt-14">
              <div className="skills-3d-inner skills-hover-pause flex flex-col gap-5">
                {buckets.map((bucket, ri) => (
                  <div key={ri} className="flex overflow-hidden">
                    <div className={`track-scroll flex w-max min-w-full ${ri % 2 ? "rtl" : ""}`} style={{ ["--dur" as string]: dur[ri] }}>
                      {[...bucket, ...bucket].map((s, i) => (
                        <span key={i} className="chip mr-4 inline-flex flex-shrink-0 items-center gap-3 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-5 py-3.5 font-display font-semibold text-[#d8d2da] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-[var(--crimson)] hover:bg-gradient-to-br hover:from-[rgba(225,15,41,0.18)] hover:to-[rgba(138,23,214,0.18)] hover:text-white hover:shadow-[0_12px_34px_rgba(225,15,41,0.28)]">
                          {s.i ? (<i className={`${s.i} text-[1.45rem]`} />) : (
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-[var(--crimson-deep)] to-[var(--purple)] text-xs font-bold text-white">{mono(s.n)}</span>
                          )}
                          {s.n}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CONTACT — kinetic */}
          <section id="contact" className="relative overflow-hidden py-[18vh]">
            <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-[0.06]">
              <div className="band-scroll flex w-max whitespace-nowrap">
                {[0, 1].map((r) => (<span key={r} className="mx-6 font-display text-[14vw] font-bold leading-none">LET&apos;S BUILD SOMETHING — LET&apos;S BUILD SOMETHING —&nbsp;</span>))}
              </div>
            </div>
            <div className="relative px-[6vw] text-center">
              <Eyebrow center>06 — Contact</Eyebrow>
              <h2 className="wipe inline-block font-display text-5xl font-bold tracking-tighter sm:text-7xl md:text-8xl">
                Let&apos;s <span className="text-gradient text-shimmer">build.</span>
              </h2>
              <p className="reveal mx-auto mt-6 max-w-lg text-[var(--muted-foreground)]">Got a project, an idea, or just want to talk tech? My inbox is open.</p>
              <a href="mailto:hello@offanime.cc" className="reveal mt-8 inline-block font-display text-2xl font-semibold text-white underline decoration-[var(--crimson)] decoration-2 underline-offset-8 transition-colors hover:text-[var(--crimson-soft)] sm:text-4xl">hello@offanime.cc</a>
              <div className="reveal mt-10 flex flex-wrap justify-center gap-4">
                <a href="https://offanime.cc" target="_blank" rel="noopener"><LiquidButton className="rounded-full border border-white/15 text-white" size="xl">offanime.cc ↗</LiquidButton></a>
                <a href="https://github.com/MonkyeDLuffy" target="_blank" rel="noopener" className="hoverable rounded-full border border-white/15 px-7 py-3 text-sm text-white/80 transition-colors hover:border-[var(--purple)] hover:text-white">GitHub ↗</a>
              </div>
            </div>
          </section>

          <footer className="flex flex-wrap justify-between gap-3 border-t border-[var(--border)] px-[6vw] py-10 text-sm text-[var(--muted-foreground)]">
            <span>© 2026 Earth — designed &amp; built from scratch.</span>
            <a href="#top" className="transition-colors hover:text-[var(--crimson-soft)]">Back to top ↑</a>
          </footer>
        </div>
      </main>
    </>
  );
}

function Eyebrow({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div className={`reveal mb-4 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.25em] text-[var(--crimson-soft)] ${center ? "justify-center" : ""}`}>
      <span className="inline-block h-px w-6 bg-[var(--crimson)]" />
      {children}
    </div>
  );
}
