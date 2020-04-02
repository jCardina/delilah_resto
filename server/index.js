const express = require('express');
const server = express();

const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./routes.js');
const middlewares = require('./middlewares.js');

const validateUser = middlewares.validateUser;
const validateAdmin = middlewares.validateAdmin;


server.listen(3000, () => {
    console.log("Server status: running");
});

server.use(cors());
server.use(bodyParser.json());

//borrado logico de productos y usuarios

//agregar respuestas de errores y codigos exito/error y middlewares (token y same user)


//---------------------------------PRODUCTS---------------------------------//

server.get('/products', validateUser, routes.getProducts);

server.get('/products/:id', validateUser, routes.getProductById);

//---------------ADMIN ONLY---------------//

server.post('/products', validateUser, validateAdmin, routes.postProduct);

server.patch('/products/:id', validateUser, validateAdmin, routes.patchProductById);

server.delete('/products/:id', validateUser, validateAdmin, routes.deleteProductById);


//---------------------------------USERS---------------------------------//

server.post('/users', routes.postUser);

//---------------LOGIN---------------//

server.post('/login', routes.postLogin);

//---------------SAME USER ONLY---------------//
//agregar que los numeros sean numeros y los string

server.get('/users/me', validateUser, routes.getSameUser);

server.patch('/users/me', validateUser, routes.patchSameUser);

server.delete('/users/me', validateUser, routes.deleteSameUser);

//---------------ADMIN ONLY---------------//

server.post('/users/admin', validateUser, validateAdmin, routes.postAdmin);

server.get('/users', validateUser, validateAdmin, routes.getUsers);

server.get('/users/:id', validateUser, validateAdmin, routes.getUserById);

server.delete('/users/:id', validateUser, validateAdmin, routes.deleteUserById);

//agregar try catch a todos los endpoint

//---------------------------------ORDERS---------------------------------//

//---------------SAME USER ONLY---------------//

server.post('/orders', validateUser, routes.postOrder);

server.get('/users/me/orders', validateUser, routes.getSameUserOrders); //revisar qué devuelve cuando es admin!

server.get('/users/me/orders/:id', validateUser, routes.getOrderById); //revisar qué devuelve cuando es admin! usar req.path?

//---------------ADMIN ONLY---------------//

server.get('/orders', validateUser, validateAdmin, routes.getOrders);

server.get('/orders/:id', validateUser, validateAdmin, routes.getOrderById);

server.patch('/orders/:id', validateUser, validateAdmin, routes.patchOrderById);

server.delete('/orders/:id', validateUser, validateAdmin, routes.deleteOrderById);



//------------------------
server.use(middlewares.serverErrorHandler); //revisar!!!!!


//------------base de datos provisoria

let users = [
    {
        userName: "pabloLop",
        password: "passW",
        admin: true
    },
    {
        userName: "marGon",
        password: "passWoo",
        admin: false
    },
    {
        userName: "marPer",
        password: "passWoo234",
        admin: false
    }

];
