const os = require('os');
const cores = os.cpus().length;
const sharp = require('sharp');
sharp.concurrency(cores);

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
