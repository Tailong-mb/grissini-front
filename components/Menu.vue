<template>
	<div class="menu-popin container" :class="{ active: isOpen }">
		<div class="menu-popin__left tb:col-start-2 tb:col-end-5" :class="{ open: isOpen }">
			<PartitionSvg theme="dark" class="hide_mobile" />
			<p class="hide_mobile">{{ data?.description }}</p>
			<div class="menu-popin__left__social-links">
				<a v-for="link in data?.socialLinks" :key="link.url" :href="link.url" target="_blank">
					{{ link.linkText }}
				</a>
			</div>
		</div>
		<div class="menu-popin__right col-start-1 col-end-6 tb:col-start-7 tb:col-end-13">
			<ul>
				<li v-for="(link, index) in localizedNavigationData?.mainNavigation" :key="link.url" :class="{ open: isOpen }">
					<NuxtLink :to="link.url" :class="{ active: isActiveLink(link.url) }" @click="closeMenu">{{ link.text }}</NuxtLink>
					<div class="index" :class="{ active: isActiveLink(link.url) }">({{ String(index + 1).padStart(2, '0') }})</div>
				</li>
				<li :class="{ open: isOpen }">
					<button
						@click="
							() => {
								(openCart(), closeMenu());
							}
						"
					>
						{{ data?.cartMenuTitle }}
					</button>
					<div class="index">({{ String(localizedNavigationData?.mainNavigation?.length + 1).padStart(2, '0') }})</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup>
import PartitionSvg from '@/components/svg/PartitionSvg.vue';
import { getLocalizedText } from '@/utils/translate';

const { isOpen, closeMenu } = useMenu();
const { openCart } = useCart();
const { locale } = useI18n();
const route = useRoute();
const rawData = ref(null);
const navigationData = ref(null);

// Computed property to get localized menu data
const data = computed(() => {
	if (!rawData.value) return null;

	return {
		description: getLocalizedText(rawData.value.menu?.description, locale.value),
		newsletterText: getLocalizedText(rawData.value.menu?.newsletterText, locale.value),
		contactText: getLocalizedText(rawData.value.menu?.contactText, locale.value),
		mail: rawData.value.menu?.mail,
		cartMenuTitle: getLocalizedText(rawData.value.menu?.cartMenuTitle, locale.value),
		socialLinks:
			rawData.value.socialMedia?.socialLinks?.map((link) => ({
				...link,
				linkText: getLocalizedText(link.linkText, locale.value),
			})) || [],
	};
});

// Computed property to get localized navigation data
const localizedNavigationData = computed(() => {
	if (!navigationData.value?.mainNavigation) return null;

	return {
		mainNavigation: navigationData.value.mainNavigation.map((link) => ({
			...link,
			text: getLocalizedText(link.text, locale.value),
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

const loadMenuData = async () => {
	try {
		rawData.value = await useSanityMenu();
		navigationData.value = await useSanityNavigation();
		console.log('=== MENU DATA ===');
		console.log('Raw Menu Data:', rawData.value);
		console.log('Raw Navigation Data:', navigationData.value);
		console.log('Current Locale:', locale.value);
		console.log('Computed Menu Data:', data.value);
		console.log('Computed Navigation Data:', localizedNavigationData.value);
		console.log('Cart Menu Title:', data.value?.cartMenuTitle);
		console.log('=================');
	} catch (err) {
		console.error('Menu loading error:', err);
	}
};

onMounted(async () => {
	await loadMenuData();
});
</script>

<style lang="scss" scoped>
.menu-popin {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100dvh;
	z-index: 110;
	margin: 0;
	transform: translate3d(0, -100%, 0);
	background-color: $black;
	transition: transform 0.6s $out-quart;

	&.active {
		transition: transform 0.8s $immg-zoomIn;
		transform: translate3d(0, 0, 0);
	}

	.menu-popin__left {
		position: absolute;
		bottom: 8rem;
		left: 8rem;
		opacity: 0;
		transition: opacity 0.3s linear;

		&.open {
			opacity: 1;
			transition: 0.7s opacity 0.7s linear;
		}

		@include tablet {
			position: relative;
			display: flex;
			flex-direction: column;
			justify-content: center;
			gap: 60rem;
		}

		.hide_mobile {
			display: none;

			@include tablet {
				display: block;
			}
		}

		p {
			@include switzer(500, normal);
			color: $white;
			font-size: 12rem;
			opacity: 0.34;
		}

		.menu-popin__left__social-links {
			display: flex;
			gap: 24rem;
			flex-wrap: wrap;

			a {
				position: relative;
				transition:
					opacity 0.3s linear,
					color 0.3s linear;
				@include switzer(500, normal);
				color: $white;
				font-size: 10rem;
				text-transform: uppercase;

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
					background-color: $white;
					transform: scale3d(0, 1, 1);
					transform-origin: right center;
					transition:
						transform 0.5s $out-cubic,
						opacity 0.3s linear;
				}
			}
		}
	}

	.menu-popin__right {
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin: 0 8rem;

		@include tablet {
			margin: 0;
		}

		ul {
			display: flex;
			flex-direction: column;
			gap: 20rem;

			@include tablet {
				gap: 19rem;
			}

			li {
				position: relative;
				display: flex;
				opacity: 0;
				transition: opacity 0.3s linear;
				transform: translate3d(0px, -20rem, 0px);

				&.open {
					transform: translate3d(0px, 0px, 0px);
					opacity: 1;
					transition:
						opacity 0.7s linear,
						transform 1.2s $out-quart;
					&:nth-child(1) {
						transition-delay: 0.4s;
					}
					&:nth-child(2) {
						transition-delay: 0.5s;
					}
					&:nth-child(3) {
						transition-delay: 0.6s;
					}
					&:nth-child(4) {
						transition-delay: 0.7s;
					}
					&:nth-child(5) {
						transition-delay: 0.8s;
					}
					&:nth-child(6) {
						transition-delay: 0.9s;
					}
					&:nth-child(7) {
						transition-delay: 1s;
					}
					&:nth-child(8) {
						transition-delay: 1.1s;
					}
				}

				&:hover {
					a {
						opacity: 1;
					}

					.index {
						opacity: 1;
					}
				}

				a,
				button {
					@include ppeditorial(200, normal);
					text-transform: uppercase;
					font-size: 50rem;
					color: $white;
					line-height: 0.9;
					opacity: 0.6;
					transition:
						opacity 0.3s linear,
						color 0.3s linear;

					&:hover,
					&.active {
						opacity: 1;
						color: $white;
					}

					@include desktop {
						font-size: 71rem;
					}
				}

				.index {
					@include switzer(500, normal);
					font-size: 12rem;
					color: $white;
					opacity: 0.6;
					transition: opacity 0.3s linear;
					transform: translate3d(0px, -7rem, 0px);

					@include desktop {
						transform: translate3d(0px, -10rem, 0px);
					}

					&.active {
						opacity: 1;
					}
				}
			}
		}
	}
}
</style>
