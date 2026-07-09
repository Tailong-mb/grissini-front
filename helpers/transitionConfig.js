import gsap from 'gsap';

import { useTransitionComposable } from '../composables/transition-composable';

const { toggleTransitionComplete } = useTransitionComposable();

const pageTransition = {
	name: 'page-transiton',
	mode: 'out-in',
	onEnter: (el, done) => {
		const lenis = useNuxtApp().$lenis;
		if (lenis) lenis.scrollTo(0, { immediate: true });
		else window.scrollTo(0, 0);

		gsap.timeline({
			paused: true,
			onComplete() {
				toggleTransitionComplete(true);
				done();
			},
		})
			.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 })
			.play();
	},
	onLeave: (el, done) => {
		toggleTransitionComplete(false);
		gsap.timeline({ paused: true, onComplete: done }).to(el, { autoAlpha: 0, duration: 0.3 }).play();
	},
};

export default pageTransition;
