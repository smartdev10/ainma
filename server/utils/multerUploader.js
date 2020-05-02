const multer = require('multer');
const Datauri = require('datauri');
const path = require('path');

const storage = multer.memoryStorage();
const limits = { fileSize:  1024 * 1024 * 10 }
const multerUploads = multer({
    limits ,
    storage 
    }).fields([
    { name: 'profile', maxCount: 1 },
    { name: 'licence', maxCount: 2 },
    { name: 'insurance', maxCount: 2 },
    { name: 'vregistration', maxCount: 2 },
    { name: 'saudid', maxCount: 2 },
    { name: 'carfront', maxCount: 2 },
    { name: 'carback', maxCount: 2 },
  ])

const dUri = new Datauri();

/**
 * @description This function converts the buffer to data url
 * @param {Object} req containing the field object
 * @returns {String} The data url from the string buffer
 */
const dataUri = file => dUri.format(path.extname(file.originalname).toString(), file.buffer);

exports.multerUploads = multerUploads
exports.dataUri = dataUri