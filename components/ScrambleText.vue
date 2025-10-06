<template>
	<a class="scramble-text" :class="{ hover: hover }" :href="to" target="_blank" rel="noopener noreferrer" v-if="!noLink">
		<div class="top">
			<h2 class="scramble-text__title" ref="titleRef">{{ title }}</h2>
			<p ref="numberRef">{{ number }}</p>
		</div>
		<p class="scramble-text__subtext" ref="subtextRef">{{ subtext }}</p>
	</a>
	<div class="scramble-text" :class="{ hover: hover, noLink: noLink }" v-if="noLink">
		<div class="top">
			<h2 class="scramble-text__title" ref="titleRef">{{ title }}</h2>
			<p ref="numberRef">{{ number }}</p>
		</div>
		<p class="scramble-text__subtext" ref="subtextRef">{{ subtext }}</p>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { gsap } from 'gsap';

const props = defineProps({
	title: {
		type: String,
		required: true,
	},
	subtext: {
		type: String,
		required: true,
	},
	number: {
		type: [String, Number],
		required: true,
	},
	hover: {
		type: Boolean,
		required: false,
		default: false,
	},
	to: {
		type: String,
		required: false,
		default: '#',
	},
	noLink: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const titleRef = ref(null);
const numberRef = ref(null);
const subtextRef = ref(null);
let tl = null;

const openAnimation = () => {
	tl?.kill();
	tl = gsap.timeline();

	tl.to([titleRef.value, numberRef.value], {
		opacity: 1,
		filter: 'blur(0px)',
		yPercent: 0,
		duration: 1.3,
		ease: 'immg.zoomOut',
	});

	tl.to(
		subtextRef.value,
		{
			opacity: 1,
			filter: 'blur(0px)',
			yPercent: 0,
			duration: 1.3,
			ease: 'immg.zoomOut',
		},
		0.2
	);
};

const closeAnimation = () => {
	tl?.kill();
	tl = gsap.timeline();

	tl.to([titleRef.value, numberRef.value, subtextRef.value], {
		opacity: 0,
		filter: 'blur(8px)',
		yPercent: -50,
		duration: 0.8,
		ease: 'immg.zoomOut',
	});
};

onMounted(() => {
	openAnimation();
});

defineExpose({
	openAnimation,
	closeAnimation,
});
</script>

<style lang="scss" scoped>
.scramble-text {
	position: relative;
	width: 100%;

	&.noLink {
		cursor: default;
	}

	&.hover {
		&:hover {
			.top {
				h2,
				p {
					color: $white;
				}
			}

			.scramble-text__subtext {
				color: $white;
			}
		}
	}

	.top {
		display: flex;
		justify-content: space-between;

		h2 {
			font-size: 10rem;
			@include switzer(700, normal);
			text-transform: uppercase;
			color: #999999;
			filter: blur(8px);
			opacity: 0;
			transition: color 0.3s linear;
		}

		p {
			margin-top: 0;
			font-size: 10rem;
			@include switzer(500, normal);
			text-transform: uppercase;
			line-height: 1.1;
			color: #999999;
			filter: blur(8px);
			opacity: 0;
			transition: color 0.3s linear;
		}
	}

	p {
		margin-top: 4rem;
		font-size: 10rem;
		@include switzer(500, normal);
		text-transform: uppercase;
		line-height: 1.1;
		color: #5c5c5c;
		text-transform: uppercase;
		filter: blur(8px);
		opacity: 0;
		transition: color 0.3s linear;
	}
}
</style>
