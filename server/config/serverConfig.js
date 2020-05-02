const cookieParser = require('cookie-parser')
const express = require("express")
const cors = require("cors")
const helmet = require('helmet')
const logger = require("morgan")
const { cloudinaryConfig } = require('../utils/cloudinaryConfig')

class Config{
	
	constructor(app){
		app.use(cors())
		app.use('*', cloudinaryConfig );
		app.use(helmet())
		app.set('view engine', 'ejs');
		app.use(cookieParser());
		app.use(logger('dev'));
		app.use(express.json({limit:'10mb'}));
		app.use(express.urlencoded({ extended: false }));

	}
}
module.exports = Config;