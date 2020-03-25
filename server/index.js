const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const moment = require('moment'); //sacar?
const jwt = require('jsonwebtoken'); //sacar?
const cors = require('cors');

const signature = "token_Generator_3402921GtFDnL"; //sacar?

const queries = require('./queries.js');

const getUpdatedUser = queries.getUpdatedUser;
const encryptPass = queries.encryptPass;
const updateUser = queries.updateUser;
const checkUser = queries.checkUser;


const routes = require('./routes.js');




// serequire("./routes.js"));

//---------------------

const Sequelize = require('sequelize'); //sacar de este archivo?

const sequelize = new Sequelize("delilah_db", "root", "", {
    host: "localhost",
    dialect: "mysql",
});



//order by para pedidos y limit y paginacion

// sequelize.query("SELECT op.product_id, op.quantity FROM order_products op JOIN orders o on o.id = op.order_id JOIN products p on p.id = op.product_id WHERE o.id = ?", //segundo join no hace falta
//     {replacements: [1], type: sequelize.QueryTypes.SELECT}
// ).then(function(data) {
//     // console.log(data);

//     newOrder.products = data; 

//     console.log(newOrder);

// });


// sequelize.query("INSERT INTO users (name, user_name, email, address, phone_number, password, admin) VALUES(?, ?, ?, ?, ?, ?, ?)",
// {replacements: ["Carla Gomez", "car_goo", "carlagomez@gmal.com", "Peru 333", 23495955, "passs", 1]}
// ).then(function(data) {
//     console.log("user created");
// });

//agregar precio a pedido_productos y sacar total depedidos(se calcula en backend)
//--------------------


let date = moment().format("YYYY-MM-DD");
let time = moment().format("HH:mm:ss");

server.use(cors());
server.use(bodyParser.json());

server.listen(3000, () => {
    console.log("Servidor iniciado...");
});


//agregar respuestas de errores y codigos exito/error y middlewares (token y same user)

//sacar request params de usuarios que no hagan falta en este archivo porque estan en los middlewares


// //----------------------------middlewares

// function splitToken(token) {
//     try {
//         let getToken = token.split(' ')[1];
//         return getToken;
//     } catch (error) {
//         return false;
//     }
// }

// const validateUser = (request, response, next) => { //revisar

//     let Token = request.headers.authorization;

//     console.log(request.path);

//     const token = splitToken(Token);
//     console.log(token);

//     if (!token) {
//         response.status(401).json({ msj: 'Token missing' });
//         return;
//     }


//     try { //revisar funcionamiento

//         let verifyToken = jwt.verify(token, signature);


//         // if(decodedToken){
//         request.userId = verifyToken.id;
//         request.admin = verifyToken.admin;
//         console.log(verifyToken);
//         console.log(request.userId);
//         console.log(request.admin);
//         next();
//         // }else{
//         //     throw "No permmision"; //??
//         // }
//     } catch (error) {
//         response.status(401).json({ msj: 'Invalid login' }); //cambiar mensaje
//     }
// }



// //validar admin
// const validateAdmin = (request, response, next) => {
//     if (request.admin == 'true') {
//         next();
//     } else {
//         response.status(403).json({ msj: 'forbidden' }); //cambiar mensaje
//     }
// }


// //-----------------fin middlewares---------------------

//---------------PRODUCTOS-------------------------------------

//---------------USER----------------------//

// server.get('/products', validateUser, (request, response) => {

//     sequelize.query("SELECT * FROM products",
//         { type: sequelize.QueryTypes.SELECT }
//     ).then(data => {
//         response.json({ data: data });
//     });
// });

server.get('/products', routes.validateUser, routes.getProducts);

server.get('/products/:id', routes.validateUser, routes.getProductById);
// server.get('/products/:id', routes.validateUser, (request, response) => { //hace falta?
//     const id = request.params.id;

//     sequelize.query("SELECT * FROM products WHERE id = ?",
//         { replacements: [id], type: sequelize.QueryTypes.SELECT }
//     ).then(data => {
//         response.json({ data: data[0] });
//     });

