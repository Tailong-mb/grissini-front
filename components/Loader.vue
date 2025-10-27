<template>
	<div class="loader" ref="loaderRef">
		<PartitionSvg theme="light" />
		<div class="loader__logo" ref="logoRef">
			<LogoSvg />
		</div>
	</div>
</template>
<script setup>
import LogoSvg from '@/components/svg/LogoSvg.vue';
import PartitionSvg from '@/components/svg/PartitionSvg.vue';
import { gsap } from 'gsap';

const logoRef = ref(null);
const loaderRef = ref(null);

onMounted(() => {
	openAnimation();
});

const openAnimation = () => {
	const tl = gsap.timeline();
	tl.fromTo(
		logoRef.value,
		{
			opacity: 0,
		},
		{
			opacity: 1,
			duration: 0.8,
			ease: 'linear',
		},
		2
	);

	tl.to(loaderRef.value, {
		clipPath: 'inset(0 0 100% 0)',
		duration: 1,
		ease: 'immg.zoomIn',
	});
};
</script>
<style lang="scss" scoped>
.loader {
	position: fixed;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	background-color: $white;
	z-index: 1000;
	gap: 24rem;
}
</style>
