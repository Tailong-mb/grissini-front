<template>
	<div class="hub-video" :class="{ open: open }">
		<!-- Background videos wrapper -->
		<div class="background-wrapper">
			<div v-for="(item, index) in items" :key="item._key" class="video-background" :class="{ hover: hoverItem === index }">
				<video
					v-if="getVideoUrl(item)"
					:ref="
						(el) => {
							if (el) videoRefs[index] = el;
						}
					"
					:src="getVideoUrl(item)"
					loop
					playsinline
					preload="metadata"
				></video>
			</div>
		</div>

		<!-- Thumbnails container -->
		<div class="container thumbnails-container">
			<div v-for="(item, index) in items" :key="item._key" class="thumbnail-item" :class="{ open: open, about: type === 'about' }" @mouseenter="handleMouseEnter(index)" @mouseleave="handleMouseLeave()">
				<img :src="getThumbnailUrl(item)" :alt="item.title" class="thumbnail-image" :class="{ hover: hoverItem === index || hoverItem === null }" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps({
	items: {
		type: Array,
		required: true,
		default: () => [],
	},
	type: {
		type: String,
		required: true,
		default: 'hub',
	},
	open: {
		type: Boolean,
		required: true,
		default: false,
	},
});

const hoverItem = ref(null);
const videoRefs = ref({});
const isDesktop = ref(false);

// Get appropriate thumbnail URL based on device
const getThumbnailUrl = (item) => {
	if (!item) return '';

	// Check if we're on mobile or desktop
	if (isDesktop.value && item.thumbnailDesktop?.asset?.url) {
		return item.thumbnailDesktop.asset.url;
	} else if (item.thumbnailMobile?.asset?.url) {
		return item.thumbnailMobile.asset.url;
	}

	// Fallback to desktop thumbnail if mobile not available
	return item.thumbnailDesktop?.asset?.url || '';
};

// Get appropriate video URL based on device
const getVideoUrl = (item) => {
	if (!item) return '';

	// Check if we're on mobile or desktop
	if (isDesktop.value && item.videoDesktop?.asset?.url) {
		return item.videoDesktop.asset.url;
	} else if (item.videoMobile?.asset?.url) {
		return item.videoMobile.asset.url;
	}

	// Fallback to desktop video if mobile not available
	return item.videoDesktop?.asset?.url || '';
};

const handleMouseEnter = (index) => {
	hoverItem.value = index;

	// Play video when hovering
	const video = videoRefs.value[index];
	if (video) {
		video.currentTime = 0; // Reset to beginning
		video.play().catch((error) => {
			console.warn('Video play failed:', error);
		});
	}
};

const handleMouseLeave = () => {
	hoverItem.value = null;

	// Pause all videos when leaving
	Object.values(videoRefs.value).forEach((video) => {
		if (video && !video.paused) {
			video.pause();
		}
	});
};

const handleResize = () => {
	// Check for tablet/desktop breakpoint (1024px)
	isDesktop.value = window.matchMedia('(min-width: 1024px)').matches;
};

onMounted(async () => {
	await nextTick();

	if (process.client) {
		window.addEventListener('resize', handleResize);
		handleResize();
	}
});

onUnmounted(() => {
	if (process.client) {
		window.removeEventListener('resize', handleResize);
	}

	// Clean up videos
	Object.values(videoRefs.value).forEach((video) => {
		if (video) {
			video.pause();
			video.src = '';
		}
	});
});
</script>

<style lang="scss" scoped>
.hub-video {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	min-height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	pointer-events: none;

	&.open {
		pointer-events: all;
	}

	.background-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		overflow: hidden;

		.video-background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			opacity: 0;
			transition: opacity 0.7s $immg-zoomOut;

			&.hover {
				opacity: 1;

				video {
					transform: scale3d(1, 1, 1);
				}
			}

			video {
				width: 100%;
				height: 100%;
				object-fit: cover;
				transform: scale3d(1.03, 1.03, 1.03);
				transition: transform 0.7s $immg-zoomOut;
			}
		}
	}

	.thumbnails-container {
		display: flex;
		justify-content: center;
		position: relative;
		gap: 8rem;

		.thumbnail-item {
			overflow: hidden;
			width: 110rem;
			height: 65rem;
			border: solid 1px rgb($white, 0.3);
			opacity: 0;
			transition: opacity 0.7s linear;

			&.about {
				width: 111rem;
				height: 145rem;
			}

			&:nth-child(1) {
				transition-delay: 0.1s;
			}
			&:nth-child(2) {
				transition-delay: 0.2s;
			}
			&:nth-child(3) {
				transition-delay: 0.3s;
			}
			&:nth-child(4) {
				transition-delay: 0.4s;
			}
			&:nth-child(5) {
				transition-delay: 0.5s;
			}
			&:nth-child(6) {
				transition-delay: 0.6s;
			}
			&:nth-child(7) {
				transition-delay: 0.7s;
			}
			&:nth-child(8) {
				transition-delay: 0.8s;
			}

			&.open {
				opacity: 1;
			}

			.thumbnail-image {
				width: 100%;
				height: 100%;
				object-fit: cover;
				transition:
					transform 0.7s $immg-zoomOut,
					opacity 0.4s linear;
				opacity: 0;

				&.hover {
					opacity: 1;
				}
			}

			&:hover {
				.thumbnail-image {
					transform: scale3d(1.05, 1.05, 1.05);
					opacity: 1;
				}
			}
		}
	}
}
</style>
