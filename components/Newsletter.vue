<template>
	<div class="newsletter-popin container" :class="{ active: isOpen }">
		<div class="newsletter-popin__left tb:col-start-1 tb:col-end-8" :class="{ active: isOpen }" @click="closeNewsletter"></div>
		<div class="newsletter-popin__right col-start-1 col-end-6 tb:col-start-8 tb:col-end-13">
			<button class="newsletter-popin__right__close" :class="{ active: isOpen }" @click="closeNewsletter">
				{{ data?.menuClose }}
			</button>
			<h2 :class="{ active: isOpen }">{{ data?.newsletterText }}</h2>
			<p :class="{ active: isOpen }">{{ data?.descriptionNewsletter }}</p>
			<form :class="{ active: isOpen, email: email.length > 0 }" @submit.prevent="handleSubmit">
				<input type="email" :placeholder="data?.emailLabel" v-model="email" :disabled="isSubmitting" required />
				<button type="submit" :disabled="isSubmitting">
					<ArrowRight />
				</button>
			</form>
			<div v-if="submitMessage" class="newsletter-popin__right__message" :class="{ active: isOpen, success: isSuccess, error: !isSuccess }">
				{{ submitMessage }}
			</div>
			<div class="newsletter-popin__social-links" :class="{ active: isOpen }">
				<a v-for="link in data?.socialLinks" :key="link.url" :href="link.url" target="_blank">
					{{ link.linkText }}
				</a>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import ArrowRight from '@/components/svg/ArrowRight.vue';
import { getLocalizedText } from '@/utils/translate';

const { locale } = useI18n();
const { isOpen, closeNewsletter } = useNewsletter();
const rawData = ref(null);
const email = ref('');
const isSubmitting = ref(false);
const submitMessage = ref('');
const isSuccess = ref(false);

const data = computed(() => {
	if (!rawData.value) return null;

	return {
		newsletterText: getLocalizedText(rawData.value.menu?.newsletterText, locale.value),
		descriptionNewsletter: getLocalizedText(rawData.value.menu?.descriptionNewsletter, locale.value),
		contactText: getLocalizedText(rawData.value.menu?.contactText, locale.value),
		mail: rawData.value.menu?.mail,
		emailLabel: getLocalizedText(rawData.value.menu?.emailLabel, locale.value),
		socialLinks: (rawData.value.socialMedia?.socialLinks || []).map((link) => ({
			...link,
			linkText: getLocalizedText(link.linkText, locale.value),
		})),
		menuClose: getLocalizedText(rawData.value.menu?.menuClose, locale.value),
	};
});

const handleSubmit = async () => {
	if (!email.value || isSubmitting.value) return;

	isSubmitting.value = true;
	submitMessage.value = '';
	isSuccess.value = false;

	try {
		const response = await $fetch('/api/newsletter', {
			method: 'POST',
			body: {
				email: email.value,
			},
		});

		isSuccess.value = true;
		submitMessage.value = 'Successfully subscribed!';
		email.value = '';

		// Clear success message after 3 seconds
		setTimeout(() => {
			submitMessage.value = '';
		}, 3000);
	} catch (error: any) {
		isSuccess.value = false;

		// Handle different error types
		if (error.statusCode === 409) {
			submitMessage.value = 'This email is already subscribed.';
		} else if (error.statusCode === 400) {
			submitMessage.value = 'Please enter a valid email address.';
		} else {
			submitMessage.value = error.message || 'An error occurred. Please try again.';
		}

		// Clear error message after 5 seconds
		setTimeout(() => {
			submitMessage.value = '';
		}, 5000);
	} finally {
		isSubmitting.value = false;
	}
};

const loadNewsletterData = async () => {
	try {
		rawData.value = await useSanityMenu();
	} catch (err) {
		console.error('Newsletter loading error:', err);
	}
};

onMounted(async () => {
	await loadNewsletterData();
});
</script>

