<template>
	<div>
		<h1>About Page</h1>
		<p>Check console for data logs</p>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSanityAbout } from '@/composables/useSanityAbout';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const aboutData = ref(null);
const loading = ref(false);
const error = ref(null);

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
</script>
