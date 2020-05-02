const AuthRoutes = require('./auth')
const path = require('path')
const adminDocumentsRoutes = require('./adminRoutes/documents')
const adminPromosRoutes = require('./adminRoutes/promos')
const adminGlobalsRoutes = require('./adminRoutes/globlas')
const adminDriversRoutes = require('./adminRoutes/drivers')
const adminUsersRoutes = require('./adminRoutes/users')
const adminRidesRoutes = require('./adminRoutes/rides')
const adminRatesRoutes = require('./adminRoutes/rates')
const adminCarsRoutes = require('./adminRoutes/cars')
const errorHandler = require("../controllers/error");

class Routes{

	constructor(app){
		this.app = app;
	}

	appRoutes(){
		this.app.get('/', (req, res) => res.render('index'));

		this.app.get('/api/v1/', (req, res) => res.status(200).send({
			message: 'Welcome to the  V1 Rider APP API!',
		}));

		//auth
		this.app.use('/api/v1/auth',AuthRoutes)
		this.app.use('/api/v1/admin/users',adminUsersRoutes)
		this.app.use('/api/v1/admin/rides',adminRidesRoutes)
		this.app.use('/api/v1/admin/rates',adminRatesRoutes)
		this.app.use('/api/v1/admin/drivers',adminDriversRoutes)
		this.app.use('/api/v1/admin/pages',adminDocumentsRoutes)
		this.app.use('/api/v1/admin/promos',adminPromosRoutes)
		this.app.use('/api/v1/admin/globals',adminGlobalsRoutes)
		this.app.use('/api/v1/admin/cars',adminCarsRoutes)

		this.app.get('/*', function (req, res) {
			res.sendFile(path.join(__dirname, '../../build', 'index.html'));
		});


		//Not Found Route Error
		this.app.use(function(req,res,next){
			let err = new Error("Not Found");
			err.status = 404;
			next(err);
		});

		this.app.use(errorHandler)
	}


	routesConfig(){
		this.appRoutes();
	}
}
module.exports = Routes;
