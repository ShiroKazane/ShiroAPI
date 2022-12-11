module.exports = (strLength, charSet) => {
	var result = [];

	strLength = strLength || 15;
	charSet =
		charSet ||
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

	while (strLength--) {
		result.push(charSet.charAt(Math.floor(Math.random() * charSet.length)));
	}

	return result.join('');
};
