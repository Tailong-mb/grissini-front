<template>
	<div class="video-container" :class="{ playing: isPlaying }">
		<!-- Thumbnail -->
		<div class="video-thumbnail" :class="{ hidden: isPlaying }">
			<picture>
				<source :srcset="thumbnailMobile" media="(max-width: 768px)" />
				<img :src="thumbnailDesktop" :alt="alt" />
			</picture>
		</div>

		<!-- Video -->
		<video ref="videoRef" class="video-element" :class="{ playing: isPlaying }" :poster="thumbnailDesktop" @click="togglePlay" @ended="onVideoEnded">
			<source :src="videoMobile" media="(max-width: 768px)" type="video/mp4" />
			<source :src="videoDesktop" type="video/mp4" />
			Votre navigateur ne supporte pas la lecture vidéo.
		</video>
	</div>
</template>

<script setup>
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
});

const emit = defineEmits(['play', 'pause', 'ended']);

const videoRef = ref(null);
const isPlaying = ref(false);

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

// Auto play if specified
onMounted(() => {
	if (props.autoplay) {
		playVideo();
	}
});

// Cleanup on unmount
onUnmounted(() => {
	if (videoRef.value) {
		videoRef.value.pause();
	}
});

// Expose methods for parent components
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

	.video-thumbnail {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 2;
		transition: opacity 0.3s linear;

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
		transition: opacity 0.3s linear;

		&.playing {
			opacity: 1;
		}
	}
}
</style>
