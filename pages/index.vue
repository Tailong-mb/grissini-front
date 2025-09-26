<template>
	<div class="collections-page"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSanityHome } from '@/composables/useSanityHome';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const homeData = ref(null);
const loadingHome = ref(false);
const errorHome = ref(null);

const loadHomeData = async () => {
	loadingHome.value = true;
	errorHome.value = null;
	try {
		homeData.value = await useSanityHome();
	} catch (err) {
		errorHome.value = err.message;
	} finally {
		loadingHome.value = false;
	}
};

onMounted(async () => {
	await loadHomeData();
});
</script>

<style scoped></style>
