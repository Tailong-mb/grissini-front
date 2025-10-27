<template>
	<div class="hub-page" ref="hubPageRef">
		<div v-if="hubData && hubData.items && hubData.items.length > 0" class="view-scroll container" :class="{ 'view-scroll-active': viewMode === 'scroll' }">
			<div class="video-scroll-container dk:col-start-6 dk:col-end-12">
				<div
					class="video-scroll-item"
					v-for="(item, index) in hubData.items"
					:key="item._key"
					:ref="
						(el) => {
							if (el) videoScrollRefs[index] = el;
						}
					"
				>
					<Video
						:thumbnailMobile="item.thumbnailMobile?.asset?.url || ''"
						:thumbnailDesktop="item.thumbnailDesktop?.asset?.url || ''"
						:videoMobile="item.videoMobile?.asset?.url || ''"
						:videoDesktop="item.videoDesktop?.asset?.url || ''"
						:isActive="currentActiveItem === index"
						:linkUrl="item.link || ''"
						:linkText="getLocalizedText(hubData.watchText, locale) || ''"
					/>
				</div>
			</div>
			<div class="view-scroll-content col-start-2 col-end-5">
				<div class="view-scroll-item" v-for="(item, index) in hubData.items" :key="item._key" :class="{ active: currentActiveItem === index }" @click="setActiveItem(index)" ref="viewScrollItemRefs">
					<div class="view-scroll-index">{{ String(index + 1).padStart(2, '0') }}/</div>
					<div class="video-scroll-item-content">
						<div class="video-scroll-item-content-title">
							{{ getLocalizedText(item.title, locale) }}
						</div>
						<div class="video-scroll-item-content-subtitle">
							{{ getLocalizedText(item.subtitle, locale) }}
						</div>
					</div>
				</div>
				<a class="view-all" :href="hubData.watchAllLink" target="_blank" rel="noopener noreferrer" ref="viewAllRef">
					{{ getLocalizedText(hubData.watchAllText, locale) }}
				</a>
			</div>
		</div>
		<div v-if="hubData && hubData.items && hubData.items.length > 0">
			<HubVideo :items="hubData.items" :open="viewMode === 'watch'" type="hub" />
		</div>
		<div class="view-selector container">
			<div class="view-selector-content dk:col-start-4 dk:col-end-10">
				<div class="title-view">{{ getLocalizedText(viewText, locale) }}</div>
				<button class="view-button-scroll" @click="openViewSelector" :class="{ active: viewMode === 'scroll' }"></button>
				<button class="view-button-watch" @click="openViewSelector" :class="{ active: viewMode === 'watch' }"></button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue';
import { useSanityHub } from '@/composables/useSanityHub';
import { useI18n } from 'vue-i18n';
import HubVideo from '@/components/HubVideo.vue';
import Video from '@/components/Video.vue';
import { getLocalizedText } from '@/utils/translate';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const { locale } = useI18n();

const hubData = ref(null);
const loading = ref(false);
const error = ref(null);
const viewMode = ref('scroll');
const currentActiveItem = ref(0);
const { $lenis } = useNuxtApp();
const videoScrollRefs = ref([]);
const scrollTriggers = ref([]);
const isDesktop = ref(false);
const isAutoCentering = ref(false);
const hubPageRef = ref(null);
const viewText = computed(() => getLocalizedText(hubData.value?.viewText, locale.value));

const loadHubData = async () => {
	loading.value = true;
	error.value = null;
	try {
		hubData.value = await useSanityHub(locale.value);
	} catch (err) {
		error.value = err.message;
	} finally {
		loading.value = false;
	}
};

const centerActiveItem = (force = false) => {
	if (!isDesktop.value || !videoScrollRefs.value[currentActiveItem.value] || isAutoCentering.value) return;

	const targetElement = videoScrollRefs.value[currentActiveItem.value];
	const targetPosition = targetElement.offsetTop - window.innerHeight / 2 + targetElement.offsetHeight / 2;
	const currentScroll = window.scrollY;
	const tolerance = 50;

	if (!force && Math.abs(currentScroll - targetPosition) < tolerance) {
		return;
	}

	isAutoCentering.value = true;

	if ($lenis) {
		$lenis.scrollTo(targetPosition, {
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			onComplete: () => {
				isAutoCentering.value = false;
			},
		});
	} else {
		window.scrollTo({ top: targetPosition, behavior: 'smooth' });
		setTimeout(() => {
			isAutoCentering.value = false;
		}, 1200);
	}
};

const setActiveItem = (index) => {
	currentActiveItem.value = index;

	if (isDesktop.value) {
		centerActiveItem(true);
	}
};

const createScrollTriggers = () => {
	if (!isDesktop.value || !hubData.value?.items) return;

	scrollTriggers.value.forEach((trigger) => trigger.kill());
	scrollTriggers.value = [];

	hubData.value.items.forEach((item, index) => {
		const element = videoScrollRefs.value[index];
		if (!element) return;

		const trigger = ScrollTrigger.create({
			trigger: element,
			start: 'top center',
			end: 'bottom center',
			onEnter: () => {
				currentActiveItem.value = index;
			},
			onEnterBack: () => {
				currentActiveItem.value = index;
			},
		});

		scrollTriggers.value.push(trigger);
	});
};

const handleScroll = (scrollInfo) => {
	if (!hubData.value?.items || isDesktop.value) return;

	const scrollY = scrollInfo?.scroll || window.scrollY;
	const windowHeight = window.innerHeight;
	const itemHeight = windowHeight / hubData.value.items.length;
	const newActiveItem = Math.floor(scrollY / itemHeight);

	if (newActiveItem >= 0 && newActiveItem < hubData.value.items.length && newActiveItem !== currentActiveItem.value) {
		currentActiveItem.value = newActiveItem;
	}
};

