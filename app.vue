<template>
	<NuxtPage />
	<Navigation />
</template>

<script setup>
import Navigation from '@/components/Navigation.vue';
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
