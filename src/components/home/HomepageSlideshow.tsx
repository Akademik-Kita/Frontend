import { useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './HomepageSlideshow.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface HomepageSlide {
  id: string;
  label: string;
  titleId: string;
  className?: string;
  content: ReactNode;
}

// Kedua path memakai perintah SVG yang sama agar GSAP bisa mengubah kurva lembar.
const SHEET_TOP = 'M 0 0 C 25 0 75 0 100 0 L 100 0 C 75 0 25 0 0 0 Z';
const SHEET_ENTER = 'M 0 0 C 25 0 75 0 100 0 L 100 50 C 75 90 25 10 0 50 Z';
const SHEET_FULL = 'M 0 0 C 25 0 75 0 100 0 L 100 100 C 75 100 25 100 0 100 Z';
const SHEET_LEAVE = 'M 0 50 C 25 10 75 90 100 50 L 100 100 C 75 100 25 100 0 100 Z';
const SHEET_BOTTOM = 'M 0 100 C 25 100 75 100 100 100 L 100 100 C 75 100 25 100 0 100 Z';
const DASH_TOP = 'M 0 0 C 25 0 75 0 100 0';
const DASH_MIDDLE = 'M 0 50 C 25 10 75 90 100 50';
const DASH_BOTTOM = 'M 0 100 C 25 100 75 100 100 100';