const openViewSelector = () => {
	$lenis.scrollTo(0, { duration: 0.3 });
	viewMode.value = viewMode.value === 'scroll' ? 'watch' : 'scroll';
};

onMounted(async () => {
	await loadHubData();
	await nextTick();
	openAnimation();

	isDesktop.value = window.matchMedia('(min-width: 1024px)').matches;

	if (isDesktop.value) {
		createScrollTriggers();

		if ($lenis) {
			let scrollTimeout;
			$lenis.on('scroll', (scrollInfo) => {
				clearTimeout(scrollTimeout);

				if (Math.abs(scrollInfo.velocity) < 0.1) {
					scrollTimeout = setTimeout(() => {
						centerActiveItem();
					}, 200);
				}
			});
		}
	} else {
		if ($lenis) {
			$lenis.on('scroll', handleScroll);
		} else {
			window.addEventListener('scroll', () => handleScroll({ scroll: window.scrollY }));
		}
	}
});

onUnmounted(() => {
	scrollTriggers.value.forEach((trigger) => trigger.kill());
	scrollTriggers.value = [];

	if ($lenis) {
		$lenis.off('scroll', handleScroll);
	} else {
		window.removeEventListener('scroll', handleScroll);
	}
});

watch(
	[hubData, isDesktop],
	async () => {
		if (hubData.value?.items && isDesktop.value) {
			await nextTick();
			createScrollTriggers();
		}
	},
	{ deep: true }
);
const openAnimation = () => {
	const tl = gsap.timeline();

	tl.fromTo(
		hubPageRef.value,
		{
			opacity: 0,
		},
		{
			opacity: 1,
			duration: 1,
			ease: 'linear',
		}
	);
};
</script>

<style lang="scss" scoped>
.hub-page {
	position: relative;
	min-height: 100vh;

	.view-scroll {
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.7s linear;
		overflow: hidden;
		height: 100dvh;

		&.view-scroll-active {
			opacity: 1;
			pointer-events: all;
			height: auto;
		}
		.video-scroll-container {
			position: fixed;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			pointer-events: none;
			overflow: hidden;

			@include desktop {
				position: relative;
				display: flex;
				flex-direction: column;
				gap: 10rem;
				padding: calc(50dvh - 186rem) 0;
			}

			.video-scroll-item {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				object-fit: cover;

				@include desktop {
					position: relative;
					width: 100%;
					aspect-ratio: 708/372;
					height: auto;
				}

				video {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
		}

		.view-scroll-content {
			position: relative;
			display: flex;
			flex-direction: column;
			justify-content: center;
			height: 100dvh;
			gap: 32px;

			@include desktop {
				position: fixed;
				left: 127rem;
				width: 225rem;
				gap: 32rem;
			}

			.view-scroll-item {
				display: flex;
				justify-content: space-between;
				opacity: 0.4;
				transition: opacity 0.3s linear;
				cursor: pointer;

				&:hover,
				&.active {
					opacity: 1;
				}

				.view-scroll-index {
					@include switzer(600, normal);
					font-size: 12rem;
					text-transform: uppercase;
					color: $white;
					opacity: 0.4;

					@include desktop {
						color: $black;
					}
				}
				.video-scroll-item-content {
					.video-scroll-item-content-title {
						@include switzer(600, normal);
						font-size: 12rem;
						text-transform: uppercase;
						color: $white;

						@include desktop {
							color: $black;
						}
					}
					.video-scroll-item-content-subtitle {
						@include switzer(500, normal);
						font-size: 12rem;
						color: $white;
						opacity: 0.4;

						@include desktop {
							color: $black;
						}
					}
				}
			}

			.view-all {
				position: relative;
				@include switzer(500, normal);
				font-size: 12rem;
				text-transform: uppercase;
				color: $black;
				background-color: $white;
				padding: 16rem 37rem;
				width: fit-content;
				border: solid 1px $white;
				margin: 60rem auto 0 auto;
				padding-bottom: 2rem;

				&::after {
					content: '';
					position: absolute;
					bottom: 0;
					left: 0;
					width: 100%;
					height: 1px;
					background-color: $black;
					transform: scale3d(0, 1, 1);
					transform-origin: right center;
					transition:
						transform 0.5s $out-cubic,
						opacity 0.3s linear;
				}
				&:hover {
					&::after {
						transform: scale3d(1, 1, 1);
						transform-origin: left center;
					}
				}

				@include desktop {
					border: none;
					padding: 0rem;
				}
			}
		}
	}

	.view-selector {
		position: fixed;
		bottom: 8rem;
		display: none;

		@include desktop {
			display: grid;
		}

		.view-selector-content {
			display: flex;
			align-items: center;
			gap: 8rem;

			.title-view {
				@include switzer(600, normal);
				font-size: 12rem;
				text-transform: uppercase;
				color: $black;
			}
			.view-button-scroll {
				width: 14rem;
				height: 21rem;
				border: 1px solid rgb($black, 0.2);
				transition: border 0.3s linear;
			}

			.view-button-watch {
				width: 26rem;
				height: 16rem;
				border: 1px solid rgb($black, 0.2);
				transition: border 0.3s linear;
			}

			.view-button-scroll.active,
			.view-button-watch.active {
				border: 1px solid $black;
			}
		}
	}
}
</style>
