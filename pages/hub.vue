<template>
	<div>
		<h1>Hub Page</h1>
		<p>Check console for data logs</p>

		<div v-if="loading">Loading...</div>
		<div v-else-if="error">Error: {{ error }}</div>
		<div v-else-if="hubData">
			<h2>{{ hubData.viewText }}</h2>
			<p><strong>Watch All Text:</strong> {{ hubData.watchAllText }}</p>
			<p><strong>Watch All Link:</strong> {{ hubData.watchAllLink || 'No link' }}</p>
			<p><strong>Watch Text:</strong> {{ hubData.watchText }}</p>

			<div v-if="hubData.items && hubData.items.length > 0">
				<h3>Hub Items ({{ hubData.items.length }}):</h3>
				<div v-for="item in hubData.items" :key="item._key" style="border: 1px solid #ddd; padding: 15px; margin: 10px 0">
					<h4>{{ item.title }}</h4>
					<p><strong>Subtitle:</strong> {{ item.subtitle }}</p>
					<p><strong>Thumbnail Mobile:</strong> {{ item.thumbnailMobile ? 'Yes' : 'No' }}</p>
					<p><strong>Thumbnail Desktop:</strong> {{ item.thumbnailDesktop ? 'Yes' : 'No' }}</p>
					<p><strong>Video Mobile:</strong> {{ item.videoMobile ? 'Yes' : 'No' }}</p>
					<p><strong>Video Desktop:</strong> {{ item.videoDesktop ? 'Yes' : 'No' }}</p>
					<p><strong>Link:</strong> {{ item.link || 'No link' }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSanityHub } from '@/composables/useSanityHub';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const hubData = ref(null);
const loading = ref(false);
const error = ref(null);

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
</script>
