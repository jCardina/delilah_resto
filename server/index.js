const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const middlewares = require('./middlewares');

const signature = "token_Generator_3402921GtFDnL";
// const signature = middlewares.signature; //revisar que funcione

//get pedidos trae todos los que no estan entregados



// select md5("contraseña") para encriptar

//libreria routes para no tener toda la estructura en el mismo archivo
// var corsOptions = {
//     origin: "http://localhost:8081"
//   };
//app.use(cors(corsOptions));

//npm i mysql
//definir array funciones que


//---------------------

const Sequelize = require('sequelize');

const sequelize = new Sequelize("delilah_db", "root", "", {
    host: "localhost",
    dialect: "mysql",
});


sequelize.query("SELECT name, user_name, admin WHERE id < ? IF( admin = ?, ?, ?) AS admin FROM users",
    {replacements: [3, 1, "true", "false"], type: sequelize.QueryTypes.SELECT}
).then(function(data) {
    let userList = {data: data};
    console.log(userList);
});

let newOrder = {};

  sequelize.query("SELECT * FROM orders WHERE id = ?",
      {replacements: [1], type: sequelize.QueryTypes.SELECT}
  ).then(function(data) {
    //   console.log(data);
    newOrder.id = data[0].id;
    newOrder.total = data[0].total;
    newOrder.user_id = data[0].user_id;
    newOrder.payment_method = data[0].payment_method;
    newOrder.time = data[0].time;
    newOrder.date = data[0].date;
    newOrder.status = data[0].status;
    // console.log(data);
  });

  let idPrueba = 1

sequelize.query("SELECT op.id, op.quantity FROM order_products op JOIN orders o on o.id = op.order_id JOIN products p on p.id = op.product_id WHERE o.id = ?", //segundo join no hace falta
    {replacements: [idPrueba], type: sequelize.QueryTypes.SELECT}
).then(function(data) {
    // console.log(data);
    
    newOrder.products = data; 

    console.log(newOrder);
    
});

sequelize.query("SELECT md5(?)",
    {replacements: ["123"], type: sequelize.QueryTypes.SELECT}
).then(function(data) {
    console.log(data);    
});

// sequelize.query("INSERT INTO users (name, user_name, email, address, phone_number, password, admin) VALUES(?, ?, ?, ?, ?, ?, ?)",
// {replacements: ["Carla Gomez", "car_goo", "carlagomez@gmal.com", "Peru 333", 23495955, "passs", 1]}
// ).then(function(data) {
//     console.log("user created");
// });





//--------------------


let date = moment().format("DD-MM-YYYY");
let time = moment().format("HH:mm");

// server.use(cors);
server.use(bodyParser.json());

server.listen(3000, () => {
    console.log("Servidor iniciado...");
});

// let validateUser = middlewares.validateUser;
// let validateAdmin = middlewares.validateAdmin;
// let validateSameUser = middlewares.validateSameUser;
//agregar respuestas de errores y codigos exito/error y middlewares (token y same user)

//sacar request params de usuarios que no hagan falta en este archivo porque estan en los middlewares


//----------------------------middlewares

function splitToken(token) {
    try {
        let getToken = token.split(' ')[1];
        return getToken;
    } catch(error) {
        return false;
    }
}

const validateUser = (request, response, next) => { //revisar
    
    let Token = request.headers.authorization;

    console.log(request.path);

    const token =  splitToken(Token);
    console.log(token);

    if(!token) {
        response.status(401).json({msj: 'Token missing'});
        return;
    }

    
    try { //revisar funcionamiento
        
        let verifyToken = jwt.verify(token, signature);

        
        // if(decodedToken){
            request.userId = verifyToken.id;
            request.admin = verifyToken.admin;
            console.log(verifyToken);
            console.log(request.userId);
            console.log(request.admin); 
            next();
            // }else{
                //     throw "No permmision"; //??
                // }
    } catch (error) {
        response.status(401).json({msj: 'Invalid login'}); //cambiar mensaje
    }                  
}

// const validateSameUser = (request, response, next) => {
//     const id = request.params.id;

//     if(request.userId == id) {
//         next();
//     } else {
//         response.status(403).json({msj: 'forbidden'}); //cambiar mensaje
//     }
// }


//validar admin
const validateAdmin = (request, response, next) => {
    if(request.admin) {
        next();
    } else {
        response.status(403).json({msj: 'forbidden'}); //cambiar mensaje
    }
}


//--------------------------------------

//---------------productos

server.get('/products', validateUser, (request, response) => {

        response.json(products);
});

