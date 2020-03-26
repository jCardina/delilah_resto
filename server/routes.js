// const Sequelize = require('sequelize'); //sacar de este archivo?

// const sequelize = new Sequelize("delilah_db", "root", "", {
//     host: "localhost",
//     dialect: "mysql",
// });

const jwt = require('jsonwebtoken');
const signature = require('./middlewares.js').signature;

const queries = require('./queries.js');

const encryptPass = queries.encryptPass;

//sacar?-----
const getUpdatedUser = queries.getUpdatedUser;
const updateUser = queries.updateUser;
const checkUser = queries.checkUser;
//--------

//PRODUCTS------------------------------

const postProduct = async (request, response) => {
    let { name, keyword, price, photo_url } = request.body;

    let post = await queries.createProduct(name, keyword, price, photo_url);
    let newProduct = await queries.getOneProduct(post[0]);
    console.log(post);

    response.status(201).json({data: newProduct}); //que datos devolver?
}


const getProducts = async (request, response) => {


    let data = await queries.getAllProducts();
    response.json({ data: data });

}


const getProductById = async (request, response) => { //hace falta?
    const id = request.params.id;

    let data = await queries.getOneProduct(id);
    response.json({ data: data });

}

const putProductById = async (request, response) => { //204 para put? //validar productos repetidos
    const id = request.params.id;
    let { name, keyword, price, photo_url } = request.body;

    let update = await queries.updateProduct(id, name, keyword, price, photo_url);
    let updatedData = await queries.getOneProduct(id);

    response.json({ data: updatedData }); //cambiar status code

}

const deleteProductById = async (request, response) => {
    const id = request.params.id;

    let data = await queries.deleteProduct(id);

    if (data.affectedRows == 0) {
        response.status(404).json({ msg: "Product not found" });
    } else {
        response.status(204).send();
    }

}


//LOG IN------------------------------

const postLogin = async (request, response) => { //revisar

    // console.log(request.body);
    let { user, password } = request.body;
    
    if (user == undefined || password == undefined) { //agregar validaciones de bad request cuando las keys faltan o estan mal escritas en todas las rutas
        response.status(400).send();
        return;
    }

    password = await encryptPass(password);
    
    console.log(password);

    let logData = await queries.getLogData(user, password);

    try {

        let userInfo = { id: logData[0].id, admin: logData[0].admin };
        console.log(userInfo);
        console.log(signature);
        let token = jwt.sign(userInfo, signature);

        response.status(200).json({ token: token });
    } catch {
        response.status(401).json({ msg: 'Wrong user or password' });
    }

}

//USERS------------------------------

const postUser = async (request, response) => {
    let { name, username, email, address, phone_number, password } = request.body;

    if (name == undefined || username == undefined || email == undefined || address == undefined || phone_number == undefined || password == undefined) {

        response.status(400).send();
        return;
    }

    //chequear valores comillas vacias y minimo characteres junto con tipo de info en updates tambien

    let checkUpUser = await checkUser(username, email, 0);
    console.log(checkUpUser);

    if (checkUpUser) {
        response.status(409).json({ msg: checkUpUser + " already registered" }); //cambiar mensaje?
        return;
    }

    password = await encryptPass(password);
    
    let admin = 0;

    let create = await queries.createUser(name, username, email, address, phone_number, password, admin);

    response.status(201).json({ msg: "User created" });
}


const postAdmin = async (request, response) => {
    let { name, username, email, password } = request.body;

    if (name == undefined || username == undefined || email == undefined || password == undefined) {

        response.status(400).send();
        return;
    }

    //chequear valores comillas vacias y minimo characteres junto con tipo de info en updates tambien

    let checkUpUser = await checkUser(username, email, 0);
    console.log(checkUpUser);

    if (checkUpUser) {
        response.status(409).json({ msg: checkUpUser + " already registered" }); //cambiar mensaje?
        return;
    }

    password = await encryptPass(password);
    
    let admin = 1;

    let create = await queries.createUser(name, username, email, password, admin);

    response.status(201).json({ msg: "Admin user created" });
}












//ORDERS------------------------------

module.exports = {
    postProduct: postProduct,
    getProducts: getProducts,
    getProductById: getProductById,
    putProductById: putProductById,
    deleteProductById: deleteProductById,
    postLogin: postLogin,
    postUser: postUser,
    postAdmin: postAdmin
};