export function HomepageSlideshow({ slides }: { slides: HomepageSlide[] }) {
  const root = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const playTransition = useRef<(direction: number) => void>(() => {});
  const current = useRef(0);
  const [active, setActive] = useState(0);

  const goToSlide = (index: number) => {
    const panels = root.current?.querySelectorAll<HTMLElement>('.ak-slide');
    panels?.[index]?.scrollIntoView({
      block: 'start',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  };

  useGSAP(
    () => {
      const html = document.documentElement;
      const previous = {
        snap: html.style.scrollSnapType,
        top: html.style.scrollPaddingTop,
        bottom: html.style.scrollPaddingBottom,
      };
      const page = root.current?.closest<HTMLElement>('.ak-paged');
      const header = page?.querySelector<HTMLElement>('.ak-nav');
      let resizing = false;
      let resizeTarget = 0;
      let resizeTimer = 0;
      let resizeFrame = 0;
      let headerHeight = -1;
      const updateHeader = () => {
        const height = header?.offsetHeight ?? 0;
        if (height === headerHeight) return;
        headerHeight = height;
        page?.style.setProperty('--ak-header-height', `${height}px`);
        html.style.scrollPaddingTop = `${height}px`;
        html.style.scrollPaddingBottom =
          'calc(max(68px, 4.25rem) + env(safe-area-inset-bottom, 0px))';
        ScrollTrigger.refresh();
      };
      updateHeader();
      const resize = new ResizeObserver(updateHeader);
      if (header) resize.observe(header);

      const panels = gsap.utils.toArray<HTMLElement>('.ak-slide');
      const onResize = () => {
        // Pertahankan slide aktif saat resize mengubah layout dan posisi snap.
        if (!resizing) resizeTarget = current.current;
        resizing = true;
        html.style.scrollSnapType = 'none';
        window.clearTimeout(resizeTimer);
        window.cancelAnimationFrame(resizeFrame);
        resizeTimer = window.setTimeout(() => {
          updateHeader();
          ScrollTrigger.refresh();
          panels[resizeTarget]?.scrollIntoView({
            block: 'start',
            behavior: 'instant',
          });
          resizeFrame = window.requestAnimationFrame(() => {
            html.style.scrollSnapType = window.matchMedia('(prefers-reduced-motion: reduce)')
              .matches
              ? 'y proximity'
              : 'y mandatory';
            ScrollTrigger.update();
            resizing = false;
          });
        }, 150);
      };
      window.addEventListener('resize', onResize);
      let lastWheel = 0;
      let wheelTotal = 0;
      let gestureUsed = false;
      let lockedUntil = 0;
      const onWheel = (event: WheelEvent) => {
        if (resizing) return;
        if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
        if (
          (event.target as Element | null)?.closest(
            'input, textarea, select, [contenteditable="true"], .ak-nav-mobile',
          )
        )
          return;
        const now = performance.now();
        const idle = now - lastWheel > 180;
        lastWheel = now;
        if (now < lockedUntil || (gestureUsed && !idle)) {
          event.preventDefault();
          return;
        }
        if (idle) {
          gestureUsed = false;
          wheelTotal = 0;
        }

        const panel = panels[current.current];
        if (!panel) return;
        const bounds = panel.getBoundingClientRect();
        const bottom =
          innerHeight -
          (page?.querySelector('.ak-slide-controls')?.getBoundingClientRect().height ?? 68);
        const direction = Math.sign(event.deltaY);
        const delta =
          event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
        const canReadMore =
          direction > 0 ? bounds.bottom > bottom + 2 : bounds.top < headerHeight - 2;
        if (bounds.height > bottom - headerHeight + 2 && canReadMore) {
          event.preventDefault();
          const edge =
            direction > 0 ? scrollY + bounds.bottom - bottom : scrollY + bounds.top - headerHeight;
          window.scrollTo({
            top: direction > 0 ? Math.min(scrollY + delta, edge) : Math.max(scrollY + delta, edge),
            behavior: 'instant',
          });
          return;
        }

        event.preventDefault();
        wheelTotal += delta;
        if (Math.abs(wheelTotal) < 40) return;
        const next = Math.max(
          0,
          Math.min(panels.length - 1, current.current + Math.sign(wheelTotal)),
        );
        wheelTotal = 0;
        if (next === current.current) return;
        gestureUsed = true;
        lockedUntil = now + 700;
        goToSlide(next);
      };
      const onPageKey = (event: KeyboardEvent) => {
        if (event.key !== 'PageDown' && event.key !== 'PageUp') return;
        if (
          (event.target as Element | null)?.closest(
            'input, textarea, select, [contenteditable="true"]',
          )
        )
          return;
        const panel = panels[current.current];
        if (!panel) return;
        const bounds = panel.getBoundingClientRect();
        const bottom =
          innerHeight -
          (page?.querySelector('.ak-slide-controls')?.getBoundingClientRect().height ?? 68);
        const direction = event.key === 'PageDown' ? 1 : -1;
        if (
          bounds.height > bottom - headerHeight + 2 &&
          (direction > 0 ? bounds.bottom > bottom + 2 : bounds.top < headerHeight - 2)
        )
          return;
        event.preventDefault();
        goToSlide(Math.max(0, Math.min(panels.length - 1, current.current + direction)));
      };
      window.addEventListener('wheel', onWheel, { passive: false });
      window.addEventListener('keydown', onPageKey);
      panels.forEach((panel, index) => {
        const select = () => {
          if (resizing) return;
          if (current.current === index) return;
          const direction = index > current.current ? 1 : -1;
          current.current = index;
          setActive(index);
          playTransition.current(direction);
        };
        ScrollTrigger.create({
          trigger: panel,
          start: 'top 55%',
          end: 'bottom 55%',
          onEnter: select,
          onEnterBack: select,
        });
      });

      const media = gsap.matchMedia();
      media.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          reduced: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          html.style.scrollSnapType = context.conditions?.motion ? 'y mandatory' : 'y proximity';
          if (!context.conditions?.motion) return;

          gsap.from('[data-intro]', {
            y: 28,
            opacity: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out',
          });
          const reveals = new Map<
            HTMLElement,
            { animation: gsap.core.Tween; trigger: ScrollTrigger }
          >();
          panels.forEach((panel) => {
            panel.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element, index) => {
              const animation = gsap.fromTo(
                element,
                {
                  opacity: 0,
                  y: element.dataset.reveal === 'panel' ? 12 : 24,
                  scale: element.dataset.reveal === 'panel' ? 0.97 : 1,
                },
                { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'power3.out', paused: true },
              );
              const trigger = ScrollTrigger.create({
                trigger: element,
                start: 'top 88%',
                once: true,
                onEnter: () => {
                  const covered =
                    Number(panel.dataset.slideIndex) !== current.current ||
                    overlay.current?.style.visibility === 'visible';
                  animation.delay((covered ? 0.6 : 0) + Math.min(index * 0.04, 0.16)).restart(true);
                },
              });
              reveals.set(element, { animation, trigger });
            });
          });
          const revealFocused = (event: FocusEvent) => {
            const focused = event.target as Element | null;
            if (!focused?.matches(':focus-visible')) return;
            const element = focused.closest<HTMLElement>('[data-reveal]');
            const reveal = element && reveals.get(element);
            if (!reveal) return;
            reveal.animation.progress(1).pause();
            reveal.trigger.kill();
          };
          const container = root.current;
          container?.addEventListener('focusin', revealFocused);
          const hide = () => {
            if (overlay.current) overlay.current.style.visibility = 'hidden';
          };
          const wipe = gsap.timeline({
            paused: true,
            onComplete: hide,
            onReverseComplete: hide,
          });
          wipe
            .fromTo(
              '.ak-morph-sheet',
              { attr: { d: SHEET_TOP } },
              { attr: { d: SHEET_ENTER }, duration: 0.16, ease: 'power2.in' },
              0,
            )
            .to(
              '.ak-morph-sheet',
              { attr: { d: SHEET_FULL }, duration: 0.12, ease: 'power1.out' },
              0.16,
            )
            .to(
              '.ak-morph-sheet',
              { attr: { d: SHEET_LEAVE }, duration: 0.16, ease: 'power1.in' },
              0.28,
            )
            .to(
              '.ak-morph-sheet',
              { attr: { d: SHEET_BOTTOM }, duration: 0.16, ease: 'power2.out' },
              0.44,
            )
            .fromTo(
              '.ak-morph-dash-enter',
              { attr: { d: DASH_TOP }, strokeDashoffset: 0 },
              {
                attr: { d: DASH_MIDDLE },
                strokeDashoffset: -8,
                duration: 0.16,
                ease: 'power2.in',
              },
              0,
            )
            .to(
              '.ak-morph-dash-enter',
              {
                attr: { d: DASH_BOTTOM },
                strokeDashoffset: -16,
                duration: 0.12,
              },
              0.16,
            )
            .fromTo(
              '.ak-morph-dash-leave',
              { attr: { d: DASH_TOP }, strokeDashoffset: 0 },
              {
                attr: { d: DASH_MIDDLE },
                strokeDashoffset: -8,
                duration: 0.16,
              },
              0.28,
            )
            .to(
              '.ak-morph-dash-leave',
              {
                attr: { d: DASH_BOTTOM },
                strokeDashoffset: -16,
                duration: 0.16,
                ease: 'power2.out',
              },
              0.44,
            );

          playTransition.current = (direction) => {
            if (wipe.isActive()) return;
            if (direction > 0) wipe.restart();
            else wipe.progress(1, true).reverse();
            if (overlay.current) overlay.current.style.visibility = 'visible';
          };
          return () => {
            container?.removeEventListener('focusin', revealFocused);
            playTransition.current = () => {};
            hide();
          };
        },
        root,
      );

      let mounted = true;
      void document.fonts.ready.then(() => {
        if (mounted) ScrollTrigger.refresh();
      });
      return () => {
        mounted = false;
        resize.disconnect();
        window.clearTimeout(resizeTimer);
        window.cancelAnimationFrame(resizeFrame);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('wheel', onWheel);
        window.removeEventListener('keydown', onPageKey);
        media.revert();
        playTransition.current = () => {};
        html.style.scrollSnapType = previous.snap;
        html.style.scrollPaddingTop = previous.top;
        html.style.scrollPaddingBottom = previous.bottom;
        page?.style.removeProperty('--ak-header-height');
      };
    },
    { scope: root },
  );

  return (
    <div className="ak-slideshow" ref={root}>
      <main id="main-content" tabIndex={-1}>
        {slides.map((slide, index) => (
          <section
            key={slide.id}
            id={slide.id}
            className={`ak-slide ${slide.className ?? ''}`}
            aria-labelledby={slide.titleId}
            aria-roledescription="slide"
            data-slide-index={index}
          >
            <div className="ak-slide-content ak-wrap">{slide.content}</div>
          </section>
        ))}
      </main>
      <div className="ak-slide-morph" ref={overlay} aria-hidden="true">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <path className="ak-morph-sheet" d={SHEET_TOP} />
          <path className="ak-morph-dash-enter" d={DASH_TOP} />
          <path className="ak-morph-dash-leave" d={DASH_TOP} />
        </svg>
      </div>
      <div className="ak-slide-controls">
        <div className="ak-slide-controls-inner ak-wrap">
          <button
            type="button"
            className="ak-slide-arrow"
            aria-label="Slide sebelumnya"
            onClick={() => goToSlide(active - 1)}
            disabled={active === 0}
          >
            <span aria-hidden="true">↑</span>
          </button>
          <nav className="ak-slide-pagination" aria-label="Pilih slide homepage">
            {slides.map((slide, index) => (
              <a
                key={slide.id}
                href={`#${slide.id}`}
                aria-label={`Slide ${index + 1}: ${slide.label}`}
                aria-current={index === active ? 'step' : undefined}
              >
                <span className="ak-pagination-dash" aria-hidden="true" />
              </a>
            ))}
          </nav>
          <p className="ak-slide-counter" role="status" aria-live="polite" aria-atomic="true">
            <span>
              {String(active + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
            <span>{slides[active].label}</span>
          </p>
          <button
            type="button"
            className="ak-slide-arrow"
            aria-label="Slide berikutnya"
            onClick={() => goToSlide(active + 1)}
            disabled={active === slides.length - 1}
          >
            <span aria-hidden="true">↓</span>
          </button>
        </div>
      </div>
    </div>
  );
}
