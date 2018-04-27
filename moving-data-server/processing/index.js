const { ExifImage } = require('exif');
const { promisify } = require('util');

/**
 * Wrapper around ExifImage that allows us to use async / await
 */
const getRawExifData = promisify((image, callback) => new ExifImage(image, callback));

/**
 * Converts an array of degrees, minutes and seconds into a single decimal coordinate
 * @param {Array} dms Array in [degrees, minutes, seconds] format
 */
const decimalCoords = ([d, m, s]) => d + m / 60 + s / 3600;

/**
 * Get all information from an image relative to our cause
 * @param {Array} image ExifImage image format (e.g. { image: 'path/to/image.jpg' })
 */
const getImageData = async image => {
    const {
        exif: { DateTimeOriginal },
        gps: { GPSLatitude, GPSLongitude, GPSAltitude },
     } = await getRawExifData(image);

    return {
        path: image.image,
        time: DateTimeOriginal,
        lat: decimalCoords(GPSLatitude),
        lng: decimalCoords(GPSLongitude),
        alt: GPSAltitude,
    };
};

module.exports = {
    getImageData,
};
