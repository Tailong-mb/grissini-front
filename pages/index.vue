<template>
	<div class="home-page">
		<div class="container-wrapper container" ref="containerWrapperRef">
			<div v-for="(item, index) in homeData?.items" :key="`${item._key}-${index}`" class="item" :class="getItemClass(index)" ref="itemRefs">
				<div class="wrapper-item" ref="wrapperItemRefs">
					<a :href="item.url" target="_blank" rel="noopener noreferrer" class="video-container">
						<div class="video-thumbnail" :class="{ 'fade-out': getItemClass(index).includes('active') }">
							<img v-if="item.thumbnail?.url" :src="item.thumbnail.url" :alt="getLocalizedTitle(item.title)" />
						</div>
						<video v-if="item.video?.url" ref="videoRefs" class="video-element" :poster="item.thumbnail?.url" loop playsinline webkit-playsinline :autoplay="getItemClass(index).includes('active')">
							<source :src="item.video.url" type="video/mp4" />
						</video>
					</a>
					<div class="mobile-hiden" :class="{ active: getItemClass(index).includes('active') }">
						<div class="legend-container">
							<div class="index">{{ String(index + 1).padStart(2, '0') }}/</div>
							<div class="subtitle">{{ getLocalizedTitle(item.title) }}</div>
						</div>
						<h2 class="title">{{ getLocalizedTitle(item.title) }}</h2>
						<p class="description">{{ getLocalizedTitle(item.description) }}</p>
						<a :href="item.url" class="link" target="_blank" rel="noopener noreferrer">
							{{ getLocalizedTitle(item.linkName) }}
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useSanityHome } from '@/composables/useSanityHome';
import { useI18n } from 'vue-i18n';
import { Flip } from 'gsap/Flip';

const { locale } = useI18n();

const homeData = ref(null);
const loadingHome = ref(false);
const errorHome = ref(null);
const classes = [
	'absolute left display-none tb:col-start-1 tb:col-end-13',
	'absolute left tb:col-start-1 tb:col-end-13',
	'col-start-1 col-end-4 tb:col-start-1 tb:col-end-3 absolute-first-mobile',
	'col-start-1 col-end-5 tb:col-start-3 tb:col-end-6 absolute-second-mobile',
	'col-start-1 col-end-6 tb:col-start-6 tb:col-end-10 active absolute-third-mobile',
	'col-start-1 col-end-5 tb:col-start-10 tb:col-end-13 absolute-fourth-mobile',
	'col-start-1 col-end-4 tb:col-start-1 tb:col-end-13 desktop-absolute right absolute-fifth-mobile',
	'absolute right display-none-desktop tb:col-start-1 tb:col-end-13',
];

const itemRefs = ref([]);
const videoRefs = ref([]);
const wrapperItemRefs = ref([]);
const containerWrapperRef = ref(null);

// État de navigation
const currentIndex = ref(0);
const isAnimating = ref(false);

const getLocalizedTitle = (titleObject) => {
	if (!titleObject) return '';

	if (typeof titleObject === 'string') return titleObject;

	if (typeof titleObject === 'object') {
		return titleObject[locale.value] || titleObject.en || titleObject.fr || '';
	}

	return '';
};

const getItemClass = (index) => {
	if (!homeData.value?.items) return '';

	const totalItems = homeData.value.items.length;
	const relativeIndex = (index - currentIndex.value + totalItems) % totalItems;

	return classes[Math.min(relativeIndex, classes.length - 1)];
};

// Fonction pour contrôler les vidéos
const controlVideos = () => {
	if (!homeData.value?.items) return;

	videoRefs.value.forEach((video, index) => {
		if (video) {
			const totalItems = homeData.value.items.length;
			const relativeIndex = (index - currentIndex.value + totalItems) % totalItems;
			const currentClass = classes[Math.min(relativeIndex, classes.length - 1)];
			const isActive = currentClass.includes('active');

			if (isActive) {
				// Vidéo active : la jouer
				video.play().catch(console.error);
			} else {
				// Vidéo non-active : la mettre en pause et remettre le compteur à 0
				video.pause();
				video.currentTime = 0;
			}
		}
	});
};

const animateWithFLIP = async (direction) => {
	if (isAnimating.value || !homeData.value?.items) return;

	isAnimating.value = true;
	const totalItems = homeData.value.items.length;

	const state = Flip.getState(wrapperItemRefs.value);

	if (direction === 'next') {
		currentIndex.value = (currentIndex.value + 1) % totalItems;
	} else {
		currentIndex.value = (currentIndex.value - 1 + totalItems) % totalItems;
	}

	await nextTick();

	// Animer avec GSAP Flip
	Flip.from(state, {
		duration: 1,
		ease: 'power3.inOut',
		absolute: true,
		onComplete: () => {
			isAnimating.value = false;
		},
	});

	// Contrôler les vidéos après l'animation
	await nextTick();
	controlVideos();
};

// Gestion des événements clavier
const handleKeydown = (event) => {
	if (event.key === 'ArrowLeft') {
		event.preventDefault();
		animateWithFLIP('prev');
	} else if (event.key === 'ArrowRight') {
		event.preventDefault();
		animateWithFLIP('next');
	}
};

let scrollTimeout;
const handleWheel = (event) => {
	event.preventDefault();

	clearTimeout(scrollTimeout);
	scrollTimeout = setTimeout(() => {
		if (event.deltaY > 0) {
			animateWithFLIP('next');
		} else if (event.deltaY < 0) {
			animateWithFLIP('prev');
		}
	}, 50);
};

