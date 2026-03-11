<template>
	<div v-if="!pageData">
		<Loader />
	</div>
	<div v-else class="legal-page container">
		<div class="legal-page__content col-start-1 col-end-6 tb:col-start-3 tb:col-end-11">
			<h1 class="legal-page__title">{{ pageData?.title || 'Mentions légales' }}</h1>
			<div class="legal-page__body">
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

const { locale } = useI18n();
const mentionsData = ref(null);

const pageData = computed(() => {
	if (!mentionsData.value) return null;
	return {
		title: mentionsData.value.title || 'Mentions légales',
		content: mentionsData.value.content || [],
		seo: mentionsData.value.seo,
	};
});

const loadData = async () => {
	try {
		mentionsData.value = await useSanityMentionsLegales(locale.value);
	} catch (err) {
		console.error('Mentions légales page error:', err);
	}
};

onMounted(() => {
	loadData();
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
