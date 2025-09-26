<template>
	<div>
		<h1>Home Page</h1>
		<p>Check console for data logs</p>

		<div v-if="loadingHome">Loading...</div>
		<div v-else-if="errorHome">Error: {{ errorHome }}</div>
		<div v-else-if="homeData">
			<h2>{{ getLocalizedTitle(homeData.title) }}</h2>
			<div v-if="homeData.items && homeData.items.length > 0">
				<h3>Home Items ({{ homeData.items.length }}):</h3>
				<div v-for="item in homeData.items" :key="item._key" style="border: 1px solid #ddd; padding: 15px; margin: 10px 0">
					<h4>{{ getLocalizedTitle(item.title) }}</h4>
					<p><strong>Description:</strong> {{ getLocalizedTitle(item.description) }}</p>
					<p><strong>Thumbnail:</strong> {{ item.thumbnail ? 'Yes' : 'No' }}</p>
					<p><strong>Video:</strong> {{ item.video ? 'Yes' : 'No' }}</p>
					<p><strong>Link:</strong> {{ item.url || 'No link' }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSanityHome } from '@/composables/useSanityHome';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const homeData = ref(null);
const loadingHome = ref(false);
const errorHome = ref(null);

const getLocalizedTitle = (titleObject) => {
	if (!titleObject) return '';
	return titleObject[locale.value] || titleObject.en || '';
};

const loadHomeData = async () => {
	loadingHome.value = true;
	errorHome.value = null;
	try {
		homeData.value = await useSanityHome();
		console.log('=== HOME PAGE DATA ===');
		console.log('Locale:', locale.value);
		console.log('Home Data:', homeData.value);
		console.log('=====================');
	} catch (err) {
		errorHome.value = err.message;
		console.error('Home page error:', err);
	} finally {
		loadingHome.value = false;
	}
};

onMounted(async () => {
	await loadHomeData();
});
</script>
