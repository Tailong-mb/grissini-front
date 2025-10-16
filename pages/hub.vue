<template>
	<div class="hub-page">
		<div v-if="hubData && hubData.items && hubData.items.length > 0" class="view-scroll container">
			<div class="video-scroll-container tb:col-start-6 tb:col-end-12">
				<div class="video-scroll-item" v-for="(item, index) in hubData.items" :key="item._key">
					<Video :thumbnailMobile="item.thumbnailMobile?.asset?.url || ''" :thumbnailDesktop="item.thumbnailDesktop?.asset?.url || ''" :videoMobile="item.videoMobile?.asset?.url || ''" :videoDesktop="item.videoDesktop?.asset?.url || ''" :isActive="currentActiveItem === index" />
				</div>
			</div>
			<div class="view-scroll-content col-start-2 col-end-5">
				<div class="view-scroll-item" v-for="(item, index) in hubData.items" :key="item._key" :class="{ active: currentActiveItem === index }" @click="setActiveItem(index)">
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
				<a class="view-all" :href="hubData.watchAllLink" target="_blank" rel="noopener noreferrer">
					{{ getLocalizedText(hubData.watchAllText, locale) }}
				</a>
			</div>
		</div>
		<div v-if="hubData && hubData.items && hubData.items.length > 0">
			<HubVideo :items="hubData.items" :open="viewMode === 'watch'" type="hub" />
		</div>
		<div class="view-selector container">
			<div class="view-selector-content tb:col-start-4 tb:col-end-10">
				<div class="title-view">{{ getLocalizedText(viewText, locale) }}</div>
				<button class="view-button-scroll" @click="openViewSelector" :class="{ active: viewMode === 'scroll' }"></button>
				<button class="view-button-watch" @click="openViewSelector" :class="{ active: viewMode === 'watch' }"></button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useSanityHub } from '@/composables/useSanityHub';
import { useI18n } from 'vue-i18n';
import HubVideo from '@/components/HubVideo.vue';
import Video from '@/components/Video.vue';
import { getLocalizedText } from '@/utils/translate';

const { locale } = useI18n();

const hubData = ref(null);
const loading = ref(false);
const error = ref(null);
const viewMode = ref('scroll');
const currentActiveItem = ref(0);
const { $lenis } = useNuxtApp();

const viewText = computed(() => getLocalizedText(hubData.value?.viewText, locale.value));

const loadHubData = async () => {
	loading.value = true;
	error.value = null;
	try {
		hubData.value = await useSanityHub(locale.value);
		console.log('=== HUB PAGE DATA ===');
		console.log('Locale:', locale.value);
		console.log('Hub Data:', hubData.value);
		console.log('=====================');
	} catch (err) {
		error.value = err.message;
		console.error('Hub page error:', err);
	} finally {
		loading.value = false;
	}
};

// Set active item manually (from click)
const setActiveItem = (index) => {
	console.log('Setting active item to:', index);
	currentActiveItem.value = index;
};

// Scroll handler to update active item
const handleScroll = (scrollInfo) => {
	if (!hubData.value?.items) return;

	const scrollY = scrollInfo?.scroll || window.scrollY;
	const windowHeight = window.innerHeight;
	const itemHeight = windowHeight / hubData.value.items.length;
	const newActiveItem = Math.floor(scrollY / itemHeight);

	if (newActiveItem >= 0 && newActiveItem < hubData.value.items.length && newActiveItem !== currentActiveItem.value) {
		console.log('Scroll changing active item to:', newActiveItem);
		currentActiveItem.value = newActiveItem;
	}
};

// Handlers
const openViewSelector = () => {
	$lenis.scrollTo(0, { duration: 0.3 });
	viewMode.value = viewMode.value === 'scroll' ? 'watch' : 'scroll';
};

onMounted(async () => {
	await loadHubData();

	// Use Lenis scroll event if available, otherwise fallback to window scroll
	if ($lenis) {
		$lenis.on('scroll', handleScroll);
	} else {
		window.addEventListener('scroll', () => handleScroll({ scroll: window.scrollY }));
	}
});

onUnmounted(() => {
	if ($lenis) {
		$lenis.off('scroll', handleScroll);
	} else {
		window.removeEventListener('scroll', handleScroll);
	}
});
</script>

<style lang="scss" scoped>
.hub-page {
	position: relative;
	min-height: 100vh;

	.view-scroll {
		.video-scroll-container {
			position: fixed;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			pointer-events: none;
			overflow: hidden;

			@include tablet {
				position: relative;
				display: flex;
				flex-direction: column;
				gap: 10rem;
			}

			.video-scroll-item {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				object-fit: cover;

				@include tablet {
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

			@include tablet {
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

					@include tablet {
						color: $black;
					}
				}
				.video-scroll-item-content {
					.video-scroll-item-content-title {
						@include switzer(600, normal);
						font-size: 12rem;
						text-transform: uppercase;
						color: $white;

						@include tablet {
							color: $black;
						}
					}
					.video-scroll-item-content-subtitle {
						@include switzer(500, normal);
						font-size: 12rem;
						color: $white;
						opacity: 0.4;

						@include tablet {
							color: $black;
						}
					}
				}
			}
		}
	}

	.view-selector {
		position: fixed;
		bottom: 8rem;
		display: none;

		@include tablet {
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
