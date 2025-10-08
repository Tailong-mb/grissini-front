const isOpen = ref(false);

export const useNewsletter = () => {
	const openNewsletter = () => {
		isOpen.value = true;
	};

	const closeNewsletter = () => {
		isOpen.value = false;
	};

	const toggleNewsletter = () => {
		isOpen.value = !isOpen.value;
	};

	return {
		isOpen: readonly(isOpen),
		openNewsletter,
		closeNewsletter,
		toggleNewsletter,
	};
};
