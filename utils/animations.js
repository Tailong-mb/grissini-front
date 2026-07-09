import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const animationRegistry = new Map();

const defaultOpts = {
  duration: 0.8,
  ease: "linear",
  stagger: 0.15,
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

// Fade + translate up
animationRegistry.set("fadeIn", (el, opts) => {
  gsap.set(el, { autoAlpha: 0, yPercent: 30 });
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: el,
      start: "top 90%",
      once: true,
    },
  });
  tl.to(el, {
    yPercent: 0,
    duration: 0.8,
    delay: opts.delay,
    ease: "power2.out",
  });
  tl.to(
    el,
    {
      autoAlpha: 1,
      duration: 0.4,
      ease: "linear",
    },
    0
  );
  return tl;
});

// Stagger children with translate up
animationRegistry.set("fadeIn-stagger", (el, opts) => {
  const children = el.children;
  if (!children.length) return;

  gsap.set(children, { autoAlpha: 0, yPercent: 80 });
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: el,
      start: "top bottom",
      once: true,
    },
  });
  tl.to(children, {
    yPercent: 0,
    duration: 0.8,
    ease: "power2.out",
    stagger: opts.stagger,
  });
  tl.to(
    children,
    {
      autoAlpha: 1,
      duration: 0.4,
      ease: "linear",
      stagger: opts.stagger,
    },
    0.6
  );
  return tl;
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
