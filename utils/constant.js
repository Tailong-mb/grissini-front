const urlParams = new URLSearchParams(window.location.search);

export const CONSTANT = {
	orbit: urlParams.has('orbit'),
	debug: urlParams.has('debug'),
	width: window.innerWidth,
	height: window.innerHeight,
};

export const LOADER_PLAYED = {
	PLAYED: 'false',
};
