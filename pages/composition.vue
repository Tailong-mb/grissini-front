<template>
	<div>
		<h1>Composition Page</h1>
		<p>Check console for data logs</p>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSanityComposition } from '@/composables/useSanityComposition';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const compositionData = ref(null);
const loading = ref(false);
const error = ref(null);

const loadCompositionData = async () => {
	loading.value = true;
	error.value = null;
	try {
		compositionData.value = await useSanityComposition(locale.value);
		console.log('=== COMPOSITION PAGE DATA ===');
		console.log('Locale:', locale.value);
		console.log('Composition Data:', compositionData.value);
		console.log('==============================');
	} catch (err) {
		error.value = err.message;
		console.error('Composition page error:', err);
	} finally {
		loading.value = false;
	}
};

onMounted(async () => {
	await loadCompositionData();
});
</script>
