<template>
	<div id="page-composition" class="container">
		<div class="left-part col-start-1 col-end-5 tb:col-start-3 tb:col-end-6">
			<h1 ref="titleRef">GRISSINI</h1>
			<p ref="descriptionRef">{{ viewData?.description }}</p>
			<a ref="emailRef" :href="`mailto:${viewData?.email}`">{{ viewData?.email }}</a>
		</div>
		<div class="right-part col-start-1 col-end-5 tb:col-start-8 tb:col-end-11">
			<div class="svg-container" ref="partitionSvgRef">
				<PartitionSvg theme="light" />
			</div>
			<div class="right-part__items">
				<div ref="itemsRef" class="right-part__item" v-for="item in viewData?.items" :key="item._key">
					<h2>{{ item?.title }}</h2>
					<p>{{ item?.description }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useSanityComposition } from '@/composables/useSanityComposition';
import { useI18n } from 'vue-i18n';
import PartitionSvg from '@/components/svg/PartitionSvg.vue';
import { getLocalizedText } from '@/utils/translate';

import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
const { locale } = useI18n();

const titleRef = ref(null);
const descriptionRef = ref(null);
const emailRef = ref(null);
const itemsRef = ref(null);
const partitionSvgRef = ref(null);
const compositionData = ref(null);
const viewData = computed(() => {
	if (!compositionData.value) return null;

	return {
		description: getLocalizedText(compositionData.value.description, locale.value),
		email: compositionData.value.email,
		items: (compositionData.value.items || []).map((item) => ({
			...item,
			title: getLocalizedText(item.title, locale.value),
			description: getLocalizedText(item.description, locale.value),
		})),
		seo: compositionData.value.seo,
	};
});
const loading = ref(false);
const error = ref(null);

const loadCompositionData = async () => {
	loading.value = true;
	error.value = null;
	try {
		compositionData.value = await useSanityComposition();
	} catch (err) {
		error.value = err.message;
		console.error('Composition page error:', err);
	} finally {
		loading.value = false;
	}
};

const openAnimation = () => {
	const tl = gsap.timeline();

	const descriptionSplit = SplitText.create(descriptionRef.value, {
		type: 'words lines',
		linesClass: 'inner-line',
	});

	tl.fromTo(
		[titleRef.value, partitionSvgRef.value, emailRef.value],
		{
			opacity: 0,
		},
		{
			opacity: 1,
			duration: 0.8,
			stagger: 0.2,
			ease: 'linear',
		}
	);

	tl.fromTo(
		descriptionSplit.words,
		{
			y: 60,
		},
		{
			y: 0,
			duration: 0.9,
			ease: 'power2.out',
		},
		0
	);

	tl.fromTo(
		itemsRef.value,
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
		itemsRef.value,
		{
			opacity: 0,
		},
		{
			opacity: 1,
			duration: 0.6,
			stagger: 0.2,
			ease: 'linear',
		},
		0.8
	);
};
onMounted(async () => {
	await loadCompositionData();
	await document.fonts.ready;
	openAnimation();
});
</script>

<style lang="scss" scoped>
#page-composition {
	position: relative;
	padding: 30vh 0;

	.left-part {
		@include tablet {
			position: fixed;
			top: 30vh;
			width: 350rem;
		}

		h1 {
			@include ppeditorial(200, normal);
			font-size: 65rem;

			@include tablet {
				font-size: 80rem;
			}

			@include desktop {
				font-size: 90rem;
			}
		}

		p {
			@include switzer(500, normal);
			font-size: 12rem;
			opacity: 0.34;
			margin-top: 70rem;

			@include tablet {
				margin-top: 80rem;
			}
		}

		a {
			position: relative;
			padding-bottom: 2rem;
			width: fit-content;
			display: block;
			@include switzer(500, normal);
			font-size: 12rem;
			text-transform: uppercase;
			color: $black;
			margin-top: 70rem;

			@include tablet {
				margin-top: 80rem;
			}

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

	.right-part {
		position: relative;
		margin-top: 120rem;

		@include tablet {
			margin-top: 0rem;
		}

		.right-part__items {
			margin-top: 60rem;
			display: flex;
			flex-direction: column;
			gap: 60rem;

			@include tablet {
				margin-top: 70rem;
			}

			.right-part__item {
				h2 {
					@include switzer(500, normal);
					font-size: 12rem;
					text-transform: uppercase;
					color: $black;
				}

				p {
					margin-top: 20rem;
					@include ppeditorial(400, normal);
					font-size: 18rem;
					color: $black;
					opacity: 0.34;
				}
			}
		}
	}
}
</style>
