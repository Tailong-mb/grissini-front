<template>
	<div class="language-switcher__wrapper" :data-theme="theme">
		<div class="language-switcher">
			<button v-for="localeItem in locales" :key="localeItem.code" @click="switchLanguage(localeItem.code)" :class="{ active: localeItem.code === $i18n.locale, 'switch-active': switchLanguageValue }" class="language-btn">
				{{ localeItem.code.toUpperCase() }}
			</button>
		</div>
		<button class="language-switcher__switch" :class="{ 'switch-active': switchLanguageValue }" @click="switchLanguageValue = !switchLanguageValue">
			<SwitchSvg :theme="theme" />
		</button>
	</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import SwitchSvg from '@/components/svg/SwitchSvg.vue';

const props = defineProps({
	theme: {
		type: String,
		default: 'light',
	},
});

const { locale, availableLocales } = useI18n();
const switchLanguageValue = ref(false);
const route = useRoute();
const router = useRouter();

const fallbackLocales = [
	{ code: 'en', name: 'English' },
	{ code: 'fr', name: 'Français' },
	{ code: 'zh', name: '中文' },
	{ code: 'no', name: 'Norsk' },
	{ code: 'sv', name: 'Svenska' },
	{ code: 'ja', name: '日本語' },
	{ code: 'es', name: 'Español' },
];

const locales = computed(() => {
	const allLocales = availableLocales.value && availableLocales.value.length > 0 ? availableLocales.value : fallbackLocales;

	const currentLocale = locale.value;
	const activeLocale = allLocales.find((l) => l.code === currentLocale);
	const otherLocales = allLocales.filter((l) => l.code !== currentLocale);

	return activeLocale ? [activeLocale, ...otherLocales] : allLocales;
});

const switchLanguage = async (newLocale) => {
	const currentPath = route.path;
	const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}\//, '/');

	if (newLocale === 'en') {
		await navigateTo(pathWithoutLocale);
	} else {
		await navigateTo(`/${newLocale}${pathWithoutLocale}`);
	}
};
</script>

<style scoped lang="scss">
.language-switcher__wrapper {
	display: flex;

	.language-switcher {
		display: flex;
		flex-direction: column;
		gap: 8rem;

		.language-btn {
			pointer-events: all;
			@include switzer(600, normal);
			color: $black;
			font-size: 12rem;
			opacity: 0;
			pointer-events: none;
			transition:
				opacity 0.3s linear,
				color 0.3s linear;

			&:hover,
			&.active {
				opacity: 1 !important;
			}

			&.switch-active {
				opacity: 0.2;
				pointer-events: all;
			}
		}
	}

	.language-switcher__switch {
		cursor: pointer;
		width: 15rem;
		height: 15rem;
		transform: rotate(-90deg);
		transition: transform 0.3s $out-quad;

		&.switch-active {
			transform: rotate(0deg);
		}
	}

	&[data-theme='dark'] {
		.language-btn {
			color: $white;
		}
	}

	&[data-theme='light'] {
		.language-btn {
			color: $black;
		}
	}
}
</style>
