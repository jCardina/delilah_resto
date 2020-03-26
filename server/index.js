const express = require('express');
const server = express();

const bodyParser = require('body-parser');
const moment = require('moment'); //sacar?
const cors = require('cors');

const routes = require('./routes.js');
const middlewares = require('./middlewares.js');

const validateUser = middlewares.validateUser;
const validateAdmin = middlewares.validateAdmin;

const date = moment().format("YYYY-MM-DD"); //sacar y usar solo timestamp now()?
const time = moment().format("HH:mm:ss");

server.use(cors());
server.use(bodyParser.json());

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


//agregar precio a pedido_productos y sacar total depedidos(se calcula en backend)

//agregar respuestas de errores y codigos exito/error y middlewares (token y same user)

//sacar request params de usuarios que no hagan falta en este archivo porque estan en los middlewares



//---------------------------------PRODUCTS---------------------------------//

server.get('/products', validateUser, routes.getProducts);

server.get('/products/:id', validateUser, routes.getProductById);

//---------------ADMIN ONLY---------------//

server.post('/products', validateUser, validateAdmin, routes.postProduct);

server.put('/products/:id', validateUser, validateAdmin, routes.putProductById);

server.delete('/products/:id', validateUser, validateAdmin, routes.deleteProductById);



//---------------------------------USERS---------------------------------//

server.post('/users', routes.postUser);

//---------------LOGIN---------------//

server.post('/login', routes.postLogin);

//---------------SAME USER ONLY---------------//
//agregar error para cuando las keys no estan bien escritas o faltan o no tienen contenido y que los numeros sean numeros y los string

//revisar que la respuesta de update este actualizada
server.get('/me', validateUser, (request, response) => {

    // const newid = request.userId;
    const id = request.userId;

    sequelize.query("SELECT id, name, username, email, address, phone_number, admin, IF(admin, 'true', 'false') AS admin FROM users WHERE id = ?",
        { replacements: [id], type: sequelize.QueryTypes.SELECT }
    ).then(data => {
        response.json({ data: data[0] });
    });
});

server.put('/me', validateUser, async (request, response) => { //204 para put? VALIDAR QUE NO SE REPITA USERNAME NI EMAIL y que no haya nulls
    // const id = request.params.id;
    const id = request.userId;
    let { name, username, email, address, phone_number, password } = request.body;


    let checkUpUser = await checkUser(username, email, id);

    if (checkUpUser) {
        response.status(409).json({ msg: "Usuario o correo ya registrado" }); //cambiar mensaje
        return;
    }

    if (password != undefined) {
        password = await encryptPass(password);
    }


    let update = await updateUser(request.admin, id, name, username, email, address, phone_number, password);

    let updatedInfo = await getUpdatedUser(id);
    // console.log(updatedInfo);

    response.json({ data: updatedInfo }); //cambiar status code


    // //volver

});



//agregar delete me


//---------------ADMIN ONLY---------------//

server.post('/users/admin', validateUser, validateAdmin, routes.postAdmin);

server.get('/users', validateUser, validateAdmin, (request, response) => {

    sequelize.query("SELECT id, name, username, email, address, phone_number, admin, IF(admin, 'true', 'false') AS admin FROM users",
        { type: sequelize.QueryTypes.SELECT }
    ).then(data => {
        response.json({ data: data });
    });
});

server.get('/users/:id', validateUser, validateAdmin, (request, response) => {

    const id = request.params.id;

    sequelize.query("SELECT id, name, username, email, address, phone_number, admin, IF(admin, 'true', 'false') AS admin FROM users WHERE id = ?",
        { replacements: [id], type: sequelize.QueryTypes.SELECT }
    ).then(data => {
        response.json({ data: data[0] });
    });
});



// agregar data envelope y revisar que si devuelve un objeto no este en array
//agregar validaciones de repeticion de usuario

//sql NOW para hora y fecha sacar moment?


server.delete('/users/:id', validateUser, validateAdmin, (request, response) => {
    // const id = request.params.id;
    const id = request.userId;

    users.forEach(element => {
        if (element.id == id) {

            let index = users.indexOf(element);

            users.splice(index, 1);

            console.log(users);

            response.statusCode = 204;
            response.send();
        }
    });

});

//agregar try catch a todos los endpoints

//revisar que los validate same user sean en endpoints donde el path tenga el id del usuario y no del pedido o ninguno

//---------------------------------ORDERS---------------------------------//

//---------------SAME USER ONLY---------------//

server.post('/orders', validateUser, (request, response) => {

    let { products, total, paymentMethod } = request.body;
    let userId = request.userId;

    let lastAssignedId = orders[orders.length - 1].orderId;
    let newID = lastAssignedId + 1;

    let newOrder = {
        orderId: newID,
        products: products,
        total: total,
        userId: userId,
        paymentMethod: paymentMethod,
        timeStamp: time,
        date: date,
        status: "nuevo"
    };

    orders.push(newOrder);
    console.log(orders);

    response.statusCode = 201;
    response.json(newOrder);
});

server.get('/me/orders', validateUser, (request, response) => {
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

server.get('/me/orders/:id', validateUser, (request, response) => {
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

server.get('/orders', validateUser, validateAdmin, (request, response) => {

    let orders = [];

    async function getOrders() {

        await sequelize.query("SELECT * FROM orders ORDER BY id DESC",
            { type: sequelize.QueryTypes.SELECT }
        ).then(data => {
            orders = data;
            console.log(data);
        });


        for (i = 0; i < orders.length; i++) {

            const order = orders[i];
            const products = await sequelize.query("SELECT op.product_id, op.price, op.quantity FROM order_products op WHERE op.order_id = ?",
                { replacements: [order.id], type: sequelize.QueryTypes.SELECT }
            ).then(function (data) {

                order.products = data;

            });
        }


        response.json({ data: orders });
    }

    getOrders();


});


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