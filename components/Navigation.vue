<template>
	<nav>
		<ul v-if="data?.mainNavigation && data.mainNavigation.length > 0">
			<li v-for="link in data.mainNavigation" :key="link.url">
				<NuxtLink :to="link.url" :class="{ active: isActiveLink(link.url) }">
					<NoteSvg :active="isActiveLink(link.url)" />
					{{ link.text }}
				</NuxtLink>
			</li>
		</ul>
	</nav>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import NoteSvg from '@/components/svg/NoteSvg.vue';

const { locale } = useI18n();
const route = useRoute();
const rawData = ref(null);

const data = computed(() => {
	if (!rawData.value?.mainNavigation) return null;

	return {
		mainNavigation: rawData.value.mainNavigation.map((link) => ({
			...link,
			text: link.text[locale.value] || link.text.en || link.text,
		})),
	};
});

const isActiveLink = (linkUrl) => {
	if (!linkUrl || !route.path) return false;

	const currentPath = route.path;
	const normalizedLinkUrl = linkUrl.startsWith('/') ? linkUrl : `/${linkUrl}`;

	const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}\//, '/');

	const linkWithoutLocale = normalizedLinkUrl.replace(/^\/[a-z]{2}\//, '/');

	return pathWithoutLocale === linkWithoutLocale || pathWithoutLocale.startsWith(linkWithoutLocale + '/');
};

const loadNavigationData = async () => {
	try {
		rawData.value = await useSanityNavigation();
		console.log('=== NAVIGATION DATA ===');
		console.log('Raw Data:', rawData.value);
		console.log('Current Locale:', locale.value);
		console.log('Computed Data:', data.value);
		console.log('========================');
	} catch (err) {
		console.error('Navigation loading error:', err);
	}
};

onMounted(loadNavigationData);
</script>

<style lang="scss" scoped>
nav {
	position: fixed;
	bottom: 24rem;
	left: 8rem;
	z-index: 100;
	pointer-events: none;
	display: none;

	@include tablet {
		display: block;
	}

	ul {
		display: flex;
		flex-direction: column;
		gap: 8rem;

		li {
			a {
				display: flex;
				align-items: center;
				pointer-events: all;
				gap: 8rem;
				font-size: 12rem;
				@include switzer(600, normal);
				color: $black;
				transition:
					opacity 0.3s linear,
					transform 0.3s $out-quad;
				opacity: 0.2;
				text-transform: uppercase;
				padding-left: 24rem;
				transform: translate3d(-24rem, 0, 0);

				&:hover,
				&.active {
					transform: translate3d(0, 0, 0);
					opacity: 1;
				}
			}
		}
	}
}
</style>
