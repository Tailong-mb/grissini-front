<template>
	<div>
		<h1>Hub Page</h1>
		<p>Check console for data logs</p>
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
