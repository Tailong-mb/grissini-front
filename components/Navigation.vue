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
const data = ref(null);

const isActiveLink = (linkUrl) => {
	if (!linkUrl || !route.path) return false;

	const currentPath = route.path;
	const normalizedLinkUrl = linkUrl.startsWith('/') ? linkUrl : `/${linkUrl}`;

	return currentPath === normalizedLinkUrl || currentPath.startsWith(normalizedLinkUrl + '/');
};

onMounted(async () => {
	try {
		data.value = await useSanityNavigation(locale.value);
		console.log('=== NAVIGATION DATA ===');
		console.log('Locale:', locale.value);
		console.log('Raw Navigation Data:', data.value);
		console.log('mainNavigation:', data.value?.mainNavigation);
		console.log('Type of mainNavigation:', typeof data.value?.mainNavigation);
		console.log('Is Array:', Array.isArray(data.value?.mainNavigation));
		console.log('========================');
	} catch (err) {
		console.error('Navigation loading error:', err);
	}
});
</script>

<style lang="scss" scoped>
nav {
	position: fixed;
	bottom: 24rem;
	left: 8rem;
	z-index: 100;
	display: none;

	@include desktop {
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
