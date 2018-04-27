const { getImageData } = require('./processing');
const GeoJSON = require('geojson');
const { promisify } = require('util');
const fs = require('fs');

listFiles = promisify(fs.readdir);

const process = async () => {
  try {
    const allFiles = await listFiles('input-images');
    const images = allFiles.filter(path => path.endsWith('.jpg'));
    const promises = images.map(path => getImageData({ image: `input-images/${path}` }));
    const data = await Promise.all(promises);
    const geojson = GeoJSON.parse(data, { Point: ['lat', 'lng'] });
    console.log(JSON.stringify(geojson));
    
  } catch(e) {
    console.error(e);
  }
};

process();