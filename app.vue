<template>
	<NuxtPage />
</template>

<script setup>
import { useTransitionComposable } from '@/composables/transition-composable';

const { toggleTransitionComplete } = useTransitionComposable();
</script>

<style lang="scss">
// html {
// 	font-size: calc(max(100vw / 360, 1px));

// 	@include tablet {
// 		font-size: calc(max(100vw / 768, 1px));
// 	}

// 	@include desktop {
// 		font-size: calc(max(100vw / 1025, 1px));
// 	}

// 	@include large {
// 		font-size: calc(min(1px, 100vh / 800));
// 	}
// }
</style>
