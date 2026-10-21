import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface JourneyChapter {
  id: string;
  label: string;
  title: string;
  description: string;
  detail: string;
  action: string;
  to: string;
  keywords: string[];
  status?: string;
}

export function ScrollJourney({
  chapters,
  label,
}: {
  chapters: JourneyChapter[];
  label: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      const journey = root.current;
      const stage = journey?.querySelector<HTMLElement>('.ak-journey-stage');
      if (!journey || !stage) return;
      let readingLine = innerHeight * 0.4;
      const measureStage = () => {
        const top = Math.max(16, Math.min(28, innerHeight * 0.03));
        const compact = innerWidth < 1000;
        const budget = compact
          ? Math.min(240, innerHeight * 0.4)
          : innerHeight - top - 24;
        const follows = stage.offsetHeight <= budget;
        journey.dataset.follow = String(follows);
        journey.style.setProperty('--ak-stage-top', `${top}px`);
        journey.style.setProperty(
          '--ak-stage-height',
          `${stage.offsetHeight}px`,
        );
        const offset =
          follows && compact ? top + stage.offsetHeight + 20 : top + 20;
        journey.style.setProperty('--ak-chapter-offset', `${offset}px`);
        readingLine = Math.min(
          innerHeight * 0.7,
          offset + Math.min(100, (innerHeight - offset) * 0.25),
        );
        ScrollTrigger.refresh();
      };
      measureStage();
      const resize = new ResizeObserver(measureStage);
      resize.observe(stage);
      window.addEventListener('resize', measureStage);
      gsap.utils
        .toArray<HTMLElement>('.ak-chapter')
        .forEach((article, index) => {
          ScrollTrigger.create({
            trigger: article,
            start: () => `top ${readingLine}px`,
            end: () => `bottom ${readingLine}px`,
            onEnter: () => setActive(index),
            onEnterBack: () => setActive(index),
          });
        });
      media.add(
        '(prefers-reduced-motion: no-preference)',
        () => {
          gsap.utils.toArray<HTMLElement>('.ak-chapter').forEach((article) => {
            gsap.from(article.querySelector('.ak-chapter-body'), {
              y: 24,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: { trigger: article, start: 'top 88%', once: true },
            });
          });
          gsap.fromTo(
            '.ak-journey-fill',
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: root.current,
                start: 'top 55%',
                end: 'bottom 55%',
                scrub: true,
              },
            },
          );
        },
        root,
      );
      // Font yang baru dimuat bisa mengubah tinggi bab setelah pengukuran ScrollTrigger.
      let mounted = true;
      void document.fonts.ready.then(() => {
        if (mounted) measureStage();
      });
      return () => {
        mounted = false;
        resize.disconnect();
        window.removeEventListener('resize', measureStage);
        media.revert();
        delete journey.dataset.follow;
        journey.style.removeProperty('--ak-stage-top');
        journey.style.removeProperty('--ak-stage-height');
        journey.style.removeProperty('--ak-chapter-offset');
      };
    },
    { scope: root },
  );

  return (
    <div className="ak-journey" ref={root} aria-label={label}>
      <aside className="ak-journey-stage">
        <div className="ak-stage-top">
          <span>Lembar pilihanmu</span>
          <span aria-hidden="true">
            {String(active + 1).padStart(2, '0')} /{' '}
            {String(chapters.length).padStart(2, '0')}
          </span>
        </div>
        <div className="ak-stage-number" aria-hidden="true">
          {String(active + 1).padStart(2, '0')}
          <span>.</span>
        </div>
        <p className="ak-stage-title">{chapters[active].label}</p>
        <div className="ak-stage-keywords">
          {chapters[active].keywords.map((word) => (
            <span key={word}>{word}</span>
          ))}
        </div>
        <nav
          className="ak-chapter-nav"
          aria-label={`${label}: lompat ke bagian`}
        >
          {chapters.map((chapter, index) => (
            <a
              key={chapter.id}
              href={`#${chapter.id}`}
              aria-current={index === active ? 'step' : undefined}
              aria-label={`${index + 1}. ${chapter.label}`}
            >
              {String(index + 1).padStart(2, '0')}
            </a>
          ))}
        </nav>
        <div className="ak-journey-track" aria-hidden="true">
          <div className="ak-journey-fill" />
        </div>
      </aside>
      <div className="ak-chapters">
        {chapters.map((chapter, index) => (
          <article
            className="ak-chapter"
            id={chapter.id}
            key={chapter.id}
            aria-labelledby={`${chapter.id}-title`}
          >
            <div className="ak-chapter-body">
              <div className="ak-chapter-heading">
                <span>
                  {String(index + 1).padStart(2, '0')} / {chapter.label}
                </span>
                {chapter.status && (
                  <span className="ak-chapter-status">{chapter.status}</span>
                )}
              </div>
              <h3 id={`${chapter.id}-title`}>{chapter.title}</h3>
              <p>{chapter.description}</p>
              <p className="ak-chapter-detail">{chapter.detail}</p>
              <Link className="ak-text-action" to={chapter.to}>
                {chapter.action}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
