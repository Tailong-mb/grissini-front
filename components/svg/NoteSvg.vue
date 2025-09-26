<template>
	<svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg" :class="{ active: active }">
		<path d="M5.5.5c1.425 0 2.694.42 3.595 1.076S10.5 3.095 10.5 4s-.504 1.768-1.405 2.424S6.925 7.5 5.5 7.5s-2.694-.42-3.595-1.076S.5 4.905.5 4s.504-1.768 1.405-2.424S4.075.5 5.5.5Z" stroke="#000" fill="#fff" />
	</svg>
</template>

<script setup>
const props = defineProps({
	active: {
		type: Boolean,
		default: false,
	},
});
</script>

<style lang="scss" scoped>
svg {
	position: relative;
	width: 11rem;
	height: 8rem;

	&.active {
		path {
			fill: $black;
			stroke: $black;
		}
	}

	path {
		transition:
			fill 0.3s linear,
			stroke 0.3s linear;
		fill: $white;
	}
}
</style>
