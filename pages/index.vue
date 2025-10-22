<template>
	<div class="home-page" ref="homePageRef">
		<div class="container-wrapper" ref="containerWrapperRef">
			<div class="images-container">
				<div v-for="(item, index) in customItems" :key="`${item._key}-${index}`" class="image-wrapper" ref="imageWrapperRefs">
					<div class="video-container" :class="{ active: currentActiveItem === index }">
						<div class="video-thumbnail" :class="{ hidden: currentActiveItem === index }">
							<img v-if="item.thumbnail?.url" :src="item.thumbnail.url" :alt="getLocalizedTitle(item.title)" />
						</div>
						<video v-if="item.video?.url" ref="videoRefs" class="video-element" :class="{ visible: currentActiveItem === index }" :poster="item.thumbnail?.url" loop playsinline webkit-playsinline>
							<source :src="item.video.url" type="video/mp4" />
						</video>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue';
import { useSanityHome } from '@/composables/useSanityHome';
import { useI18n } from 'vue-i18n';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const { locale } = useI18n();

const homeData = ref(null);
const loadingHome = ref(false);
const errorHome = ref(null);

const homePageRef = ref(null);
const containerWrapperRef = ref(null);
const lenisInstance = ref(null);
const imageWrapperRefs = ref([]);
const videoRefs = ref([]);
const isDesktop = ref(false);
const currentActiveItem = ref(2);
const scrollTriggers = ref([]);
const isChangingActiveItem = ref(false);
const isInitialized = ref(false);

const customItems = computed(() => {
	if (!homeData.value?.items) return [];

	const items = homeData.value.items;
	const duplicatedItems = [...items, ...items.slice(0, isDesktop.value ? 4 : 5)];
	return duplicatedItems;
});

const getLocalizedTitle = (titleObject) => {
	if (!titleObject) return '';

	if (typeof titleObject === 'string') return titleObject;

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
	} catch (err) {
		errorHome.value = err.message;
		console.error('Home page error:', err);
	} finally {
		loadingHome.value = false;
	}
};

const setActiveItem = (index) => {
	if (!isInitialized.value || isChangingActiveItem.value || currentActiveItem.value === index) {
		return;
	}

	isChangingActiveItem.value = true;
	currentActiveItem.value = index;

	setTimeout(() => {
		isChangingActiveItem.value = false;
	}, 100);
};

watch(currentActiveItem, (newActive) => {
	videoRefs.value.forEach((video, index) => {
		if (video && video.pause && index !== newActive) {
			video.pause();
			video.currentTime = 0;
		}
	});

	if (videoRefs.value[newActive]) {
		const activeVideo = videoRefs.value[newActive];
		if (activeVideo && activeVideo.play) {
			if (activeVideo.ended) {
				activeVideo.currentTime = 0;
			}

			setTimeout(() => {
				activeVideo.play().catch((error) => {
					if (!error.name?.includes('NotAllowedError') && !error.message?.includes('autoplay') && !error.name?.includes('AbortError')) {
						console.warn('Video play failed:', error);
					}
				});
			}, 50);
		}
	}
});

const createScrollTriggers = () => {
	if (!customItems.value.length) return;

	scrollTriggers.value.forEach((trigger) => trigger.kill());
	scrollTriggers.value = [];

	customItems.value.forEach((_, index) => {
		const element = imageWrapperRefs.value[index];
		if (!element) return;

		const trigger = ScrollTrigger.create({
			trigger: element,
			scroller: homePageRef.value,
			horizontal: isDesktop.value,
			start: isDesktop.value ? 'left 55%' : 'top center',
			end: isDesktop.value ? `right 80%-=9rem` : 'bottom center',
			markers: true,
			onEnter: () => {
				console.log('ScrollTrigger: Image', index);
				setActiveItem(index);
			},
			onEnterBack: () => {
				setActiveItem(index);
			},
		});

		scrollTriggers.value.push(trigger);
	});
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

			setTimeout(() => {
				createScrollTriggers();
				isInitialized.value = true;
			}, 1000);
		}
	} catch (err) {
		errorHome.value = err;
	}
});

onUnmounted(() => {
	scrollTriggers.value.forEach((trigger) => trigger.kill());
	scrollTriggers.value = [];

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

		@include tablet {
			flex-direction: row;
			height: 100vh;
			min-height: auto;
			width: max-content;
		}

		.images-container {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 9rem;
			margin-top: 9rem;

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
				margin-top: 0rem;
				margin-left: 9rem;
			}

			.image-wrapper {
				width: calc(100vw - 18rem);
				flex-shrink: 0;
				overflow: hidden;
				cursor: pointer;

				@include tablet {
					width: calc(100vw / 4 - 9rem);
					height: auto;
					aspect-ratio: 429 / 249;
				}

				.video-container {
					position: relative;
					width: 100%;
					height: 100%;
					overflow: hidden;
					background-color: $black;

					.video-thumbnail {
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						z-index: 2;
						transition: opacity 0.7s linear;
						opacity: 1;

						&.hidden {
							opacity: 0;
							pointer-events: none;
						}

						img {
							width: 100%;
							height: 100%;
							object-fit: cover;
						}
					}

					.video-element {
						width: 100%;
						height: 100%;
						object-fit: cover;
						opacity: 0;
						transition: opacity 0.7s linear;

						&.visible {
							opacity: 1;
						}
					}
				}
			}
		}
	}
}
</style>
