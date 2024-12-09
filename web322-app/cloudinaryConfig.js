const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dauwkpcz1',
    api_key: '924982433821666',
    api_secret: 'dzeWSg16-ZwYU0YUmcAXIwBobY8',
    secure: true
});

module.exports = cloudinary;