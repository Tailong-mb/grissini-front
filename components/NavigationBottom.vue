<template>
	<div class="navigation-bottom">
		<button>{{ data?.newsletterText }}</button>
		<a :href="`mailto:${data?.mail}`">{{ data?.contactText }}</a>
	</div>
</template>

<script setup>
const { locale } = useI18n();
const data = ref(null);

onMounted(async () => {
	data.value = await useSanityMenu(locale.value);

	console.log('=== MENU DATA ===');
	console.log('Locale:', locale.value);
	console.log('Menu Data:', data.value);
	console.log('=====================');
});
</script>

<style lang="scss" scoped>
.navigation-bottom {
	position: fixed;
	bottom: 8rem;
	left: 8rem;
	display: flex;
	justify-content: space-between;
	width: calc(100% - 16rem);
	z-index: 100;
	pointer-events: none;

	button {
		@include tablet {
			pointer-events: none;
			opacity: 0;
		}
	}

	a,
	button {
		position: relative;
		padding-bottom: 2rem;
		width: fit-content;
		pointer-events: all;
		@include switzer(600, normal);
		color: $black;
		text-transform: uppercase;
		font-size: 12rem;
		transition: opacity 0.3s linear;

		&:hover {
			&::after {
				transform: scale3d(1, 1, 1);
				transform-origin: left center;
			}
		}

		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 1px;
			background-color: $black;
			transform: scale3d(0, 1, 1);
			transform-origin: right center;
			transition:
				transform 0.5s $out-cubic,
				opacity 0.3s linear;
		}
	}
}
</style>