<style lang="scss" scoped>
.newsletter-popin {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100dvh;
	z-index: 150;
	margin: 0;
	transform: translate3d(100%, 0, 0);
	transition: transform 2s $out-cubic;
	column-gap: 0;

	&.active {
		transform: translate3d(0, 0, 0);
		transition: transform 1.2s $out-cubic;
	}

	&__left {
		display: none;

		@include tablet {
			display: block;
			height: 100%;
			background-color: $black;
			opacity: 0;

			&.active {
				opacity: 0.06;
				transition: 1.3s opacity 0.5s linear;
			}
		}
	}

	&__right {
		position: relative;
		background-color: $white;
		padding: 0 8rem;
		height: 100%;

		@include tablet {
			padding: 0 118rem;
		}

		&__close {
			position: absolute;
			top: 8rem;
			right: 8rem;
			background: none;
			border: none;
			padding: 0;
			margin: 0;
			cursor: pointer;
			color: $black;
			font-size: 12rem;
			text-transform: uppercase;
			transition: opacity 0.3s linear;
			@include switzer(600, normal);
			opacity: 0;

			&.active {
				opacity: 1;
			}

			&:hover {
				opacity: 0.7;
			}
		}

		h2 {
			@include switzer(600, normal);
			color: $black;
			text-transform: uppercase;
			font-size: 12rem;
			margin-top: 120rem;
			transition: opacity 0.2s linear;
			opacity: 0;

			&.active {
				opacity: 1;
				transition: 1.2s opacity 0.5s linear;
			}
		}

		p {
			@include switzer(500, normal);
			color: $black;
			font-size: 12rem;
			opacity: 0;
			margin-top: 40rem;
			transition: opacity 0.2s linear;

			&.active {
				opacity: 0.34;
				transition: 1.3s opacity 0.5s linear;
			}
		}

		form {
			position: relative;
			margin-top: 40rem;
			padding: 0 0 16rem 0;
			transition: opacity 0.2s linear;
			opacity: 0;

			&.active {
				opacity: 1;
				transition: 1.4s opacity 0.5s linear;
			}

			&.email {
				&:after {
					transform: scale3d(1, 1, 1);
				}
			}

			&:before {
				content: '';
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				height: 1px;
				background-color: $black;
				opacity: 0.34;
			}

			&:after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				height: 1px;
				background-color: $black;
				transform: scale3d(0, 1, 1);
				transform-origin: left center;
				transition: transform 0.5s $in-out-cubic;
			}

			input {
				width: 100%;
				@include switzer(500, normal);
				color: $black;
				font-size: 12rem;
				text-transform: uppercase;
				border: none;
				background: none;

				&:disabled {
					opacity: 0.5;
					cursor: not-allowed;
				}

				&:focus {
					outline: none;
				}
			}

			button {
				position: absolute;
				right: 0;
				top: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 20rem;
				height: 20rem;
				background-color: $black;
				border: none;
				padding: 0;
				margin: 0;
				cursor: pointer;
				border: solid 1px $black;
				transition: background-color 0.3s linear;

				&:disabled {
					opacity: 0.5;
					cursor: not-allowed;
				}

				:deep(svg) {
					color: $white;
					transition: color 0.3s linear;
				}

				&:hover:not(:disabled) {
					background-color: $white;

					:deep(svg) {
						color: $black;
					}
				}
			}
		}

		&__message {
			margin-top: 20rem;
			@include switzer(500, normal);
			font-size: 12rem;
			text-transform: uppercase;
			opacity: 0;
			transition: opacity 0.3s linear;

			&.active {
				opacity: 1;
			}

			&.success {
				color: $black;
			}

			&.error {
				color: $black;
				opacity: 0.7;
			}
		}

		.newsletter-popin__social-links {
			display: flex;
			gap: 40rem;
			margin-top: 200rem;
			transition: opacity 0.2s linear;
			opacity: 0;

			&.active {
				opacity: 1;
				transition: 1.6s opacity 0.5s linear;
			}

			a {
				@include switzer(600, normal);
				color: $black;
				font-size: 12rem;
				text-transform: uppercase;
				transition: opacity 0.3s linear;

				&:hover {
					opacity: 0.5;
				}
			}
		}
	}
}
</style>
