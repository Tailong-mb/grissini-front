<template>
	<div class="language-switcher">
		<select v-model="currentLocale" @change="switchLanguage(currentLocale)" class="language-select">
			<option v-for="locale in availableLocales" :key="locale.code" :value="locale.code">
				{{ locale.name }}
			</option>
		</select>
	</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const { locale, availableLocales } = useI18n();

const currentLocale = computed({
	get: () => locale.value,
	set: (value) => {
		locale.value = value;
	},
});

const switchLanguage = (newLocale) => {
	locale.value = newLocale;
};
</script>

<style scoped>
.language-switcher {
	display: flex;
	align-items: center;
}

.language-select {
	padding: 0.5rem;
	border: 1px solid #ccc;
	background: white;
	border-radius: 4px;
	font-size: 14px;
	cursor: pointer;
	transition: all 0.2s;
}

.language-select:hover {
	border-color: #007bff;
}

.language-select:focus {
	outline: none;
	border-color: #007bff;
	box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}
</style>
