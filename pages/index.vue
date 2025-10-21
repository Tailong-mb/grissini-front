<template>
	<div class="home-page" ref="homePageRef">
		<div class="container-wrapper" ref="containerWrapperRef">
			<div class="images-container">
				<div v-for="item in homeData?.items" :key="item._key" class="image-wrapper" ref="imageWrapperRefs">
					<div class="image-placeholder">
						<img v-if="item.thumbnail?.url" :src="item.thumbnail.url" :alt="getLocalizedTitle(item.title)" ref="imageRefs" />
					</div>
				</div>
			</div>
			<div class="images-container second">
				<div v-for="item in homeData?.items" :key="`second-${item._key}`" class="image-wrapper" ref="imageWrapperRefs">
					<div class="image-placeholder">
						<img v-if="item.thumbnail?.url" :src="item.thumbnail.url" :alt="getLocalizedTitle(item.title)" ref="imageRefs" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useSanityHome } from '@/composables/useSanityHome';
import { useI18n } from 'vue-i18n';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const { locale } = useI18n();

const homeData = ref(null);
const loadingHome = ref(false);
const errorHome = ref(null);

// Refs for scroll system
const homePageRef = ref(null);
const containerWrapperRef = ref(null);
const lenisInstance = ref(null);
const imageRefs = ref([]);
const imageWrapperRefs = ref([]);
const isDesktop = ref(false);
const tlArray = ref([]);

const getLocalizedTitle = (titleObject) => {
	if (!titleObject) return '';

	// If it's already a string, return it
	if (typeof titleObject === 'string') return titleObject;

	// If it's an object with locale keys
	if (typeof titleObject === 'object') {
		return titleObject[locale.value] || titleObject.en || titleObject.fr || '';
	}

	return '';
};

const loadHomeData = async () => {
	loadingHome.value = true;
	errorHome.value = null;
	try {
		homeData.value = await useSanityHome();
		console.log('=== HOME PAGE DATA ===');
		console.log('Locale:', locale.value);
		console.log('Home Data:', homeData.value);
		console.log('Title:', homeData.value?.title);
		console.log('Items:', homeData.value?.items);
		console.log('Items length:', homeData.value?.items?.length);
		if (homeData.value?.items?.[0]) {
			console.log('First item:', homeData.value.items[0]);
			console.log('First item title:', homeData.value.items[0].title);
			console.log('First item description:', homeData.value.items[0].description);
			console.log('First item linkName:', homeData.value.items[0].linkName);
			console.log('First item url:', homeData.value.items[0].url);
		}
		console.log('=====================');
	} catch (err) {
		errorHome.value = err.message;
		console.error('Home page error:', err);
	} finally {
		loadingHome.value = false;
	}
};

const openAnimation = () => {
	const tl = gsap.timeline();

	tl.fromTo(
		imageWrapperRefs.value,
		{
			clipPath: 'inset(0 0 100% 0)',
		},
		{
			clipPath: 'inset(0 0 0% 0)',
			duration: 1.2,
			ease: 'power2.out',
		},
		0
	);
};

const initScrollTriggers = () => {
	imageWrapperRefs.value.forEach((imageRefData, index) => {
		if (imageRefData instanceof HTMLElement) {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: imageRefData,
					scroller: homePageRef.value,
					horizontal: isDesktop.value,
					start: 'top bottom',
					end: 'bottom top',
					scrub: true,
				},
			});

			tlArray.value.push(tl);
		}
	});

	ScrollTrigger.refresh();
};

onMounted(async () => {
	try {
		await loadHomeData();
		await nextTick();

		if (homePageRef.value && containerWrapperRef.value) {
			isDesktop.value = window.innerWidth > 768;

			lenisInstance.value = new Lenis({
				wrapper: homePageRef.value,
				content: containerWrapperRef.value,
				autoRaf: true,
				orientation: isDesktop.value ? 'horizontal' : 'vertical',
				infinite: true,
				smooth: true,
				smoothTouch: false,
			});

			lenisInstance.value.on('scroll', ScrollTrigger.update);

			gsap.ticker.add((time) => {
				lenisInstance.value.raf(time * 1000);
			});

			gsap.ticker.lagSmoothing(0);

			ScrollTrigger.config({
				ignoreMobileResize: true,
			});

			lenisInstance.value.start();

			await nextTick();
			initScrollTriggers();
			openAnimation();
		}
	} catch (err) {
		console.error('Error initializing Lenis:', err);
		errorHome.value = err;
	}
});

onUnmounted(() => {
	ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
	tlArray.value.forEach((tl) => tl.kill());

	if (lenisInstance.value) {
		lenisInstance.value.destroy();
	}
});
</script>

<style scoped lang="scss">
.home-page {
	width: 100%;
	height: 100vh;
	overflow: hidden;
	min-height: 100vh;

	.container-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		gap: 9rem;

		@include tablet {
			flex-direction: row;
			gap: 9rem;
			height: 100vh;
			min-height: auto;
			width: max-content;
		}

		.images-container {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 9rem;

			&.second {
				margin-top: 9rem;
				height: 100dvh;
				width: 100vw;
				overflow: hidden;

				@include tablet {
					margin-top: 0;
				}
			}

			@include tablet {
				flex-direction: row;
				min-height: auto;
				width: max-content;
				gap: 9rem;
			}

			.image-wrapper {
				width: calc(100vw - 18rem);
				flex-shrink: 0;

				@include tablet {
					width: calc(25vw - 9rem);
				}

				.image-placeholder {
					display: block;
					width: 100%;
					height: calc(25dvh - 32rem);
					overflow: hidden;
					flex-shrink: 0;

					@include tablet {
						height: auto;
						aspect-ratio: 429 / 249;
					}

					img {
						width: 100%;
						height: 100%;
						transition: transform 0.6s $out-cubic;
						object-fit: cover;
					}
				}
			}
		}
	}
}
</style>
