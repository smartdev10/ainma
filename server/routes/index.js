const AuthRoutes = require('./auth')
const path = require('path')
const ordersRoutes = require('./adminRoutes/order')
const placesRoutes = require('./adminRoutes/place')
const adminUsersRoutes = require('./adminRoutes/users')
const productsRoutes = require('./adminRoutes/product')
const banksRoutes = require('./adminRoutes/banks')
const messagesRoutes = require('./adminRoutes/message')
const errorHandler = require("../controllers/error");

class Routes{

	constructor(app){
		this.app = app;
	}

	appRoutes(){
		this.app.get('/', (req, res) => res.render('index'));

		//auth
		this.app.use('/api/auth',AuthRoutes)
		this.app.use('/api/users',adminUsersRoutes)
		this.app.use('/api/products',productsRoutes)
		this.app.use('/api/banks',banksRoutes)
		this.app.use('/api/places',placesRoutes)
		this.app.use('/api/orders',ordersRoutes)
		this.app.use('/api/messages',messagesRoutes)

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
