<template>
	<header class="header container">
		<div class="header__logo col-start-1 col-end-4 tb:col-start-1 tb:col-end-3">
			<NuxtLink to="/">
				<LogoSvg />
			</NuxtLink>
		</div>
		<div class="header__lang col-start-4 col-end-5 tb:col-start-10 tb:col-end-11">
			<LanguageSwitcher />
		</div>
		<button class="header__newsletter tb:col-start-11 tb:col-end-12">
			<span>{{ data?.newsletterText }}</span>
		</button>
		<button class="header__menu col-start-5 col-end-6 tb:col-start-12 tb:col-end-13">
			<span>{{ data?.menuText }}</span>
		</button>
	</header>
</template>
<script setup>
import LogoSvg from '@/components/svg/LogoSvg.vue';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';

const { locale } = useI18n();
const rawData = ref(null);

// Computed property to get localized menu data
const data = computed(() => {
	if (!rawData.value) return null;

	return {
		menuText: rawData.value.menuText?.[locale.value] || rawData.value.menuText?.en || rawData.value.menuText,
		menuClose: rawData.value.menuClose?.[locale.value] || rawData.value.menuClose?.en || rawData.value.menuClose,
		description: rawData.value.description?.[locale.value] || rawData.value.description?.en || rawData.value.description,
		newsletterText: rawData.value.newsletterText?.[locale.value] || rawData.value.newsletterText?.en || rawData.value.newsletterText,
		contactText: rawData.value.contactText?.[locale.value] || rawData.value.contactText?.en || rawData.value.contactText,
		mail: rawData.value.mail,
	};
});

const loadMenuData = async () => {
	try {
		rawData.value = await useSanityMenu();
		console.log('=== HEADER MENU DATA ===');
		console.log('Raw Data:', rawData.value);
		console.log('Current Locale:', locale.value);
		console.log('Computed Data:', data.value);
		console.log('========================');
	} catch (err) {
		console.error('Header menu loading error:', err);
	}
};

onMounted(loadMenuData);
</script>

<style lang="scss" scoped>
.header {
	position: fixed;
	top: 8rem;
	z-index: 100;
	pointer-events: none;

	.header__logo {
		a {
			pointer-events: all;
			width: 100%;

			img {
				width: 100%;
				height: auto;
				object-fit: contain;
			}
		}
	}

	.header__lang {
		pointer-events: all;
	}

	.header__newsletter,
	.header__menu {
		position: relative;
		pointer-events: all;

		&:hover {
			span {
				&::after {
					transform: scale3d(1, 1, 1);
					transform-origin: left center;
				}
			}
		}

		span {
			position: relative;
			@include switzer(600, normal);
			color: $black;
			text-transform: uppercase;
			font-size: 12rem;
			transition: opacity 0.3s linear;
			height: fit-content;

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

	.header__newsletter {
		justify-content: flex-end;
		display: none;

		@include tablet {
			display: flex;
		}
	}

	.header__menu {
		display: flex;
		justify-content: flex-end;
	}
}
</style>
