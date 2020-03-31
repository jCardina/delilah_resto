
const Sequelize = require('sequelize');

const sequelize = new Sequelize("delilah_db", "root", "", {
    host: "localhost",
    dialect: "mysql",
});





//pasar functions mas abajo a const--------!!!!

//Products------------------

const createProduct = (name, keyword, price, photo_url, stock) => {

    const query = sequelize.query("INSERT INTO products (name, keyword, price, photo_url, stock, status) VALUES(?, ?, ?, ?, ?, ?)",
        { replacements: [name, keyword, price, photo_url, stock, "active"] }
    ).then(data => {
        return data;
    });
    // console.log(query);
    return query;
}

const getAllProducts = (admin) => {

    let queryString = "SELECT ";

    if (admin == "true") {

        queryString += "* FROM products WHERE status = 'active'";

    } else {

        queryString += "id, name, keyword, price, photo_url, stock FROM products WHERE status = 'active' AND stock > 0";

    }


    const query = sequelize.query(queryString,
        { type: sequelize.QueryTypes.SELECT }
    ).then(data => {
        return data;
    });
    // console.log(query);
    return query;
}

const getOneProduct = (id, admin) => {

    let queryString = "SELECT ";

    if (admin == "true") {

        queryString += "* FROM products WHERE status = 'active'";

    } else {

        queryString += "id, name, keyword, price, photo_url, stock FROM products WHERE status = 'active' AND stock > 0";

    }

    queryString += " AND id = ?";

    const query = sequelize.query(queryString,
        { replacements: [id], type: sequelize.QueryTypes.SELECT }
    ).then(data => {

        if (data.length > 0) {
            return data[0];

        } else {
            return false;
        }
    });
    return query;
}

const updateProduct = (id, name, keyword, price, photo_url, stock) => {

    let queryString = "UPDATE products SET ";
    let replace = [];
    let firstClmn = true;

    if (name != undefined) {

        queryString += "name = ?";
        replace.push(name);
        firstClmn = false;

    }

    if (keyword != undefined) {

        if (!firstClmn) {
            queryString += ", keyword = ?";
        } else {
            queryString += "keyword = ?";
            firstClmn = false;
        }

        replace.push(keyword);
    }

    if (price != undefined) {

        if (!firstClmn) {
            queryString += ", price = ?";
        } else {
            queryString += "price = ?";
            firstClmn = false;
        }
        replace.push(price);

    }

    if (photo_url != undefined) {

        if (!firstClmn) {
            queryString += ", photo_url = ?";
        } else {
            queryString += "photo_url = ?";
            firstClmn = false;
        }
        replace.push(photo_url);

    }


    if (stock != undefined) {

        if (!firstClmn) {
            queryString += ", stock = ?";
        } else {
            queryString += "stock = ?";
            firstClmn = false;
        }
        replace.push(stock);

    }

    queryString += " WHERE id = ?"
    replace.push(id);

    const query = sequelize.query(queryString,
        { replacements: replace }
    ).then(data => {
        console.log(data);
        return data[0];
    });

    return query;

}

const deleteProduct = (id) => {

    const query = sequelize.query("DELETE FROM products WHERE id = ?",
        { replacements: [id] }
    ).then(data => {
        return data[0];
    });
    return query;
}

const checkProduct = (name, keyword, id) => {

    let productMatch = sequelize.query("SELECT name, keyword FROM products WHERE (name = ? OR keyword = ?) AND id != ?",
        { replacements: [name, keyword, id], type: sequelize.QueryTypes.SELECT }
    ).then(data => {
        console.log(data);
        if (data.length > 0) { //revisar

            if (name == data[0].name) {

                return "name";

            } else {
                return "keyword";
            }

        } else {
            return false;
        }
    });
    return productMatch;
}


//Users---------------------

const getLogData = (user, password) => {

    let query = sequelize.query("SELECT id, admin, IF(admin, 'true', 'false') AS admin FROM users WHERE (username = ? AND password = ?) OR (email = ? AND password = ?)",
        { replacements: [user, password, user, password], type: sequelize.QueryTypes.SELECT }
    ).then(data => {
        console.log(data);
        return data;
    });

    return query;

}

const createUser = (name, username, email, password, admin, address, phone_number) => {

    const query = sequelize.query("INSERT INTO users (name, username, email, password, admin, address, phone_number) VALUES(?, ?, ?, ?, ?, ?, ?)",
        { replacements: [name, username, email, password, admin, address, phone_number] }
    ).then(data => {
        console.log(data);
        return data;
    });
    return query;
}


