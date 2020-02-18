const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const server = express();

server.use(bodyParser.json());

server.listen(3000, () => {
    console.log("Servidor iniciado...");
});

//agregar respuestas de errores y codigos exito/error y middlewares (token y same user)

//---------------productos

server.get('/products', (request, response) => {
    response.json(products);
});

server.post('/products', (request, response) => {
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

server.get('/products/:id', (request, response) => {
    const id = request.params.id;
    
    products.forEach(element => {
        if(element.id == id) {
            response.json(element);
        }
    });
    
});

server.put('/products/:id', (request, response) => { //o patch? // 204 para put?
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

server.delete('/products/:id', (request, response) => {
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

server.get('/users', (request, response) => {
    let usersPublic = [];

    users.forEach (element => {
        let publicData = {
            id: element.id,
            userName: element.userName,
            admin: element.admin
        }
        usersPublic.push(publicData);
    });
    response.json(usersPublic);
});


//---pedidos

server.get('/orders', (request, response) => {
    response.json(orders);
});


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
        orderId: 1,
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
        date: "10/02/2020",
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
        date: "10/02/2020",
        status: "nuevo"
      }
];


//---------------------------------