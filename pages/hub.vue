<template>
	<div class="hub-page">
		<div v-if="loading" class="loading">Loading...</div>
		<div v-else-if="error" class="error">Error: {{ error }}</div>
		<div v-else-if="hubData && hubData.items && hubData.items.length > 0">
			<HubVideo :items="hubData.items" :open="viewMode === 'watch'" />
		</div>
		<div class="view-selector container">
			<div class="view-selector-content tb:col-start-4 tb:col-end-10">
				<div class="title-view">{{ viewText }}</div>
				<button class="view-button-scroll" @click="openViewSelector" :class="{ active: viewMode === 'scroll' }"></button>
				<button class="view-button-watch" @click="openViewSelector" :class="{ active: viewMode === 'watch' }"></button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useSanityHub } from '@/composables/useSanityHub';
import { useI18n } from 'vue-i18n';
import HubVideo from '@/components/HubVideo.vue';
import { getLocalizedText } from '@/utils/translate';

const { locale } = useI18n();

const hubData = ref(null);
const loading = ref(false);
const error = ref(null);
const viewMode = ref('scroll');
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

onMounted(async () => {
	await loadHubData();
});

// Handlers
const openViewSelector = () => {
	$lenis.scrollTo(0, { duration: 0.3 });
	viewMode.value = viewMode.value === 'scroll' ? 'watch' : 'scroll';
};
</script>

<style lang="scss" scoped>
.hub-page {
	position: relative;
	min-height: 100vh;

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
