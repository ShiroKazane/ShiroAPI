module.exports = (length, char) => {
	var result = [];
	length = length || 15;
	char =
		char || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
	while (length--) {
		result.push(char.charAt(Math.floor(Math.random() * char.length)));
	}
	return result.join('');
};
