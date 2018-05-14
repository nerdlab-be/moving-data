const { getImageData } = require('./processing');
const { promisify } = require('util');
const fs = require('fs');
const proj4 = require('proj4')

const listFiles = promisify(fs.readdir);
const write = promisify(fs.writeFile);

proj4.defs('EPSG:3812', `
PROJCS["ETRS89 / Belgian Lambert 2008",
    GEOGCS["ETRS89",
        DATUM["European Terrestrial Reference System 1989",
            SPHEROID["GRS 1980",6378137.0,298.257222101,
                AUTHORITY["EPSG","7019"]],
            TOWGS84[0.0,0.0,0.0,0.0,0.0,0.0,0.0],
            AUTHORITY["EPSG","6258"]],
        PRIMEM["Greenwich",0.0,
            AUTHORITY["EPSG","8901"]],
        UNIT["degree",0.017453292519943295],
        AXIS["Geodetic latitude",NORTH],
        AXIS["Geodetic longitude",EAST],
        AUTHORITY["EPSG","4258"]],
    PROJECTION["Lambert Conic Conformal (2SP)",
        AUTHORITY["EPSG","9802"]],
    PARAMETER["central_meridian",4.359215833333335],
    PARAMETER["latitude_of_origin",50.79781500000001],
    PARAMETER["standard_parallel_1",49.833333333333336],
    PARAMETER["false_easting",649328.0],
    PARAMETER["false_northing",665262.0],
    PARAMETER["standard_parallel_2",51.16666666666667],
    UNIT["m",1.0],
    AXIS["Easting",EAST],
    AXIS["Northing",NORTH],
    AUTHORITY["EPSG","3812"]]
`);

const toClientFormat = ({ path, time, lat, lng, alt }) => ({
  photoURL: path,
  time: time,
  coords: [proj4.transform('EPSG:4326', 'EPSG:3812', [lat, lng]), alt],
});


const processImages = async directory => {
  try {
    const allFiles = await listFiles(directory);
    const images = allFiles.filter(path => path.endsWith('.jpg'));
    const promises = images.map(path => getImageData({ image: `${directory}/${path}` }));
    const data = await Promise.all(promises);
    const clientData = { collection: data.map(toClientFormat) }
    await write(`${directory}/data.json`, JSON.stringify(clientData));
  } catch(e) {
    console.error(e);
  }
};

processImages(process.argv[2]);
