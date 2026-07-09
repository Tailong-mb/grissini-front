import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { animationRegistry, parseOpts } from "@/utils/animations";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useAnimations() {
  const animationContainer = ref(null);
  const animations = [];

  const initAnimations = () => {
    if (!animationContainer.value) return;

    const elements = animationContainer.value.querySelectorAll(
      "[data-animation]"
    );

    elements.forEach((el) => {
      const type = el.dataset.animation;
      const factory = animationRegistry.get(type);
      if (!factory) return;

      const opts = parseOpts(el);
      const anim = factory(el, opts);
      if (anim) animations.push(anim);
    });
  };

  onMounted(async () => {
    await nextTick();
    initAnimations();
  });

  onUnmounted(() => {
    animations.forEach((anim) => {
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
      anim.kill();
    });
    animations.length = 0;
    ScrollTrigger.refresh();
  });

  return { animationContainer };
}
