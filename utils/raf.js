let animationFrameId = null;
const callbacks = new Set();

function rafCallback() {
	for (const callback of callbacks) {
		callback();
	}
}

export function startAnimationFrame() {
	if (!animationFrameId) {
		function rafLoop() {
			rafCallback();
			animationFrameId = requestAnimationFrame(rafLoop);
		}
		rafLoop();
	}
}

export function stopAnimationFrame() {
	cancelAnimationFrame(animationFrameId);
	animationFrameId = null;
}

export function addAnimationFrameCallback(callback) {
	callbacks.add(callback);
}

export function removeAnimationFrameCallback(callback) {
	callbacks.delete(callback);
}
