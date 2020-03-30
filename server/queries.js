
const Sequelize = require('sequelize');

const sequelize = new Sequelize("delilah_db", "root", "", {
    host: "localhost",
    dialect: "mysql",
});





//pasar functions mas abajo a const--------!!!!

const createProduct = (name, keyword, price, photo_url) => {

    const query = sequelize.query("INSERT INTO products (name, keyword, price, photo_url) VALUES(?, ?, ?, ?)",
        { replacements: [name, keyword, price, photo_url] }
    ).then(data => {
        return data;
    });
    // console.log(query);
    return query;
}

const getAllProducts = () => {
    const query = sequelize.query("SELECT * FROM products",
        { type: sequelize.QueryTypes.SELECT }
    ).then(data => {
        return data;
    });
    // console.log(query);
    return query;
}

const getOneProduct = (id) => {

    const query = sequelize.query("SELECT * FROM products WHERE id = ?",
        { replacements: [id], type: sequelize.QueryTypes.SELECT }
    ).then(data => {

        return data[0];
    });
    return query;
}

const updateProduct = (id, name, keyword, price, photo_url) => {

    const query = sequelize.query("UPDATE products SET name = ?, keyword = ?, price = ?, photo_url = ? WHERE id = ?",
        { replacements: [name, keyword, price, photo_url, id] }
    ).then(data => { //hace falta?

        // let data = await getOneProduct(id);
        return data;

        // sequelize.query("SELECT * FROM products WHERE id = ?",
        //     { replacements: [id], type: sequelize.QueryTypes.SELECT }
        // ).then(function (data) {
        //     response.json({ data: data[0] }); //cambiar status code
        // });

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

//cambiar get por select en nombres de funciones?

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
    getLogData: getLogData,
    createUser: createUser,
    getAllUsers: getAllUsers,
    getOneUser: getOneUser,
    deleteUser: deleteUser,
    updateUser: updateUser, //
    encryptPass: encryptPass,
    checkUser: checkUser
};
