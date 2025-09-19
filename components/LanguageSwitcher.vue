<template>
	<div class="language-switcher">
		<button v-for="locale in availableLocales" :key="locale.code" @click="switchLanguage(locale.code)" :class="{ active: locale.code === $i18n.locale }" class="language-btn">
			{{ locale.name }}
		</button>
	</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { locale, availableLocales } = useI18n();

const switchLanguage = (newLocale) => {
	locale.value = newLocale;
};
</script>

<style scoped>
.language-switcher {
	display: flex;
	gap: 0.5rem;
}

.language-btn {
	padding: 0.5rem 1rem;
	border: 1px solid #ccc;
	background: white;
	cursor: pointer;
	border-radius: 4px;
	transition: all 0.2s;
}

.language-btn:hover {
	background: #f5f5f5;
}

.language-btn.active {
	background: #007bff;
	color: white;
	border-color: #007bff;
}
</style>
