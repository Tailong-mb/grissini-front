<template>
	<div class="lives-page">
		<div class="background-wrapper">
			<div v-for="(album, index) in albums" :key="album.id" class="album-image" :class="{ hover: hoverAlbum === index }" :ref="albumImageRefs">
				<img :src="album.imageUrl" :alt="album.title" />
			</div>
		</div>
		<div class="container album-container">
			<a v-for="(album, index) in albums" :key="album.id" class="col-start-1 col-end-6 album-item" :class="[classes[index % classes.length]]" :ref="albumRefs" :href="album.link" target="_blank" rel="noopener noreferrer" @mouseenter="hoverAlbum = index" @mouseleave="hoverAlbum = null">
				<ScrambleText
					:ref="
						(el) => {
							if (el) scrambleTextRefs[index] = el;
						}
					"
					:title="album.title"
					:subtext="album.subtext"
					:number="album.time"
					:hover="true"
					:to="album.link"
				/>
				<div class="image-wrapper">
					<div
						class="image-subwrapper"
						:ref="
							(el) => {
								if (el) imageWrapperRefs[index] = el;
							}
						"
					>
						<img :src="album.imageUrl" :alt="album.title" />
					</div>
				</div>
			</a>
		</div>
	</div>
</template>

<script setup>
import { onMounted, onUnmounted, nextTick, ref } from 'vue';
import transitionConfig from '@/helpers/transitionConfig';
import { gsap } from 'gsap';

definePageMeta({
	transition: transitionConfig,
});

const classes = ['tb:col-start-2 tb:col-end-4 dk:col-start-2 dk:col-end-4', ' tb:col-start-6 tb:col-end-8 dk:col-start-6 dk:col-end-8', ' tb:col-start-10 tb:col-end-12 dk:col-start-10 dk:col-end-12'];

const { $lenis } = useNuxtApp();

const albums = ref(null);
const albumImageRefs = ref([]);
const imageWrapperRefs = ref({});
const albumRefs = ref([]);
const scrambleTextRefs = ref({});
const hoverAlbum = ref(null);
const scrollTriggers = ref([]);

const formatEventDate = (dateString) => {
	const isoLike = dateString?.replace(' ', 'T');
	const d = isoLike ? new Date(isoLike) : null;
	if (!d || isNaN(d.getTime())) return '';
	const dd = String(d.getDate()).padStart(2, '0');
	const mm = String(d.getMonth() + 1).padStart(2, '0');
	const yyyy = d.getFullYear();
	return `${dd}/${mm}/${yyyy}`;
};

const createParallax = () => {
	Object.keys(imageWrapperRefs.value).forEach((index) => {
		const imageWrapper = imageWrapperRefs.value[index];

		if (imageWrapper) {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: imageWrapper,
					start: 'top bottom',
					end: 'bottom top',
					scrub: true,
				},
			});

			tl.fromTo(
				imageWrapper,
				{
					yPercent: -7.5,
				},
				{
					yPercent: 7.5,
					duration: 1,
					ease: 'linear',
				}
			);
			scrollTriggers.value.push(tl);
		}
	});
};

onMounted(async () => {
	try {
		albums.value = [];

		const now = new Date();
		const start = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} 00:00:00`;
		const endDate = new Date(now);
		endDate.setFullYear(now.getFullYear() + 2);
		const end = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')} 23:59:59`;

		const restUrl = `https://www.grandes-scenes.com/wp-json/tribe/events/v1/events/?page=1&per_page=50&start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}&status=publish`;
		const response = await $fetch(restUrl);

		const mapEventToItem = (ev) => {
			const hour = ev.start_date_details?.hour ?? '';
			const minutes = ev.start_date_details?.minutes ?? '';
			const time = hour && minutes ? `${hour.padStart(2, '0')}:${minutes.padStart(2, '0')}` : '';
			const venue = ev.venue?.venue || ev.venue?.city || '';
			const formattedDate = formatEventDate(ev.start_date);
			const primaryCategory = ev.categories && ev.categories.length > 0 ? ev.categories[0].name : ev.venue?.city || '';
			return {
				id: ev.id,
				title: ev.title,
				subtext: venue,
				time: formattedDate,
				imageUrl: ev.image?.url || '',
				link: ev.website || ev.url || '#',
				tag: primaryCategory,
			};
		};

		albums.value = (response?.events || []).map(mapEventToItem);

		setTimeout(() => {
			createParallax();
		}, 100);
	} catch (error) {
		console.error('Erreur lors du chargement des albums:', error);
	}

	await nextTick();

	const tl = gsap.timeline();

	tl.from(Object.values(imageWrapperRefs.value), {
		opacity: 0,
		duration: 1,
		ease: 'linear',
		stagger: 0.1,
	});

	// tag animations removed
});

onUnmounted(() => {
	scrollTriggers.value.forEach((trigger) => {
		trigger.kill();
	});
});
</script>

<style lang="scss" scoped>
.lives-page {
	position: relative;
	min-height: 100vh;
	width: 100%;
	display: flex;
	align-items: center;
	padding: 150px 0;

	@include tablet {
		padding: 0;
	}

	.background-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		overflow: hidden;

		.album-image {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			opacity: 0;
			transition: opacity 0.7s $immg-zoomOut;

			&.hover {
				opacity: 1;

				img {
					transform: scale3d(1, 1, 1);
				}
			}

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				transform: scale3d(1.03, 1.03, 1.03);
				transition: transform 0.7s $immg-zoomOut;
			}
		}
	}

	.album-container {
		grid-row-gap: 64rem;

		.image-wrapper {
			margin-top: 8rem;
			width: 100%;
			overflow: hidden;

			@include tablet {
				margin-top: 0;
				display: none;
			}

			.image-subwrapper {
				width: 100%;
				overflow: hidden;
				aspect-ratio: 4 / 3;
				position: relative;

				img {
					position: absolute;
					top: -7.5%;
					left: 0;
					width: 100%;
					height: 115%;
					object-fit: cover;
				}
			}
		}
	}

	// tag containers removed
}
</style>
