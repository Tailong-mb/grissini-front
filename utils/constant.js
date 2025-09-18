const urlParams = new URLSearchParams(window.location.search);

export const CONSTANT = {
	orbit: urlParams.has('orbit'),
	debug: urlParams.has('debug'),
	width: window.innerWidth,
	height: window.innerHeight,
};
