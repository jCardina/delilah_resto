const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./routes.js');
const middlewares = require('./middlewares.js');

const validateUser = middlewares.validateUser;
const validateAdmin = middlewares.validateAdmin;


app.listen(3000, () => {
    console.log("Server status: running");
});

app.use(cors());
app.use(bodyParser.json());

//borrado logico de productos y usuarios

//agregar respuestas de errores y codigos exito/error y middlewares (token y same user)


//---------------------------------PRODUCTS---------------------------------//

app.get('/products', validateUser, routes.getProducts);

app.get('/products/:id', validateUser, routes.getProductById);

//---------------ADMIN ONLY---------------//

app.post('/products', validateUser, validateAdmin, routes.postProduct);

app.patch('/products/:id', validateUser, validateAdmin, routes.patchProductById);

app.delete('/products/:id', validateUser, validateAdmin, routes.deleteProductById);


//---------------------------------USERS---------------------------------//

app.post('/users', routes.postUser);

//---------------LOGIN---------------//

app.post('/login', routes.postLogin);

//---------------SAME USER ONLY---------------//
//agregar que los numeros sean numeros y los string

app.get('/users/me', validateUser, routes.getSameUser);

app.patch('/users/me', validateUser, routes.patchSameUser);

app.delete('/users/me', validateUser, routes.deleteSameUser);

//---------------ADMIN ONLY---------------//

app.post('/users/admin', validateUser, validateAdmin, routes.postAdmin);

app.get('/users', validateUser, validateAdmin, routes.getUsers);

app.get('/users/:id', validateUser, validateAdmin, routes.getUserById);

app.delete('/users/:id', validateUser, validateAdmin, routes.deleteUserById);

//agregar try catch a todos los endpoint

//---------------------------------ORDERS---------------------------------//

//---------------SAME USER ONLY---------------//

app.post('/orders', validateUser, routes.postOrder);

app.get('/users/me/orders', validateUser, routes.getSameUserOrders); //revisar qué devuelve cuando es admin!

app.get('/users/me/orders/:id', validateUser, routes.getOrderById); //revisar qué devuelve cuando es admin! usar req.path?

//---------------ADMIN ONLY---------------//

app.get('/orders', validateUser, validateAdmin, routes.getOrders);

app.get('/orders/:id', validateUser, validateAdmin, routes.getOrderById);

app.patch('/orders/:id', validateUser, validateAdmin, routes.patchOrderById);

app.delete('/orders/:id', validateUser, validateAdmin, routes.deleteOrderById);



//------------------------
app.use(middlewares.serverErrorHandler); //revisar!!!!!


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