const loadHomeData = async () => {
	loadingHome.value = true;
	errorHome.value = null;
	try {
		homeData.value = await useSanityHome();
	} catch (err) {
		errorHome.value = err.message;
		console.error('Home page error:', err);
	} finally {
		loadingHome.value = false;
	}
};

onMounted(async () => {
	try {
		await loadHomeData();
		await nextTick();

		controlVideos();

		window.addEventListener('keydown', handleKeydown);
		window.addEventListener('wheel', handleWheel, { passive: false });
	} catch (err) {
		errorHome.value = err;
	}
});

onUnmounted(() => {
	window.removeEventListener('keydown', handleKeydown);
	window.removeEventListener('wheel', handleWheel);
	clearTimeout(scrollTimeout);
});
</script>

<style scoped lang="scss">
.home-page {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100vh;
	overflow: hidden;

	.container-wrapper {
		position: relative;
		width: 100vw;
		height: 100dvh;

		@include tablet {
			height: 50vh;
		}

		.item {
			position: absolute;
			display: flex;
			flex-direction: column;
			width: 100%;

			@include tablet {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				transform: translate3d(0, 0, 0);
			}

			&.display-none {
				display: none;
			}

			&.display-none-desktop {
				@include tablet {
					display: none;
				}
			}

			&.desktop-absolute {
				@include tablet {
					position: absolute;
					top: 0;
					width: calc(100% * 1 / 6 - 8rem);

					&.left {
						left: -16rem;
						transform: translate3d(-100%, 0, 0);
					}

					&.right {
						left: auto;
						right: -16rem;
						transform: translate3d(100%, 0, 0);
					}
				}
			}

			&.absolute-first-mobile {
				@include mobile-only {
					position: absolute;
					top: 8rem;
					left: 0;
					height: calc(100dvh * 15 / 100 - 8rem);
				}
			}

			&.absolute-second-mobile {
				@include mobile-only {
					position: absolute;
					top: calc(100dvh * 15 / 100 + 8rem);
					left: 0;
					height: calc(100dvh * 20 / 100 - 8rem);
				}
			}

			&.absolute-third-mobile {
				@include mobile-only {
					position: absolute;
					top: calc(100dvh * 35 / 100 + 8rem);
					left: 0;
					height: calc(100dvh * 30 / 100 - 8rem);
				}
			}

			&.absolute-fourth-mobile {
				@include mobile-only {
					position: absolute;
					top: calc(100dvh * 65 / 100 + 8rem);
					left: 0;
					height: calc(100dvh * 20 / 100 - 8rem);
				}
			}

			&.absolute-fifth-mobile {
				@include mobile-only {
					position: absolute;
					top: calc(100dvh * 85 / 100 + 8rem);
					left: 0;
					height: calc(100dvh * 15 / 100 - 16rem);
				}
			}

			&.absolute {
				position: absolute;
				top: 0;
				width: 161rem;

				@include tablet {
					width: calc(100% * 1 / 6 - 8rem);
				}

				&.left {
					top: -8rem;
					transform: translate3d(0, -100%, 0);

					@include tablet {
						left: -16rem;
						transform: translate3d(-100%, 0, 0);
					}
				}

				&.right {
					bottom: -8rem;
					top: auto;
					transform: translate3d(0, 100%, 0);

					@include tablet {
						left: auto;
						right: -16rem;
						transform: translate3d(100%, 0, 0);
					}
				}
			}

			.wrapper-item {
				width: 100%;
				height: 100%;

				@include mobile-only {
					height: 100%;
				}

				@include tablet {
					margin-top: 0;
				}

				.video-container {
					display: block;
					position: relative;
					width: 100%;

					@include mobile-only {
						height: 100%;
					}

					@include tablet {
						aspect-ratio: 413 / 212;
					}

					.video-thumbnail {
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						transition: opacity 0.6s linear;

						&.fade-out {
							opacity: 0;
						}

						img {
							width: 101%;
							height: 101%;
							object-fit: cover;
						}
					}

					video {
						width: 100%;
						height: 100%;
						object-fit: cover;
					}
				}
			}

			.mobile-hiden {
				display: none;
				opacity: 0;
				transition: opacity 0.7s linear;

				@include tablet {
					display: block;
				}

				&.active {
					opacity: 1;
				}

				.legend-container {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: 6rem;

					.index,
					.subtitle {
						@include switzer(600, normal);
						font-size: 10rem;
						text-transform: uppercase;
						color: $black;
					}
				}

				.title {
					margin-top: 60rem;
					@include switzer(600, normal);
					font-size: 12rem;
					text-transform: uppercase;
					color: $black;
				}

				.description {
					margin-top: 40rem;
					@include switzer(500, normal);
					font-size: 12rem;
					color: $black;
					max-width: 330rem;
					opacity: 0.3;
				}

				.link {
					display: block;
					position: relative;
					margin-top: 50rem;
					width: fit-content;
					@include switzer(600, normal);
					font-size: 12rem;
					color: $black;
					padding-bottom: 2rem;

					&::after {
						content: '';
						position: absolute;
						bottom: 0;
						left: 0;
						width: 100%;
						height: 1px;
						background-color: $black;
					}

					&:hover {
						&::after {
							transform: scale3d(1, 1, 1);
							transform-origin: left center;
						}
					}
				}
			}
		}
	}
}
</style>
