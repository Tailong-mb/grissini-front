<template>
	<div v-if="!pageData">
		<Loader />
	</div>
	<div v-else class="legal-page container" ref="animationContainer">
		<div class="legal-page__content col-start-1 col-end-6 tb:col-start-3 tb:col-end-11">
			<h1 class="legal-page__title" data-animation="fadeIn">{{ pageData?.title || 'Mentions légales' }}</h1>
			<div class="legal-page__body" data-animation="fade" data-animation-delay="0.2">
				<PortableTextContent :value="pageData?.content || []" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useSanityMentionsLegales } from '@/composables/useSanityMentionsLegales';
import { useI18n } from 'vue-i18n';
import PortableTextContent from '@/components/PortableTextContent.vue';
import { useAnimations } from '@/composables/useAnimations';

const { animationContainer } = useAnimations();

const { locale } = useI18n();
const { data: mentionsData } = await useSanityMentionsLegales(locale);

useSeo(() => ({ seo: mentionsData.value?.seo, title: mentionsData.value?.title || 'Legal notice' }));

const pageData = computed(() => {
	if (!mentionsData.value) return null;
	return {
		title: mentionsData.value.title || 'Mentions légales',
		content: mentionsData.value.content || [],
		seo: mentionsData.value.seo,
	};
});
</script>

<style lang="scss" scoped>
.legal-page {
	padding: 30vh 0 80rem;

	&__content {
		max-width: 720rem;
	}

	&__title {
		@include ppeditorial(200, normal);
		font-size: 48rem;
		color: $black;

		@include tablet {
			font-size: 65rem;
		}

		@include desktop {
			font-size: 80rem;
		}
	}

	&__body {
		margin-top: 40rem;

		@include tablet {
			margin-top: 60rem;
		}
	}
}
</style>
