const sharp = require('sharp');

module.exports = async (path, format, dest) => {
	if (format === 'png') {
		try {
			await sharp(path).toFormat('jpeg', { mozjpeg: true }).toFile(dest);
		} catch (err) {
			console.error(err);
		}
	} else {
		try {
			await sharp(path).toFormat('png', { palette: true }).toFile(dest);
		} catch (err) {
			console.error(err);
		}
	}
};
