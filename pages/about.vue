<template>
	<div class="about-page">
		<div v-if="loading" class="loading">Loading...</div>
		<div v-else-if="error" class="error">Error: {{ error }}</div>
		<div v-else-if="aboutData && mappedItems && mappedItems.length > 0">
			<HubVideo :items="mappedItems" :open="viewMode === 'watch'" type="about" />
		</div>

		<div class="view-selector container">
			<div class="view-selector-content dk:col-start-4 dk:col-end-10">
				<div class="title-view">{{ aboutData?.viewText }}</div>
				<button class="view-button-scroll" @click="openViewSelector" :class="{ active: viewMode === 'scroll' }"></button>
				<button class="view-button-watch" @click="openViewSelector" :class="{ active: viewMode === 'watch' }"></button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useSanityAbout } from '@/composables/useSanityAbout';
import { useI18n } from 'vue-i18n';
import HubVideo from '@/components/HubVideo.vue';

const { locale } = useI18n();
const { $lenis } = useNuxtApp();

const aboutData = ref(null);
const loading = ref(false);
const error = ref(null);
const viewMode = ref('scroll');

// Map About items to HubVideo expected structure
const mappedItems = computed(() => {
	const items = aboutData.value?.items || [];
	return items.map((it) => ({
		_key: it._key || `${it.title}-${Math.random().toString(36).slice(2)}`,
		title: it.title || '',
		subtitle: it.description || '',
		link: '#',
		thumbnailMobile: it.thumbnail ? { asset: { url: it.thumbnail.asset?.url } } : null,
		thumbnailDesktop: it.thumbnail ? { asset: { url: it.thumbnail.asset?.url } } : null,
		videoMobile: it.video ? { asset: { url: it.video.asset?.url } } : null,
		videoDesktop: it.video ? { asset: { url: it.video.asset?.url } } : null,
	}));
});

const loadAboutData = async () => {
	loading.value = true;
	error.value = null;
	try {
		aboutData.value = await useSanityAbout(locale.value);
		console.log('=== ABOUT PAGE DATA ===');
		console.log('Locale:', locale.value);
		console.log('About Data:', aboutData.value);
		console.log('========================');
	} catch (err) {
		error.value = err.message;
		console.error('About page error:', err);
	} finally {
		loading.value = false;
	}
};

onMounted(async () => {
	await loadAboutData();
});

// Handlers
const openViewSelector = () => {
	$lenis?.scrollTo(0, { duration: 0.3 });
	viewMode.value = viewMode.value === 'scroll' ? 'watch' : 'scroll';
};
</script>

<style lang="scss" scoped>
.about-page {
	position: relative;
	min-height: 100vh;

	.loading,
	.error {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		font-size: 18rem;
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
