const jwt = require('jsonwebtoken');
const signature = require('./middlewares.js').signature;

const queries = require('./queries.js');

const encryptPass = queries.encryptPass;
const checkUser = queries.checkUser;


//---------------PRODUCTS---------------//

const postProduct = async (request, response, next) => {

    let { name, keyword, price, photo_url, stock } = request.body;

    try {

        //check if nother product with the same name or keyword exists
        let checkTable = await queries.checkProduct(name, keyword, 0);

        if (checkTable) {
            response.status(409).json({ msg: "Product with the same " + checkTable + " already registered" });
            return;
        }

        let post = await queries.createProduct(name, keyword, price, photo_url, stock);
        let newProduct = await queries.getOneProduct(post[0]);

        response.status(201).json({ data: newProduct });

    } catch (error) {
        next(error);
    }
}


const getProducts = async (request, response, next) => {

    try {

        let data = await queries.getAllProducts(request.admin);
        response.json({ data: data });

    } catch (error) {
        next(error);
    }
}


const getProductById = async (request, response, next) => {

    const id = request.params.id;

    try {

        let data = await queries.getOneProduct(id, request.admin);

        if (!data) {
            response.status(404).json({ msg: "Product not found" });
        } else {
            response.json({ data: data });
        }

    } catch (error) {
        next(error);
    }
}


const patchProductById = async (request, response, next) => {

    const id = request.params.id;
    let { name, keyword, price, photo_url, stock } = request.body;

    try {

        let checkTable = await queries.checkProduct(name, keyword, id);

        if (checkTable) {
            response.status(409).json({ msg: "Product with the same " + checkTable + " already registered" });
            return;
        }

        let update = await queries.updateProduct(id, name, keyword, price, photo_url, stock);

        let updatedData = await queries.getOneProduct(id);

        if (!updatedData) {
            response.status(404).json({ msg: "Product not found" });
        } else {
            response.json({ data: updatedData });
        }
    } catch (error) {
        next(error);
    }
}


const deleteProductById = async (request, response, next) => {

    const id = request.params.id;

    try {

        let data = await queries.deleteProduct(id);

        if (data.affectedRows == 0) {
            response.status(404).json({ msg: "Product not found" });
        } else {
            response.status(204).send();
        }
    } catch (error) {
        next(error);
    }
}


//---------------USERS---------------//

const postLogin = async (request, response, next) => {

    let { user, password } = request.body;

    //check that both user and password were sent
    if (user == undefined || password == undefined) {
        response.status(400).send();
        return;
    }

    let logData;

    try {

        password = await encryptPass(password);

        //search database for matching credentials
        logData = await queries.getLogData(user, password);

    } catch (error) {
        return next(error);
    }

    try {

        let userInfo = { id: logData[0].id, admin: logData[0].admin };
        let token = jwt.sign(userInfo, signature);

        response.status(200).json({ token: token });

    } catch {
        response.status(401).json({ msg: 'Wrong user or password' });
    }
}


const postUser = async (request, response, next) => {

    let { name, username, email, address, phone_number, password } = request.body;

    try {

        //check if another user with the same username or email exists
        let checkUpUser = await checkUser(username, email, 0);

        if (checkUpUser) {
            response.status(409).json({ msg: checkUpUser + " already registered" });
            return;
        }

        password = await encryptPass(password);

        //set admin = false
        let admin = 0;

        let create = await queries.createUser(name, username, email, password, admin, address, phone_number);

        response.status(201).json({ msg: "User created" });

    } catch (error) {
        next(error);
    }
}


const postAdmin = async (request, response, next) => {

    let { name, username, email, password } = request.body;

    try {

        //check if another user with the same username or email exists
        let checkUpUser = await checkUser(username, email, 0);

        if (checkUpUser) {
            response.status(409).json({ msg: checkUpUser + " already registered" });
            return;
        }

        password = await encryptPass(password);

        //set admin = true
        let admin = 1;

        let create = await queries.createUser(name, username, email, password, admin);

        response.status(201).json({ msg: "Admin user created" });

    } catch (error) {
        next(error);
    }
}


const getUsers = async (request, response, next) => {

    try {

        let data = await queries.getAllUsers();
        response.json({ data: data });

    } catch (error) {
        next(error);
    }
}


const getUserById = async (request, response, next) => {

    let id = request.params.id;

    try {

        let data = await queries.getOneUser(id);

        if (!data) {
            response.status(404).json({ msg: "User not found" });
        } else {
            response.json({ data: data });
        }

    } catch (error) {
        next(error);
    }
}


const deleteUserById = async (request, response, next) => {
    const id = request.params.id;

    //prevent admin from deleting itself
    if (request.userId == id) {
        response.status(403).send();
        return;
    }

    try {

        let data = await queries.deleteUser(id);

        if (data.affectedRows == 0) {
            response.status(404).json({ msg: "User not found" });
        } else {
            response.status(204).send();
        }

    } catch (error) {
        next(error);
    }
}


