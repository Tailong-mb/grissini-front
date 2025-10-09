<template>
	<div class="navigation-bottom">
		<button @click="openNewsletter">{{ data?.newsletterText }}</button>
		<a :href="`mailto:${data?.mail}`">{{ data?.contactText }}</a>
	</div>
</template>

<script setup>
const { locale } = useI18n();
const { openNewsletter } = useNewsletter();
const rawData = ref(null);

// Computed property to get localized menu data
const data = computed(() => {
	if (!rawData.value) return null;

	return {
		newsletterText: rawData.value.menu?.newsletterText?.[locale.value] || rawData.value.menu?.newsletterText?.en || rawData.value.menu?.newsletterText,
		contactText: rawData.value.menu?.contactText?.[locale.value] || rawData.value.menu?.contactText?.en || rawData.value.menu?.contactText,
		mail: rawData.value.menu?.mail,
		socialLinks: rawData.value.socialMedia?.socialLinks || [],
	};
});

const loadMenuData = async () => {
	try {
		rawData.value = await useSanityMenu();
		console.log('=== NAVIGATION BOTTOM MENU DATA ===');
		console.log('Raw Data:', rawData.value);
		console.log('Current Locale:', locale.value);
		console.log('Computed Data:', data.value);
		console.log('===================================');
	} catch (err) {
		console.error('Navigation bottom menu loading error:', err);
	}
};

onMounted(async () => {
	await loadMenuData();
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
	z-index: 200;
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
