const os = require('os');
const cores = os.cpus().length;
const sharp = require('sharp');
sharp.concurrency(cores);

module.exports = async (path, format, dest) => {
	try {
		switch (format) {
			case 'png':
				await sharp(path).toFormat('png', { quality: 100, palette: false }).toFile(dest);
				break;
			case 'webp':
				await sharp(path).toFormat('webp', { quality: 100 }).toFile(dest);
				break;
			case 'jpeg':
			case 'jpg':
				await sharp(path).toFormat('jpeg', { quality: 100, mozjpeg: true }).toFile(dest);
				break;
			default:
				res.status(404).render('4xx/404');
		}
	} catch (err) {
		console.error('[ERROR]', err);
	}
};
