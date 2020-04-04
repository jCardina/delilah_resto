const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./routes.js');
const middlewares = require('./middlewares.js');

const validateUser = middlewares.validateUser;
const validateAdmin = middlewares.validateAdmin;
const validateBodyProducts = middlewares.validateBodyProducts;
const validateBodyUsers = middlewares.validateBodyUsers;
const validateBodyOrders = middlewares.validateBodyOrders;


app.listen(3000, () => {
    console.log("Server status: running");
});

app.use(cors());
app.use(bodyParser.json());


//---------------------------------PRODUCTS---------------------------------//

app.get('/products', validateUser, routes.getProducts);

app.get('/products/:id', validateUser, routes.getProductById);

//---------------ADMIN ONLY---------------//

app.post('/products', validateUser, validateAdmin, validateBodyProducts, routes.postProduct);

app.patch('/products/:id', validateUser, validateAdmin, validateBodyProducts, routes.patchProductById);

app.delete('/products/:id', validateUser, validateAdmin, routes.deleteProductById);


//---------------------------------USERS---------------------------------//

app.post('/users', validateBodyUsers, routes.postUser);

//---------------LOGIN---------------//

app.post('/login', routes.postLogin);

//---------------SAME USER ONLY---------------//

app.get('/users/me', validateUser, routes.getSameUser);

app.patch('/users/me', validateUser, validateBodyUsers, routes.patchSameUser);

app.delete('/users/me', validateUser, routes.deleteSameUser);

//---------------ADMIN ONLY---------------//

app.post('/users/admin', validateUser, validateAdmin, validateBodyUsers, routes.postAdmin);

app.get('/users', validateUser, validateAdmin, routes.getUsers);

app.get('/users/:id', validateUser, validateAdmin, routes.getUserById);

app.delete('/users/:id', validateUser, validateAdmin, routes.deleteUserById);


//---------------------------------ORDERS---------------------------------//

//---------------SAME USER ONLY---------------//

app.post('/orders', validateUser, validateBodyOrders, routes.postOrder);

app.get('/users/me/orders', validateUser, routes.getSameUserOrders);

app.get('/users/me/orders/:id', validateUser, routes.getOrderById);

//---------------ADMIN ONLY---------------//

app.get('/orders', validateUser, validateAdmin, routes.getOrders);

app.get('/orders/:id', validateUser, validateAdmin, routes.getOrderById);

app.patch('/orders/:id', validateUser, validateAdmin, validateBodyOrders, routes.patchOrderById);

app.delete('/orders/:id', validateUser, validateAdmin, routes.deleteOrderById);



//------------------------------SERVER ERRORS------------------------------//

app.use(middlewares.serverErrorHandler);
