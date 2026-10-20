import type { RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function useIntroMotion(scope: RefObject<HTMLDivElement | null>) {
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        '(prefers-reduced-motion: no-preference)',
        () => {
          gsap.from('[data-intro]', {
            y: 32,
            opacity: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: 'power3.out',
          });
        },
        scope,
      );
      media.add(
        '(min-width: 1000px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)',
        () => {
          gsap.to('.ak-sheet-wrap', {
            y: -48,
            rotation: -2,
            ease: 'none',
            scrollTrigger: {
              trigger: '.ak-intro',
              start: 'top top',
              end: 'bottom top',
              scrub: 0.7,
            },
          });
        },
        scope,
      );
      return () => media.revert();
    },
    { scope },
  );
}
