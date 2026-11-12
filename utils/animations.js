import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const animationRegistry = new Map();

const defaultOpts = {
  duration: 1,
  ease: "power2.out",
  stagger: 0.1,
};

function parseOpts(el) {
  return {
    duration:
      parseFloat(el.dataset.animationDuration) || defaultOpts.duration,
    ease: el.dataset.animationEase || defaultOpts.ease,
    stagger:
      parseFloat(el.dataset.animationStagger) || defaultOpts.stagger,
    delay: parseFloat(el.dataset.animationDelay) || 0,
  };
}

// Simple fade (opacity only)
animationRegistry.set("fade", (el, opts) => {
  gsap.set(el, { autoAlpha: 0 });
  return gsap.to(el, {
    autoAlpha: 1,
    duration: opts.duration,
    delay: opts.delay,
    ease: opts.ease,
    scrollTrigger: {
      trigger: el,
      start: "top 90%",
      once: true,
    },
  });
});

// Fade + translate up (mouvement + opacité ensemble, pattern labs `rise`)
animationRegistry.set("fadeIn", (el, opts) => {
  return gsap.fromTo(
    el,
    { autoAlpha: 0, y: 30 },
    {
      autoAlpha: 1,
      y: 0,
      duration: opts.duration,
      delay: opts.delay,
      ease: opts.ease,
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true,
      },
    }
  );
});

// Stagger children with translate up
animationRegistry.set("fadeIn-stagger", (el, opts) => {
  const children = el.children;
  if (!children.length) return;

  return gsap.fromTo(
    children,
    { autoAlpha: 0, y: 30 },
    {
      autoAlpha: 1,
      y: 0,
      duration: opts.duration,
      delay: opts.delay,
      ease: opts.ease,
      stagger: opts.stagger,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true,
      },
    }
  );
});

// Stagger children from random order
animationRegistry.set("fadeIn-random", (el, opts) => {
  const children = el.children;
  if (!children.length) return;

  gsap.set(children, { autoAlpha: 0 });
  return gsap.to(children, {
    autoAlpha: 1,
    duration: opts.duration,
    ease: opts.ease,
    stagger: { each: opts.stagger, from: "random" },
    scrollTrigger: {
      trigger: el,
      start: "top 90%",
      once: true,
    },
  });
});

// Scale reveal (image zoom)
animationRegistry.set("scale", (el, opts) => {
  gsap.set(el, { scale: 1.1, autoAlpha: 0 });
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: el,
      start: "top 90%",
      once: true,
    },
  });
  tl.to(el, {
    scale: 1,
    duration: 1.2,
    delay: opts.delay,
    ease: "immg.zoomOut",
  });
  tl.to(
    el,
    {
      autoAlpha: 1,
      duration: 0.6,
      ease: "linear",
    },
    0
  );
  return tl;
});

export { animationRegistry, parseOpts };
