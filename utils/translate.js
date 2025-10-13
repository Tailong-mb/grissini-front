/**
 * Utility function to get localized text from Sanity locale objects
 * Handles both localeString and localeText types
 *
 * @param {Object} localeObject - The locale object from Sanity
 * @param {string} currentLocale - Current locale (e.g., 'en', 'fr', 'es')
 * @param {string} fallbackLocale - Fallback locale (default: 'en')
 * @returns {string} - Localized text or fallback
 */
export const getLocalizedText = (localeObject, currentLocale, fallbackLocale = 'en') => {
	// If it's already a string, return it
	if (typeof localeObject === 'string') {
		return localeObject;
	}

	// If it's null or undefined, return empty string
	if (!localeObject) {
		return '';
	}

	// If it's a locale object (localeString or localeText)
	if (localeObject._type && (localeObject._type === 'localeString' || localeObject._type === 'localeText')) {
		// Try current locale first
		if (localeObject[currentLocale]) {
			return localeObject[currentLocale];
		}

		// Try fallback locale
		if (localeObject[fallbackLocale]) {
			return localeObject[fallbackLocale];
		}

		// If no locale found, try to get any available locale
		const availableLocales = Object.keys(localeObject).filter((key) => key !== '_type');
		if (availableLocales.length > 0) {
			return localeObject[availableLocales[0]];
		}
	}

	// If it's a plain object with locale keys
	if (typeof localeObject === 'object' && !localeObject._type) {
		// Try current locale first
		if (localeObject[currentLocale]) {
			return localeObject[currentLocale];
		}

		// Try fallback locale
		if (localeObject[fallbackLocale]) {
			return localeObject[fallbackLocale];
		}

		// If no locale found, try to get any available locale
		const availableLocales = Object.keys(localeObject);
		if (availableLocales.length > 0) {
			return localeObject[availableLocales[0]];
		}
	}

	// Fallback to empty string
	return '';
};

/**
 * Composable to use localized text with current locale
 *
 * @param {Object} localeObject - The locale object from Sanity
 * @returns {string} - Localized text
 */
export const useLocalizedText = (localeObject) => {
	const { locale } = useI18n();
	return computed(() => getLocalizedText(localeObject, locale.value));
};

/**
 * Helper function to create a computed property for localized text
 *
 * @param {Object} localeObject - The locale object from Sanity
 * @param {string} currentLocale - Current locale
 * @returns {string} - Localized text
 */
export const createLocalizedText = (localeObject, currentLocale) => {
	return getLocalizedText(localeObject, currentLocale);
};
