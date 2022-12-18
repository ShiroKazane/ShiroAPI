module.exports = (string) => {
	return string.replace(/([^\W_]+[hg^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};
