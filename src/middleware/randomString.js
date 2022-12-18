module.exports = (length = 15, char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_') => {
	const result = [];

	while (length--) {
		result.push(char.charAt(Math.floor(Math.random() * char.length)));
	}

	return result.join('');
};
