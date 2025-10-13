const isOpen = ref(false);

export const useMenu = () => {
	const openMenu = () => {
		isOpen.value = true;
	};

	const closeMenu = () => {
		isOpen.value = false;
	};

	const toggleMenu = () => {
		isOpen.value = !isOpen.value;
	};

	return {
		isOpen: readonly(isOpen),
		openMenu,
		closeMenu,
		toggleMenu,
	};
};
