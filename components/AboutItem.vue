<template>
	<div class="about-item container" ref="aboutItemRef">
		<div class="image-container" :class="{ 'col-start-1 col-end-5 tb:col-end-7': position === 'left', 'col-start-2 col-end-6 hide-tablet': position === 'right' }">
			<img v-if="item.thumbnail?.asset?.url" :src="item.thumbnail.asset.url" :alt="getLocalizedText(item.title, locale)" ref="imageRef" />
		</div>
		<div class="content-container" :class="{ 'col-start-2 col-end-6 tb:col-start-9 tb:col-end-12 left': position === 'left', 'col-start-1 col-end-5 tb:col-start-2 tb:col-end-5 right': position === 'right' }">
			<h2 class="title" ref="titleRef">{{ getLocalizedText(item.title, locale) }}</h2>
			<p class="description" ref="descriptionRef">{{ getLocalizedText(item.description, locale) }}</p>
			<div class="link-container">
				<a v-for="social in item.socialLinks" :key="social._key || social.text" ref="linkRefs" :href="social.url" target="_blank" rel="noopener noreferrer">
					<span>{{ social.text }}</span>
				</a>
			</div>
		</div>
		<div v-if="position === 'right'" class="image-container hide-mobile tb:col-start-7 tb:col-end-13">
			<img v-if="item.thumbnail?.asset?.url" :src="item.thumbnail.asset.url" :alt="getLocalizedText(item.title, locale)" />
		</div>
	</div>
</template>
<script setup>
import { gsap } from 'gsap';
import { useI18n } from 'vue-i18n';
import { getLocalizedText } from '@/utils/translate';

const { locale } = useI18n();
const aboutItemRef = ref(null);
const titleRef = ref(null);
const descriptionRef = ref(null);
const linkRefs = ref([]);
const imageRef = ref(null);
const props = defineProps({
	item: {
		type: Object,
		required: true,
		default: () => ({}),
	},

	position: {
		type: String,
		required: true,
		default: 'left',
	},
});

const openAnimation = () => {
	const tl = gsap.timeline({
		scrollTrigger: {
			trigger: aboutItemRef.value,
			start: 'top bottom-=15%',
			end: 'bottom top',
		},
	});

	tl.fromTo(
		imageRef.value,
		{
			scale: 1.1,
		},
		{
			scale: 1,
			duration: 1.2,
			ease: 'immg.zoomIn',
		},
		0.2
	);

	tl.fromTo(
		titleRef.value,
		{
			yPercent: 100,
		},
		{
			yPercent: 0,
			duration: 1.2,
			stagger: 0.2,
			ease: 'power2.out',
		},
		0.2
	);

	tl.fromTo(
		titleRef.value,
		{
			opacity: 0,
		},
		{
			opacity: 1,
			duration: 0.6,
			ease: 'linear',
		},
		0.8
	);

	tl.fromTo(
		descriptionRef.value,
		{
			opacity: 0,
		},
		{
			opacity: 0.5,
			duration: 0.6,
			ease: 'linear',
		},
		1
	);

	tl.fromTo(
		linkRefs.value,
		{
			opacity: 0,
		},
		{
			opacity: 1,
			duration: 0.6,
			stagger: 0.2,
			ease: 'linear',
		},
		1.2
	);
};

onMounted(() => {
	openAnimation();
});
</script>
<style lang="scss" scoped>
.about-item {
	position: relative;
	margin: 100px 0 !important;

	@include tablet {
		margin: 200rem 0 !important;
	}

	.image-container {
		aspect-ratio: 338 / 216;
		width: 100%;
		overflow: hidden;

		&.hide-mobile {
			@include mobile-only {
				display: none;
			}
		}

		&.hide-tablet {
			@include tablet {
				display: none;
			}
		}

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.content-container {
		margin-top: 100px;

		@include tablet {
			margin-top: 0;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
		}
		&.left {
			padding-right: 8rem;

			@include tablet {
				padding-right: 0;
			}
		}

		&.right {
			padding-left: 8rem;

			@include tablet {
				padding-left: 0;
			}
		}

		.title {
			@include switzer(600, normal);
			font-size: 12rem;
			text-transform: uppercase;
			color: $black;
			margin-bottom: 40rem;
		}

		.description {
			@include switzer(500, normal);
			font-size: 12rem;
			text-transform: uppercase;
			color: $black;
			margin-bottom: 60rem;
			opacity: 0.5;
		}

		.link-container {
			display: flex;
			gap: 76rem;

			a {
				position: relative;
				@include switzer(600, normal);
				color: $black;
				text-transform: uppercase;
				font-size: 12rem;
				transition:
					opacity 0.3s linear,
					color 0.3s linear;
				height: fit-content;

				&:hover {
					span {
						&::after {
							transform: scale3d(1, 1, 1);
							transform-origin: left center;
						}
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
						opacity 0.3s linear,
						background-color 0.3s linear;
				}
			}
		}
	}
}
</style>
