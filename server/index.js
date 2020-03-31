const express = require('express');
const server = express();

const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./routes.js');
const middlewares = require('./middlewares.js');

const validateUser = middlewares.validateUser;
const validateAdmin = middlewares.validateAdmin;

server.use(cors());
server.use(bodyParser.json());


server.use(middlewares.serverErrorHandler);


server.listen(3000, () => {
    console.log("Server status: running");
});


//order by para pedidos y limit y paginacion

// sequelize.query("SELECT op.product_id, op.quantity FROM order_products op JOIN orders o on o.id = op.order_id JOIN products p on p.id = op.product_id WHERE o.id = ?", //segundo join no hace falta
//     {replacements: [1], type: sequelize.QueryTypes.SELECT}
// ).then(function(data) {
//     // console.log(data);

//     newOrder.products = data; 

//     console.log(newOrder);

// });


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
//agregar error para cuando las keys no estan bien escritas o faltan o no tienen contenido y que los numeros sean numeros y los string

server.get('/users/me', validateUser, routes.getSameUser);

server.patch('/users/me', validateUser, routes.patchSameUser);

server.delete('/users/me', validateUser, routes.deleteSameUser);

//---------------ADMIN ONLY---------------//

server.post('/users/admin', validateUser, validateAdmin, routes.postAdmin);

server.get('/users', validateUser, validateAdmin, routes.getUsers);

server.get('/users/:id', validateUser, validateAdmin, routes.getUserById);

server.delete('/users/:id', validateUser, validateAdmin, routes.deleteUserById);


//sql NOW para hora y fecha sacar moment?

//agregar try catch a todos los endpoint

//---------------------------------ORDERS---------------------------------//

//---------------SAME USER ONLY---------------//

server.post('/orders', validateUser, routes.postOrder);

server.get('/me/orders', validateUser, (request, response) => { //agregar users y ver si funcionas
    // const id = request.params.id;
    const id = request.userId;

    let userOrders = [];

    async function getUserOrders() {

        await sequelize.query("SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC",
            { replacements: [id], type: sequelize.QueryTypes.SELECT }
        ).then(data => {
            userOrders = data;
            console.log(data);
        });


        for (i = 0; i < userOrders.length; i++) {

            const order = userOrders[i];
            const products = await sequelize.query("SELECT op.product_id, op.price, op.quantity FROM order_products op WHERE op.order_id = ?",
                { replacements: [order.id], type: sequelize.QueryTypes.SELECT }
            ).then(function (data) {

                order.products = data;

            });
        }


        response.json({ data: userOrders });
    }

    getUserOrders();


});

server.get('/me/orders/:id', validateUser, (request, response) => { //agregar users y ver si funcionas
    const orderId = request.params.id;
    const userId = request.userId;

    let userOrder = {};

    async function getUserOrder() {

        await sequelize.query("SELECT * FROM orders WHERE user_id = ? AND id = ?",
            { replacements: [userId, orderId], type: sequelize.QueryTypes.SELECT }
        ).then(data => {
            userOrder = data[0];
            console.log(data);
        });

        const products = await sequelize.query("SELECT op.product_id, op.price, op.quantity FROM order_products op WHERE op.order_id = ?",
            { replacements: [orderId], type: sequelize.QueryTypes.SELECT }
        ).then(function (data) {

            userOrder.products = data;

        });


        response.json({ data: userOrder });
    }

    getUserOrder();


});


//---------------ADMIN ONLY---------------//

server.get('/orders', validateUser, validateAdmin, routes.getOrders);


server.get('/orders/:id', validateUser, validateAdmin, (request, response) => {
    const id = request.params.id;
    // const reqUserId = request.userId;

    async function getOrder() {

        let order = {};

        await sequelize.query("SELECT * FROM orders WHERE id =?",
            { replacements: [id], type: sequelize.QueryTypes.SELECT }
        ).then(data => {
            order = data[0];
            console.log(data);
        });


        const products = await sequelize.query("SELECT op.product_id, op.price, op.quantity FROM order_products op WHERE op.order_id = ?",
            { replacements: [id], type: sequelize.QueryTypes.SELECT }
        ).then(function (data) {

            order.products = data;

        });


        response.json({ data: order });
    }

    getOrder();

});

server.put('/orders/:id', validateUser, validateAdmin, (request, response) => {
    const id = request.params.id;
    const status = request.query;

    orders.forEach(element => {
        if (element.orderId == id) {
            element.status = status.status;
            console.log(orders);
            response.json(element);
        }
    });

});

// agregar delete orders





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

let products = [
    {
        photoUrl: "https://www.gimmesomeoven.com/wp-content/uploads/2017/03/Rosemary-Focaccia-Recipe-1.jpg"
    },
    {
        photoUrl: "https://storage.googleapis.com/gen-atmedia/3/2019/05/a94cfde51967df5caf0f1641f53a5470df4421c1.jpeg"
    }

];