// });


//PRUEBA 12-3

//---------------FIN USER----------------------//


//---------------SOLO ADMIN----------------------//

server.post('/products', routes.validateUser, routes.validateAdmin, (request, response) => {
    let { name, keyword, price, photoUrl } = request.body;

    let lastAssignedId = products[products.length - 1].id;
    let newID = lastAssignedId + 1;

    let newProduct = {
        id: newID,
        name: name,
        keyword: keyword,
        price: price,
        photoUrl: photoUrl
    };

    products.push(newProduct);
    console.log(products);

    response.statusCode = 201;
    response.json(newProduct);
});



server.put('/products/:id', routes.validateUser, routes.validateAdmin, (request, response) => { //204 para put?
    const id = request.params.id;
    let { name, keyword, price, photo_url } = request.body;

    sequelize.query("UPDATE products SET name = ?, keyword = ?, price = ?, photo_url = ? WHERE id = ?",
        { replacements: [name, keyword, price, photo_url, id] }
    ).then(function (data) {

        sequelize.query("SELECT * FROM products WHERE id = ?",
            { replacements: [id], type: sequelize.QueryTypes.SELECT }
        ).then(function (data) {
            response.json({ data: data[0] }); //cambiar status code
        });

    });

});

server.delete('/products/:id', routes.validateUser, routes.validateAdmin, (request, response) => {
    const id = request.params.id;

    sequelize.query("DELETE FROM products WHERE id = ?",
        { replacements: [id] }
    ).then(data => {
        // console.log(data[0].affectedRows);

        if (data[0].affectedRows == 0) {
            response.status(404).json({ msg: "Producto no encontrado" });
        } else {
            response.status(204).send();
        }
    });

});


//---------------FIN SOLO ADMIN----------------------//

//---------------FIN PRODUCTOS-------------------------------------------



//-------------USUARIOS--------------------------------------------------


//---------------USER----------------------//




//agregar error para cuando las keys no estan bien escritas o faltan o no tienen contenido y que los numeros sean numeros

//revisar que la respuesta de update este actualizada
server.get('/me', routes.validateUser, (request, response) => {

    // const newid = request.userId;
    const id = request.userId;

    sequelize.query("SELECT id, name, username, email, address, phone_number, admin, IF(admin, 'true', 'false') AS admin FROM users WHERE id = ?",
        { replacements: [id], type: sequelize.QueryTypes.SELECT }
    ).then(data => {
        response.json({ data: data[0] });
    });
});