const getAllUsers = () => {

    const query = sequelize.query("SELECT id, name, username, email, address, phone_number, admin, IF(admin, 'true', 'false') AS admin FROM users",
        { type: sequelize.QueryTypes.SELECT }
    ).then(data => {
        return data;
    });
    return query;
}


const getOneUser = (id) => {

    const query = sequelize.query("SELECT id, name, username, email, address, phone_number, admin, IF(admin, 'true', 'false') AS admin FROM users WHERE id = ?",
        { replacements: [id], type: sequelize.QueryTypes.SELECT }
    ).then(data => {
        return data[0];
    });
    return query;

}

const deleteUser = (id) => {

    const query = sequelize.query("DELETE FROM users WHERE id = ?",
        { replacements: [id] }
    ).then(data => {
        return data[0];
    });
    return query;
}


const updateUser = (id, name, username, email, address, phone, password) => {

    let queryString = "UPDATE users SET ";
    let replace = [];
    let firstClmn = true;

    if (name != undefined) {

        queryString += "name = ?";
        replace.push(name);
        firstClmn = false;

    }

    if (username != undefined) {

        if (!firstClmn) {
            queryString += ", username = ?";
        } else {
            queryString += "username = ?";
            firstClmn = false;
        }

        replace.push(username);
    }

    if (email != undefined) {

        if (!firstClmn) {
            queryString += ", email = ?";
        } else {
            queryString += "email = ?";
            firstClmn = false;
        }
        replace.push(email);

    }

    if (address != undefined) {

        if (!firstClmn) {
            queryString += ", address = ?";
        } else {
            queryString += "address = ?";
            firstClmn = false;
        }
        replace.push(address);

    }

    if (phone != undefined) {

        if (!firstClmn) {
            queryString += ", phone_number = ?";
        } else {
            queryString += "phone_number = ?";
            firstClmn = false;
        }
        replace.push(phone);

    }

    if (password != undefined) {

        if (!firstClmn) {
            queryString += ", password = ?";
        } else {
            queryString += "password = ?";
            firstClmn = false;
        }
        replace.push(password);

    }

    queryString += " WHERE id = ?"
    replace.push(id);

    const query = sequelize.query(queryString,
        { replacements: replace }
    ).then(data => {
        console.log(data);
        return data[0];
    });

    return query;

}


const createOrder = (user, products, total, paymentMethod) => {

    console.log(products);

    const order = sequelize.query("INSERT INTO orders (user_id, total, payment_method) VALUES(?, ?, ?)",
        { replacements: [user, total, paymentMethod] }
    ).then(data => {
        console.log(data);

        for (i = 0; i < products.length; i++) {

            sequelize.query("INSERT INTO order_products (order_id, product_id, price, quantity) VALUES(?, ?, ?, ?)",
                { replacements: [data[0], products[i].id, products[i].price, products[i].quantity] }
            ).then(info => {
                console.log(info);
                return info;
            });
        }

    });
    // console.log(query);
    return order;
}

const updateStock = (product) => {

    let updatedStock = product.stock - product.quantity;

    const query = sequelize.query("UPDATE products SET stock = ? WHERE id = ?",
        { replacements: [updatedStock, product.id] }
    ).then(info => {
        console.log(info);
        return info;
    });

    return query;
}










//---------------

const encryptPass = (pass) => {

    let encrypted = sequelize.query("SELECT md5(?)",
        { replacements: [pass], type: sequelize.QueryTypes.SELECT }
    ).then(function (data) {

        let hash = Object.values(data[0])[0];
        // console.log(hash);

        return hash;
    });
    return encrypted;
}
//---------
const checkUser = (user, email, id) => {

    let userMatch = sequelize.query("SELECT username, email FROM users WHERE (username = ? OR email = ?) AND id != ?",
        { replacements: [user, email, id], type: sequelize.QueryTypes.SELECT }
    ).then(data => {
        console.log(data);
        if (data.length > 0) { //revisar

            if (user == data[0].username) {

                return "Username";

            } else {
                return "Email";
            }

        } else {
            return false;
        }
    });
    return userMatch;
}







//------------------





module.exports = {
    createProduct: createProduct,
    getAllProducts: getAllProducts,
    getOneProduct: getOneProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,
    checkProduct: checkProduct,
    getLogData: getLogData,
    createUser: createUser,
    getAllUsers: getAllUsers,
    getOneUser: getOneUser,
    deleteUser: deleteUser,
    updateUser: updateUser,
    createOrder: createOrder,
    updateStock: updateStock, //
    encryptPass: encryptPass,
    checkUser: checkUser
};
