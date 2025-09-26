<template>
	<NuxtPage />
</template>

<script setup></script>

<style lang="scss">
html {
	font-size: calc(max(100vw / 360, 1px));

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