server.post('/products', validateUser, validateAdmin, (request, response) => {
    let {name, keyword, price, photoUrl} = request.body;
    
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

server.get('/products/:id',validateUser, (request, response) => { //hace falta?
    const id = request.params.id;
    
    products.forEach(element => {
        if(element.id == id) {
            response.json(element);
        }
    });
    
});

server.put('/products/:id', validateUser, validateAdmin, (request, response) => { //204 para put?
    const id = request.params.id;
    let {name, keyword, price, photoUrl} = request.body;

    products.forEach(element => {
        if(element.id == id) {

            element.name = name;
            element.keyword = keyword;
            element.price = price;
            element.photoUrl = photoUrl;

            response.json(element);
            console.log(products);
        }
    });
    
});

server.delete('/products/:id', validateUser, validateAdmin, (request, response) => {
    const id = request.params.id;
    
    products.forEach(element => {
        if(element.id == id) {

            let index = products.indexOf(element);

            products.splice(index,1);

            console.log(products);

            response.statusCode = 204;
            response.send();
        }
    });
    
});


//-------------usuarios

server.get('/users', validateUser, validateAdmin, (request, response) => {
    let usersPublic = [];

    users.forEach (element => {
        let userData = {
            id: element.id,
            name: element.name,
            userName: element.userName,
            email: element.email,
            address: element.address,
            phoneNumber: element.phoneNumber,
            admin: element.admin
        }
        usersPublic.push(userData);
    });
    response.json(usersPublic);
});

server.get('/users/:id', validateUser, (request, response) => {

    // const id = request.params.id;
    const id = request.userId;
    users.forEach (element => {
    
        if(element.id == id) {

            let userData = {
                id: element.id,
                name: element.name,
                userName: element.userName,
                email: element.email,
                address: element.address,
                phoneNumber: element.phoneNumber,
                admin: element.admin
            }
    
            response.json(userData);
        }
    });
});

server.put('/users/:id', validateUser, (request, response) => { //204 para put?
    // const id = request.params.id;
    const id = request.userId;
    let data = request.body;

    users.forEach(element => {
        if(element.id == id) { //modificar para que sean todos obligatorios salvo password

            if(data.name) {
                element.name = data.name;
            }
            if(data.userName) {
            element.userName = data.userName;
            }
            if(data.email) {
            element.email = data.email;
            }
            if(data.address) {
            element.address = data.address;
            }
            if(data.phoneNumber) {
            element.phoneNumber = data.phoneNumber;
            }
            if(data.password) {
            element.password = data.password;
            }

            let userData = {
                id: element.id,
                name: element.name,
                userName: element.userName,
                email: element.email,
                address: element.address,
                phoneNumber: element.phoneNumber,
            }

            response.json(userData);
            console.log(users);
           
        }
    });
    
});

server.delete('/users/:id', validateUser, (request, response) => {
    // const id = request.params.id;
    const id = request.userId;
    
    users.forEach(element => {
        if(element.id == id) {

            let index = users.indexOf(element);

            users.splice(index,1);

            console.log(users);

            response.statusCode = 204;
            response.send();
        }
    });
    
});

//post cliente y admin
//agregar try catch a todos los endpoints


//revisar
server.post('/login', (request, response) => {
    let userFound = false;

    console.log(request.body);
    let {user, pass} = request.body;
    console.log(user);
    
    users.forEach( element => {
        
        if((element.userName == user && element.password == pass) || (element.email == user && element.password == pass)){
            let userInfo = {id: element.id, admin: element.admin};
            let token = jwt.sign(userInfo, signature);
            userFound = true;
            response.status(200).json({
                token: token,
                userId: element.id
            });
        }
    });

    if(!userFound) {
        response.status(401).json({msj: 'Wrong user or password'}); //agregar validaciones de bad request cuando las keys faltan o estan mal escritas
    }
 });

//revisar que los validate same user sean en endpoints donde el path tenga el id del usuario y no del pedido o ninguno

//-----------------pedidos

server.get('/orders', validateUser, validateAdmin, (request, response) => {
    response.json(orders);
});


server.post('/orders', validateUser, (request, response) => {

    let {products, total, paymentMethod} = request.body;
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



server.get('/users/:id/orders', validateUser, (request, response) => {
    // const id = request.params.id;
    const id = request.userId;

    let userOrders = []
    
    orders.forEach(element => {
        if(element.userId == id) {
            userOrders.push(element);
        }
    });

    response.json(userOrders);
    
});

server.get('/orders/:id', validateUser, (request, response) => { //revisar parte es el mismo usuario 
    //hace falta este endpoint?
    const id = request.params.id;
    const reqUserId = request.userId;
    
    orders.forEach(element => {
        if(element.orderId == id && element.userId == reqUserId) {
            response.json(element);
        }
    });
    
});

server.put('/orders/:id', validateUser, validateAdmin, (request, response) => {
    const id = request.params.id;
    const status = request.query;
    
    orders.forEach(element => {
        if(element.orderId == id) {
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