const getSameUser = async (request, response, next) => {

    try {
        let data = await queries.getOneUser(request.userId);

        if (!data) {
            response.status(404).json({ msg: "User not found" });
        } else {
            response.json({ data: data });
        }
    } catch (error) {
        next(error);
    }
}


const patchSameUser = async (request, response, next) => {

    const id = request.userId;
    let { name, username, email, address, phone_number, password } = request.body;

    try {

        //if username or email are sent, check that there are no users with the same username or email
        if (username != undefined || email != undefined) {

            let checkUpUser = await checkUser(username, email, id);

            if (checkUpUser) {
                response.status(409).json({ msg: checkUpUser + " already registered" });
                return;
            }
        }

        if (password != undefined) {
            password = await encryptPass(password);
        }


        let update = await queries.updateUser(id, name, username, email, address, phone_number, password);

        let updatedData = await queries.getOneUser(id);

        if (!updatedData) {
            response.status(404).json({ msg: "User not found" });
        } else {
            response.json({ data: updatedData });
        }

    } catch (error) {
        next(error);
    }
}


const deleteSameUser = async (request, response, next) => {

    const id = request.userId;

    //prevent admin from deleting itself
    if (request.admin == 'true') {
        response.status(403).send();
        return;
    }

    try {

        let data = await queries.deleteUser(id);

        if (data.affectedRows == 0) {
            response.status(404).json({ msg: "User not found" });
        } else {
            response.status(204).send();
        }
    } catch (error) {
        next(error);
    }
}


//---------------ORDERS---------------//

const postOrder = async (request, response, next) => {

    //prevent admin users from creating orders
    if (request.admin == 'true') {
        response.status(403).send();
        return;
    }

    const user = {};
    user.id = request.userId;

    let { products, payment_method } = request.body;
    let total = 0;

    try {

        //check that all requested products are available and that there is enough of each one in stock
        for (i = 0; i < products.length; i++) {

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
        }

        //update stock of all products
        for (i = 0; i < products.length; i++) {

            await queries.updateStock(products[i]);
        }

        //get order address
        let userInfo = await queries.getOneUser(user.id);
        user.address = userInfo.address;

        let newOrder = await queries.createOrder(user, products, total, payment_method);

        response.status(201).json({ order_id: newOrder });

    } catch (error) {
        next(error);
    }
}


const getOrders = async (request, response, next) => {

    let { limit, offset, date, status } = request.query;

    //check if valid limit number is requested, otherwise the default is 30
    if (limit != undefined && !isNaN(limit)) {

        limit = parseInt(limit);
    } else {
        limit = 30;
    }

    //check if valid offset number is requested, otherwise the default is 0
    if (offset != undefined && !isNaN(offset)) {

        offset = parseInt(offset);
    } else {
        offset = 0;
    }

    //check if valid date is requested, otherwise all orders are returned
    const pattern = new RegExp("^[0-9]{4}[-][0-9]{2}[-][0-9]{2}$");
    const checkDate = pattern.test(date);

    if (!checkDate) {
        date = false;
    }

    //check if valid order status is requested, otherwise all orders are returned
    if (status != "nuevo" && status != "confirmado" && status != "preparando" && status != "enviando" && status != "entregado" && status != "cancelado") {
        status = false;
    }

    try {

        let orders = await queries.getAllOrders(limit, offset, date, status, request.admin);
        response.json({ data: orders });

    } catch (error) {
        next(error);
    }
}


const getOrderById = async (request, response, next) => {

    const orderId = request.params.id;
    let order;

    try {

        order = await queries.getOneOrder(orderId, request.admin, request.userId);

    } catch (error) {
        return next(error);
    }

    if (!order) {
        response.status(404).json({ msg: "Order not found" });

    } else if (order == 'forbidden') {
        response.status(403).json({ msg: "Forbidden" });

    } else {
        response.json({ data: order });
    }
}


const patchOrderById = async (request, response, next) => {

    const id = request.params.id;
    const { status } = request.body;

    try {

        let orderToUpdate = await queries.getOneOrder(id);

        if (!orderToUpdate) {
            response.status(404).json({ msg: "Order not found" });
            return;
        }

        let update = await queries.updateOrderStatus(id, status);

        response.json({ msg: "Order updated" });

    } catch (error) {
        next(error);
    }
}


const getSameUserOrders = async (request, response, next) => {

    const id = request.userId;
    const admin = request.admin;

    if (admin == 'true') {
        response.status(404).json({ msg: "No orders" });
        return;
    }

    try {
        
        let userOrders = await queries.getAllOrders(30, 0, false, false, admin, id);
        response.json({ data: userOrders });

    } catch (error) {
        next(error);
    }
}


const deleteOrderById = async (request, response, next) => {

    const id = request.params.id;

    try {

        let data = await queries.deleteOrder(id);

        if (data.affectedRows == 0) {
            response.status(404).json({ msg: "Order not found" });
        } else {
            response.status(204).send();
        }

    } catch (error) {
        next(error);
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
    patchOrderById: patchOrderById,
    getSameUserOrders: getSameUserOrders,
    deleteOrderById: deleteOrderById
};