server.put('/me', routes.validateUser, async (request, response) => { //204 para put? VALIDAR QUE NO SE REPITA USERNAME NI EMAIL y que no haya nulls
    // const id = request.params.id;
    const id = request.userId;
    let { name, username, email, address, phone_number, password } = request.body;


    let checkUpUser = await checkUser(username, email, id);

    if (checkUpUser) {
        response.status(402).json({ msg: "Usuario o correo ya registrado" }); //revisar codigo error
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

//agregar post user y admin y delete me
//---------------FIN USER----------------------//


//---------------SOLO ADMIN----------------------//

server.get('/users', routes.validateUser, routes.validateAdmin, (request, response) => {

    sequelize.query("SELECT id, name, username, email, address, phone_number, admin, IF(admin, 'true', 'false') AS admin FROM users",
        { type: sequelize.QueryTypes.SELECT }
    ).then(data => {
        response.json({ data: data });
    });
});

server.get('/users/:id', routes.validateUser, routes.validateAdmin, (request, response) => {

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


server.delete('/users/:id', routes.validateUser, routes.validateAdmin, (request, response) => {
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

//post cliente y admin
//agregar try catch a todos los endpoints

//---------------FIN SOLO ADMIN----------------------//
//---------------FIN USUARIOS----------------------------------------------

//---------------LOGIN---------------------------------------------------

function logIn(user, password) {

    let query = sequelize.query("SELECT id, admin, IF(admin, 'true', 'false') AS admin FROM users WHERE (username = ? AND password = ?) OR (email = ? AND password = ?)",
        { replacements: [user, password, user, password], type: sequelize.QueryTypes.SELECT }
    ).then(data => {
        console.log(data);
        return data;
    });

    return query;

}



//revisar
server.post('/login', async (request, response) => {

    console.log(request.body);
    let { user, password } = request.body;
    // console.log(user);

    let encrypt = await encryptPass(password);
    password = encrypt;
    console.log(password);

    let logData = await logIn(user, password);

    try {

        let userInfo = { id: logData[0].id, admin: logData[0].admin };
        console.log(userInfo);
        let token = jwt.sign(userInfo, signature);

        response.status(200).json({ token: token });
    } catch {
        response.status(401).json({ msj: 'Wrong user or password' }); //agregar validaciones de bad request cuando las keys faltan o estan mal escritas
    }

});

//---------------FIN LOGIN----------------------------------------------

//revisar que los validate same user sean en endpoints donde el path tenga el id del usuario y no del pedido o ninguno

//---------------PEDIDOS----------------------------------------------

//---------------USUARIOS----------------------//

server.post('/orders', routes.validateUser, (request, response) => {

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

server.get('/me/orders', routes.validateUser, (request, response) => {
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

server.get('/me/orders/:id', routes.validateUser, (request, response) => {
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





//---------------FIN USUARIOS----------------------//


//---------------SOLO ADMIN----------------------//

server.get('/orders', routes.validateUser, routes.validateAdmin, (request, response) => {

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


server.get('/orders/:id', routes.validateUser, routes.validateAdmin, (request, response) => {
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

server.put('/orders/:id', routes.validateUser, routes.validateAdmin, (request, response) => {
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

//---------------FIN SOLO ADMIN----------------------//
//---------------FIN PEDIDOS----------------------------------------------

//------------base de datos provisoria

let users = [
    {
        id: 1,
        name: "Pablo Lopez",
        userName: "pabloLop",
        email: "pablolopez@gmail.com",
        address: "Doblas 243",
        phoneNumber: 49675588,
        password: "passW",
        admin: true
    },
    {
        id: 2,
        name: "Maria Gonzalez",
        userName: "marGon",
        email: "mariagonzalez@gmail.com",
        address: "Peru 5870",
        phoneNumber: 45635518,
        password: "passWoo",
        admin: false
    },
    {
        id: 3,
        name: "Marcos Perez",
        userName: "marPer",
        email: "marcosperez@gmail.com",
        address: "Ayacucho 1240",
        phoneNumber: 45031319,
        password: "passWoo234",
        admin: false
    }

];

let products = [
    {
        id: 1,
        name: "Focaccia",
        keyword: "focacc",
        price: 200,
        photoUrl: "https://www.gimmesomeoven.com/wp-content/uploads/2017/03/Rosemary-Focaccia-Recipe-1.jpg"
    },
    {
        id: 2,
        name: "Veggie Burger",
        keyword: "veggBur",
        price: 150,
        photoUrl: "https://storage.googleapis.com/gen-atmedia/3/2019/05/a94cfde51967df5caf0f1641f53a5470df4421c1.jpeg"
    }

];

let orders = [
    {
        orderId: 1, //cambiar por id y productId
        products: [
            {
                id: 2,
                quantity: 1
            },
            {
                id: 1,
                quantity: 2
            },
        ],
        total: 550,
        userId: 2,
        paymentMethod: "efectivo",
        timeStamp: "18:29",
        date: "10-02-2020",
        status: "confirmado"
    },
    {
        orderId: 2,
        products: [
            {
                id: 1,
                quantity: 1
            },
            {
                id: 2,
                quantity: 1
            },
        ],
        total: 350,
        userId: 3,
        paymentMethod: "tarjeta",
        timeStamp: "17:50",
        date: "10-02-2020",
        status: "nuevo"
    }
];


//---------------------------------