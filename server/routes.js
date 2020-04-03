
const jwt = require('jsonwebtoken');
const signature = require('./middlewares.js').signature;

const queries = require('./queries.js');

const encryptPass = queries.encryptPass;
const checkUser = queries.checkUser;


//---------------PRODUCTS---------------//

const postProduct = async (request, response, next) => {
    let { name, keyword, price, photo_url, stock } = request.body;

    if (name == undefined || keyword == undefined || price == undefined || photo_url == undefined || stock == undefined) {

        response.status(400).send();
        return;
    }

    try {

        let checkTable = await queries.checkProduct(name, keyword, 0);

        if (checkTable) {
            response.status(409).json({ msg: "Product with the same " + checkTable + " already registered" });
            return;
        }

        let post = await queries.createProduct(name, keyword, price, photo_url, stock);
        let newProduct = await queries.getOneProduct(post[0]);
        console.log(post);

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

    if (name == undefined && keyword == undefined && price == undefined && photo_url == undefined && stock == undefined) {

        response.status(400).send();
        return;
    }

    try {

        let checkTable = await queries.checkProduct(name, keyword, id);

        if (checkTable) {
            response.status(409).json({ msg: "Product with the same " + checkTable + " already registered" });
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

    // console.log(request.body);
    let { user, password } = request.body;

    if (user == undefined || password == undefined) {
        response.status(400).send();
        return;
    }

    let logData;

    try {
        password = await encryptPass(password);

        console.log(password);

        logData = await queries.getLogData(user, password);
    } catch (error) {
        return next(error);
    }

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


const postUser = async (request, response, next) => {
    let { name, username, email, address, phone_number, password } = request.body;

    if (name == undefined || username == undefined || email == undefined || address == undefined || phone_number == undefined || password == undefined) {

        response.status(400).send();
        return;
    }

    try {
        let checkUpUser = await checkUser(username, email, 0);
        console.log(checkUpUser);

        if (checkUpUser) {
            response.status(409).json({ msg: checkUpUser + " already registered" });
            return;
        }

        password = await encryptPass(password);

        let admin = 0;

        let create = await queries.createUser(name, username, email, password, admin, address, phone_number);

        response.status(201).json({ msg: "User created" });
    } catch (error) {
        next(error);
    }
}


const postAdmin = async (request, response, next) => {
    let { name, username, email, password } = request.body;

    if (name == undefined || username == undefined || email == undefined || password == undefined) {

        response.status(400).send();
        return;
    }

    try {

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

    const id = request.params.id;

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
        let userOrders = await queries.getAllOrders(5, 0, false, false, "false", id);

        let deleteType;
        
        if (userOrders.length > 0) {
            deleteType = 0;
        } else {
            deleteType = 1;
        }

        let data = await queries.deleteUser(id, deleteType);
        console.log(data);

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

    if (name == undefined && username == undefined && email == undefined && address == undefined && phone_number == undefined && password == undefined) {

        response.status(400).send();
        return;
    }

    try {
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

        let userOrders = await queries.getAllOrders(5, 0, false, false, "false", id);

        let deleteType;
        
        if (userOrders.length > 0) {
            deleteType = 0;
        } else {
            deleteType = 1;
        }

        let data = await queries.deleteUser(id, deleteType);

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

    if (request.admin == 'true') {
        response.status(403).send();
        return;
    }

    const user = {};
    user.id = request.userId;

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

    try {

        let idProductsOrdered = [];

        for (i = 0; i < products.length; i++) {

            let quantity = products[i].quantity;

            if (typeof (quantity) != "number" || parseInt(quantity) < 1) {
                response.status(400).json({ msg: "Invalid quantity" });
                return;
            }
            
            for (j = 0; j < idProductsOrdered.length; j++) {

                if (products[i].id == idProductsOrdered[j]) {
                    response.status(400).json({ msg: "Each product can only be sent once per order" });
                    return;
                }
            }

            idProductsOrdered.push(products[i].id);
            console.log(idProductsOrdered);

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
            // console.log(partial);
        }

        console.log(total);

        for (i = 0; i < products.length; i++) {

            await queries.updateStock(products[i]);
        }

        let userInfo = await queries.getOneUser(user.id);
        user.address = userInfo.address;

        let newOrder = await queries.createOrder(user, products, total, payment_method);
        // console.log(newOrder);
        response.status(201).json({ order_id: newOrder });

    } catch (error) {
        next(error);
    }
}


const getOrders = async (request, response, next) => {

    let { limit, offset, date, status } = request.query;

    if (limit != undefined && !isNaN(limit)) {

        limit = parseInt(limit);
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

    if (status != "nuevo" && status != "confirmado" && status != "preparando" && status != "enviando" && status != "entregado" && status != "cancelado") {
        response.status(400).json({ msg: "Ivalid order status" });
        return;
    }

    try {

        let update = await queries.updateOrderStatus(id, status);
        // console.log(update);
        let updatedOrder = await queries.getOneOrder(id);

        if (!updatedOrder) {
            response.status(404).json({ msg: "Order not found" });
        } else {
            response.json({ order_id: id, new_status: status });
        }
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



//---------------DATA VALIDATION---------------//

const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const usernamePattern = new RegExp("^[a-zA-Z0-9_-]{6,15}$");
const phonePattern = new RegExp("^[0-9]{2,4}[ ][0-9]{7,10}$");
const keywordPattern = new RegExp("^[a-zA-Z_-]{3,10}$");
const passwordPattern = new RegExp("^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9_-]{8,}$");


const checkValidData = (pattern, data) => {

    let validData = pattern.test(data);
    return validData;

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