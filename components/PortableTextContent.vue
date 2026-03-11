<template>
	<div v-if="value?.length" class="portable-text-content">
		<PortableText :value="value" :components="components" />
	</div>
</template>

<script setup>
import { h } from 'vue';
import { PortableText } from '@portabletext/vue';

const props = defineProps({
	value: {
		type: Array,
		default: () => [],
	},
});

const components = {
	block: {
		normal: (_, { slots }) => h('p', { class: 'portable-text__paragraph' }, slots.default?.()),
		h1: (_, { slots }) => h('h2', { class: 'portable-text__h2' }, slots.default?.()),
		h2: (_, { slots }) => h('h3', { class: 'portable-text__h3' }, slots.default?.()),
	},
	list: {
		bullet: (_, { slots }) => h('ul', { class: 'portable-text__list' }, slots.default?.()),
		number: (_, { slots }) => h('ol', { class: 'portable-text__list portable-text__list--ordered' }, slots.default?.()),
	},
	listItem: {
		bullet: (_, { slots }) => h('li', { class: 'portable-text__list-item' }, slots.default?.()),
		number: (_, { slots }) => h('li', { class: 'portable-text__list-item' }, slots.default?.()),
	},
	marks: {
		strong: (_, { slots }) => h('strong', { class: 'portable-text__strong' }, slots.default?.()),
		em: (_, { slots }) => h('em', { class: 'portable-text__em' }, slots.default?.()),
		linkExternal: ({ value }, { slots }) => {
			const href = value?.url || '#';
			return h('a', { href, target: '_blank', rel: 'noopener noreferrer', class: 'portable-text__link' }, slots.default?.());
		},
		linkInternal: ({ value }, { slots }) => {
			const href = value?.url || (value?.slug ? `/${value.slug}` : '#');
			return h('a', { href, class: 'portable-text__link' }, slots.default?.());
		},
		linkEmail: ({ value }, { slots }) => {
			const href = value?.email ? `mailto:${value.email}` : '#';
			return h('a', { href, class: 'portable-text__link' }, slots.default?.());
		},
	},
};
</script>

<style lang="scss">
.portable-text-content {
	.portable-text__paragraph {
		@include switzer(500, normal);
		font-size: 12rem;
		line-height: 1.6;
		color: $black;
		opacity: 0.8;
		margin-bottom: 20rem;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.portable-text__h2 {
		@include switzer(600, normal);
		font-size: 14rem;
		text-transform: uppercase;
		color: $black;
		margin-top: 40rem;
		margin-bottom: 16rem;

		&:first-child {
			margin-top: 0;
		}
	}

	.portable-text__h3 {
		@include switzer(600, normal);
		font-size: 12rem;
		text-transform: uppercase;
		color: $black;
		opacity: 0.9;
		margin-top: 32rem;
		margin-bottom: 12rem;
	}

	.portable-text__list {
		margin: 16rem 0;
		padding-left: 24rem;
	}

	.portable-text__list--ordered {
		list-style: decimal;
	}

	.portable-text__list-item {
		@include switzer(500, normal);
		font-size: 12rem;
		line-height: 1.6;
		color: $black;
		opacity: 0.8;
		margin-bottom: 8rem;
	}

	.portable-text__strong {
		font-weight: 600;
	}

	.portable-text__em {
		font-style: italic;
	}

	.portable-text__link {
		color: $black;
		text-decoration: underline;
		text-underline-offset: 2rem;

		&:hover {
			opacity: 0.7;
		}
	}
}
</style>
