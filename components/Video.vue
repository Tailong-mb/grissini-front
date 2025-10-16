<template>
	<div class="video-container" :class="{ playing: isPlaying }">
		<!-- Thumbnail -->
		<div class="video-thumbnail" :class="{ hidden: isPlaying || isActive }">
			<picture>
				<source :srcset="thumbnailMobile" media="(max-width: 768px)" />
				<img :src="thumbnailDesktop" :alt="alt" />
			</picture>
		</div>

		<!-- Video -->
		<video ref="videoRef" class="video-element" :class="{ playing: isPlaying || isActive, visible: isActive }" :poster="thumbnailDesktop" @click="togglePlay" @ended="onVideoEnded" muted playsinline webkit-playsinline loop>
			<source :src="videoMobile" media="(max-width: 768px)" type="video/mp4" />
			<source :src="videoDesktop" type="video/mp4" />
			Votre navigateur ne supporte pas la lecture vidéo.
		</video>

		<a v-if="linkUrl" :href="linkUrl" class="video-link" target="_blank" rel="noopener noreferrer">
			{{ linkText }}
		</a>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, readonly } from 'vue';
const props = defineProps({
	// Thumbnails
	thumbnailMobile: {
		type: String,
		required: true,
	},
	thumbnailDesktop: {
		type: String,
		required: true,
	},
	// Videos
	videoMobile: {
		type: String,
		required: true,
	},
	videoDesktop: {
		type: String,
		required: true,
	},
	// Accessibility
	alt: {
		type: String,
		default: 'Video thumbnail',
	},
	// Auto play
	autoplay: {
		type: Boolean,
		default: false,
	},
	// Active state (for external control)
	isActive: {
		type: Boolean,
		default: false,
	},

	linkUrl: {
		type: String,
		default: '',
	},
	linkText: {
		type: String,
		default: '',
	},
});

const emit = defineEmits(['play', 'pause', 'ended']);

const videoRef = ref(null);
const isPlaying = ref(false);
const isMobile = ref(false);

const togglePlay = () => {
	if (isPlaying.value) {
		pauseVideo();
	} else {
		playVideo();
	}
};

const playVideo = async () => {
	if (!videoRef.value) return;

	try {
		await videoRef.value.play();
		isPlaying.value = true;
		emit('play');
	} catch (error) {
		console.error('Error playing video:', error);
		// On mobile, if autoplay fails, we still want to show the video
		// The play overlay will handle manual play
	}
};

const pauseVideo = () => {
	if (!videoRef.value) return;

	videoRef.value.pause();
	isPlaying.value = false;
	emit('pause');
};

const onVideoEnded = () => {
	isPlaying.value = false;
	emit('ended');
};

watch(
	() => props.isActive,
	(newActive) => {
		if (newActive) {
			if (videoRef.value) {
				videoRef.value.currentTime = 0.1;
			}
			playVideo().catch(() => {
				console.warn('Autoplay failed');
			});
		} else {
			pauseVideo();
		}
	},
	{ immediate: true }
);

// Auto play if specified
onMounted(() => {
	// Detect mobile
	isMobile.value = window.innerWidth <= 768;

	if (props.autoplay || props.isActive) {
		playVideo().catch(() => {
			console.warn('Autoplay failed on mount');
		});
	}
});

onUnmounted(() => {
	if (videoRef.value) {
		videoRef.value.pause();
	}
});

defineExpose({
	play: playVideo,
	pause: pauseVideo,
	toggle: togglePlay,
	isPlaying: readonly(isPlaying),
});
</script>

<style lang="scss" scoped>
.video-container {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
	background-color: $black;
	opacity: 0;
	transition: opacity 0.3s linear;

	&.playing {
		opacity: 1;
	}

	@include desktop {
		opacity: 1;
	}

	.video-thumbnail {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 2;
		transition: opacity 0.7s linear;
		opacity: 0;

		@include desktop {
			opacity: 1;
		}

		&.hidden {
			opacity: 0;
			pointer-events: none;
		}

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.video-element {
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0;
		transition: opacity 0.7s linear;

		// Show video when it's active (both mobile and desktop)
		&.visible {
			opacity: 1;
		}
	}

	.video-link {
		position: absolute;
		bottom: 32rem;
		left: 50%;
		transform: translateX(-50%);
		font-size: 12rem;
		@include switzer(600, normal);
		color: $black;
		text-transform: uppercase;
		background-color: $white;
		padding: 16rem 37rem;
		width: fit-content;
		border: solid 1px $white;
		margin: 60rem auto 0 auto;
		transition: opacity 0.3s linear;
		opacity: 0.8;

		&:hover {
			opacity: 1;
		}

		@include desktop {
			bottom: 17rem;
			right: 17rem;
			left: auto;
			transform: translateX(0);
		}
	}
}
</style>
