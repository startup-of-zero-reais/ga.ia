export function getRandomUid() {
	const now = Date.now();
	const hexTime = now.toString(16).padStart(8, '0').slice(-8);

	return [
		hexTime,
		randomHex(4),
		randomHex(4),
		randomHex(4),
		randomHex(12),
	].join('-');
}

function randomHex(length = 16) {
	let result = '';

	for (let i = 0; i < length; i++) {
		result += Math.floor(Math.random() * 16).toString(16);
	}

	return result;
}
