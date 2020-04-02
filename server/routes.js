
const jwt = require('jsonwebtoken');
const signature = require('./middlewares.js').signature;

const queries = require('./queries.js');

const encryptPass = queries.encryptPass;
const checkUser = queries.checkUser;


//PRODUCTS------------------------------

const postProduct = async (request, response) => {
    let { name, keyword, price, photo_url, stock } = request.body;

    if (name == undefined || keyword == undefined || price == undefined || photo_url == undefined || stock == undefined) {

        response.status(400).send();
        return;
    }

    let checkTable = await queries.checkProduct(name, keyword, 0);

    if (checkTable) {
        response.status(409).json({ msg: "Product with the same " + checkTable + " already registered" }); //cambiar mensaje?
        return;
    }

    let post = await queries.createProduct(name, keyword, price, photo_url, stock); //validar que esten todos los datos y que no exista otro activo
    let newProduct = await queries.getOneProduct(post[0]);
    console.log(post);

    response.status(201).json({ data: newProduct }); //que datos devolver?
}


const getProducts = async (request, response) => {


    let data = await queries.getAllProducts(request.admin);
    response.json({ data: data });

}

//agregar status 200 a las respuestas?

const getProductById = async (request, response) => {
    const id = request.params.id;

    let data = await queries.getOneProduct(id, request.admin);

    if (!data) {
        response.status(404).json({ msg: "Product not found" });
    } else {
        response.json({ data: data });
    }

}

const patchProductById = async (request, response) => {
    const id = request.params.id;
    let { name, keyword, price, photo_url, stock } = request.body;

    if (name == undefined && keyword == undefined && price == undefined && photo_url == undefined && stock == undefined) {

        response.status(400).send();
        return;
    }

    let checkTable = await queries.checkProduct(name, keyword, id);

    if (checkTable) {
        response.status(409).json({ msg: "Product with the same " + checkTable + " already registered" }); //cambiar mensaje?
        return;
    }

    // console.log(typeof(name));
    // if (name.length < 3) {
    //     console.log("corto");
    // }

    let update = await queries.updateProduct(id, name, keyword, price, photo_url, stock);

    let updatedData = await queries.getOneProduct(id);

    if (!updatedData) {
        response.status(404).json({ msg: "Product not found" });
    } else {
        response.json({ data: updatedData }); //cambiar status code?
    }

}

