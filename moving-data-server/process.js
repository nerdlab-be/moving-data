const { getImageData } = require('./processing');
const { promisify } = require('util');
const fs = require('fs');

const listFiles = promisify(fs.readdir);
const write = promisify(fs.writeFile);

const toClientFormat = ({ path, time, lat, lng, alt }) => ({
  photoURL: path,
  time: time,
  coords: [lng, lat, alt],
});

const processImages = async directory => {
  try {
    const allFiles = await listFiles(directory);
    const images = allFiles.filter(path => path.endsWith('.jpg'));
    const promises = images.map(path => getImageData({ image: `${directory}/${path}` }));
    const data = await Promise.all(promises);
    await write(`${directory}/data.json`, JSON.stringify(data.map(toClientFormat)));
  } catch(e) {
    console.error(e);
  }
};

processImages(process.argv[2]);
