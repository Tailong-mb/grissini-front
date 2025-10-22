<template>
	<div class="home-page">
		<div class="container-wrapper container" ref="containerWrapperRef">
			<div v-for="(item, index) in homeData?.items" :key="`${item._key}-${index}`" class="item" :class="classes[Math.min(index, classes.length - 1)]" ref="itemRefs">
				<div class="wrapper-item" ref="wrapperItemRefs">
					<div class="video-container">
						<div class="video-thumbnail">
							<img v-if="item.thumbnail?.url" :src="item.thumbnail.url" :alt="getLocalizedTitle(item.title)" />
						</div>
						<video v-if="item.video?.url" ref="videoRefs" class="video-element" :poster="item.thumbnail?.url" loop playsinline webkit-playsinline>
							<source :src="item.video.url" type="video/mp4" />
						</video>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useSanityHome } from '@/composables/useSanityHome';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const homeData = ref(null);
const loadingHome = ref(false);
const errorHome = ref(null);
const classes = [
	'absolute left',
	'col-start-1 col-end-4 tb:col-start-1 tb:col-end-3',
	'col-start-1 col-end-5 tb:col-start-3 tb:col-end-6',
	'col-start-1 col-end-6 tb:col-start-6 tb:col-end-10',
	'col-start-1 col-end-5 tb:col-start-10 tb:col-end-13',
	'col-start-1 col-end-4 desktop-absolute right',
	'absolute right',
];

const itemRefs = ref([]);
const videoRefs = ref([]);
const wrapperItemRefs = ref([]);

const getLocalizedTitle = (titleObject) => {
	if (!titleObject) return '';

	if (typeof titleObject === 'string') return titleObject;

	if (typeof titleObject === 'object') {
		return titleObject[locale.value] || titleObject.en || titleObject.fr || '';
	}

	return '';
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
	} catch (err) {
		errorHome.value = err;
	}
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
		.item {
			position: relative;
			display: flex;
			flex-direction: column;

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
						right: -16rem;
						transform: translate3d(100%, 0, 0);
					}
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
					transform: translate3d(0, -100%, 0);

					@include tablet {
						left: -16rem;
						transform: translate3d(-100%, 0, 0);
					}
				}

				&.right {
					bottom: 0;
					top: auto;
					transform: translate3d(0, 100%, 0);

					@include tablet {
						right: -16rem;
						transform: translate3d(100%, 0, 0);
					}
				}
			}

			.wrapper-item {
				width: 100%;
				margin-top: 8rem;

				@include tablet {
					margin-top: 0;
				}

				.video-container {
					position: relative;
					width: 100%;
					aspect-ratio: 413 / 217;

					.video-thumbnail {
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;

						img {
							width: 100%;
							height: 100%;
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
		}
	}
}
</style>