const deleteProductById = async (request, response) => {
    const id = request.params.id;
    //agregar borrado logico con getorders
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

    let create = await queries.createUser(name, username, email, password, admin, address, phone_number);

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


const getUsers = async (request, response) => {

    let data = await queries.getAllUsers();
    response.json({ data: data });
}

const getUserById = async (request, response) => {

    const id = request.params.id;

    let data = await queries.getOneUser(id);

    if (!data) {
        response.status(404).json({ msg: "User not found" });
    } else {
        response.json({ data: data });
    }

}

const deleteUserById = async (request, response) => {
    const id = request.params.id;
    //agregar borrado logico

    let data = await queries.deleteUser(id);

    if (data.affectedRows == 0) {
        response.status(404).json({ msg: "User not found" });
    } else {
        response.status(204).send();
    }

}


const getSameUser = async (request, response) => {
    let data = await queries.getOneUser(request.userId);

    if (!data) {
        response.status(404).json({ msg: "User not found" });
    } else {
        response.json({ data: data }); //cambiar status code?
    }

}


const patchSameUser = async (request, response) => {

    const id = request.userId;
    let { name, username, email, address, phone_number, password } = request.body;

    if (name == undefined && username == undefined && email == undefined && address == undefined && phone_number == undefined && password == undefined) {

        response.status(400).send();
        return;
    }

    if (username != undefined || email != undefined) {

        let checkUpUser = await checkUser(username, email, id);

        if (checkUpUser) {
            response.status(409).json({ msg: checkUpUser + " already registered" }); //cambiar mensaje?
            return;
        }
    }

    if (password != undefined) {
        password = await encryptPass(password);
    }


    let update = await queries.updateUser(id, name, username, email, address, phone_number, password);

    let updatedData = await queries.getOneUser(id);
    // console.log(updatedInfo);

    if (!updatedData) {
        response.status(404).json({ msg: "User not found" });
    } else {
        response.json({ data: updatedData }); //cambiar status code?
    }



}

const deleteSameUser = async (request, response) => {
    const id = request.userId;
    //agregar borrado logico

    let data = await queries.deleteUser(id);

    if (data.affectedRows == 0) {
        response.status(404).json({ msg: "User not found" }); //cambiar mensaje o sacar?
    } else {
        response.status(204).send();
    }

}






//ORDERS------------------------------

const postOrder = async (request, response) => {

    const userId = request.userId;
    let { products, payment_method } = request.body;
    let total = 0;

    if (typeof (products) != "object" || products.length == undefined || products.length < 1) {
        response.status(400).json({ msg: "List of products missing" });
        return;
    }

    if (payment_method != "efectivo" && payment_method != "tarjeta") {
        response.status(400).json({ msg: "Invalid payment method" });
        return;
    }

    for (i = 0; i < products.length; i++) {

        let quantity = products[i].quantity;

        if (typeof (quantity) != "number" || parseInt(quantity) < 1) {
            response.status(400).json({ msg: "Invalid quantity" });
            return;
        }

        let product = await queries.getOneProduct(products[i].id);

        if (!product) {
            response.status(404).json({ msg: "Product not found or unavailable, product_id: " + products[i].id });
            return;
        }

        if (products[i].quantity > product.stock) {
            response.status(409).json({ msg: "Not enough items in stock, product_id: " + product.id });
            return;
        }


        products[i].price = product.price;
        products[i].stock = product.stock;


        let partial = product.price * products[i].quantity;
        total += partial;
        console.log(partial);
    }

    console.log(total);

    for (i = 0; i < products.length; i++) {

        await queries.updateStock(products[i]);
    }

    let newOrder = await queries.createOrder(userId, products, total, payment_method);
    // console.log(newOrder);
    response.status(201).json({ order_id: newOrder });

}

const getOrders = async (request, response) => {

    let { limit, offset, date, status } = request.query;
    // console.log(isNaN(limit));


    if (limit != undefined && !isNaN(limit)) {

        limit = parseInt(limit);
        // console.log(limit);

    } else {

        limit = 30;
    }

    if (offset != undefined && !isNaN(offset)) {

        offset = parseInt(offset);

    } else {

        offset = 0;
    }

    const pattern = new RegExp("^[0-9]{4}[-][0-9]{2}[-][0-9]{2}$");
    const checkDate = pattern.test(date);

    if (!checkDate) {
        date = false;
    }

    if (status != "nuevo" && status != "confirmado" && status != "preparando" && status != "enviando" && status != "entregado" && status != "cancelado") {
        status = false;
    }

    let orders = await queries.getAllOrders(limit, offset, date, status);

    response.json({ data: orders });

}

const getOrderById = async (request, response) => {

    const id = request.params.id;

    let order = await queries.getOneOrder(id);

    // response.json({ data: order });
    
    if (!order) {
        response.status(404).json({ msg: "Order not found" });
    } else {
        response.json({ data: order });
    }
}

const patchOrderById = async  (request, response) => {
    const id = request.params.id;
    const { status } = request.body;

    if (status != "nuevo" && status != "confirmado" && status != "preparando" && status != "enviando" && status != "entregado" && status != "cancelado") {
        response.status(400).json({ msg: "Ivalid order status"});
        return;
    }

    let update = await queries.updateOrderStatus(id, status);
    // console.log(update);
    let updatedOrder = await queries.getOneOrder(id);

    if (!updatedOrder) {
        response.status(404).json({ msg: "Order not found" });
    } else {
        response.json({ order_id: id, new_status: status });
    }

}





module.exports = {
    postProduct: postProduct,
    getProducts: getProducts,
    getProductById: getProductById,
    patchProductById: patchProductById,
    deleteProductById: deleteProductById,
    postLogin: postLogin,
    postUser: postUser,
    postAdmin: postAdmin,
    getUsers: getUsers,
    getUserById: getUserById,
    deleteUserById: deleteUserById,
    getSameUser: getSameUser,
    patchSameUser: patchSameUser,
    deleteSameUser: deleteSameUser,
    postOrder: postOrder,
    getOrders: getOrders,
    getOrderById: getOrderById,
    patchOrderById: patchOrderById
};