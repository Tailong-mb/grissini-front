<template>
	<NuxtPage :transition="pageTransition" />
	<Header />
	<Navigation />
	<NavigationBottom />
</template>

<script setup>
import Header from '@/components/Header.vue';
import Navigation from '@/components/Navigation.vue';
import NavigationBottom from '@/components/NavigationBottom.vue';
import pageTransition from '@/helpers/transitionConfig';
</script>

<style lang="scss">
html {
	font-size: calc(max(100vw / 360, 1px));
	background-color: $white;
	min-height: 100dvh;

	@include tablet {
		font-size: calc(max(100vw / 768, 1px));
	}

	@include desktop {
		font-size: 1px;
	}

	@include large {
		font-size: calc(min(1px, 100vh / 800));
	}
}
</style>
