const cookieParser = require('cookie-parser')
const express = require("express")
const cors = require("cors")
const helmet = require('helmet')
const logger = require("morgan")
const path = require('path')

class Config{	
	constructor(app){
		app.use('/pics/',express.static(path.join(__dirname, '../../images/')));
		app.use(express.static(path.join(__dirname, '../../build')));
		app.use(cors())
		app.use(helmet())
		app.set('view engine', 'ejs');
		app.use(cookieParser());
		app.use(logger('dev'));
		app.use(express.json({limit:'10mb'}));
		app.use(express.urlencoded({ extended: false }));
	}
}
module.exports = Config;