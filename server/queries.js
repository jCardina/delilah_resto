
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
        // console.log(data[0].affectedRows);
        return data[0];
        // if (data[0].affectedRows == 0) {
        //     response.status(404).json({ msg: "Producto no encontrado" });
        // } else {
        //     response.status(204).send();
        // }
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






function getUpdatedUser(id) { //poner directamente get user by id
    const query = sequelize.query("SELECT id, name, username, email, address, phone_number, IF(admin, 'true', 'false') AS admin FROM users WHERE id = ?",
        { replacements: [id], type: sequelize.QueryTypes.SELECT }
    ).then(function (data) {
        // response.json({ data: data[0] }); //cambiar status code
        // console.log(data);
        return data[0];
    });
    return query;
}

function updateUser(admin, id, name, username, email, address, phone, password) {

    let userNoPass = "UPDATE users SET name = ?, username = ?, email = ?, address = ?, phone_number = ? WHERE id = ?";
    let userPass = "UPDATE users SET name = ?, username = ?, email = ?, address = ?, phone_number = ?, password = ? WHERE id = ?";
    let adminNoPass = "UPDATE users SET name = ?, username = ?, email = ? WHERE id = ?";
    let adminPass = "UPDATE users SET name = ?, username = ?, email = ?, password = ? WHERE id = ?";
    let query;

    if (password != undefined && admin == "false") {

        // password = await encryptPass(password);

        query = sequelize.query(userPass,
            { replacements: [name, username, email, address, phone, password, id] }
        ).then(data => {
            //hace falta el then? agregar return a todos los if
            console.log("then");
            return data;
        });
        console.log("return");
        return query;
    }

    if (password == undefined && admin == "false") {

        query = sequelize.query(userNoPass,
            { replacements: [name, username, email, address, phone, id] }
        ).then(data => {
            //hace falta el then?
            return data;
        });
        return query;

    }

    if (password != undefined && admin == "true") {

        // password = await encryptPass(password);

        query = sequelize.query(adminPass,
            { replacements: [name, username, email, password, id] } //encriptar
        ).then(data => {
            //hace falta el then?
            return data;
        });
        return query;

    }

    if (password == undefined && admin == "true") {

        query = sequelize.query(adminNoPass,
            { replacements: [name, username, email, id] }
        ).then(data => {
            //hace falta el then?
            return data;
        });

        return query;
    }
}



module.exports = {
    createProduct: createProduct,
    getAllProducts: getAllProducts,
    getOneProduct: getOneProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,
    getLogData: getLogData,
    createUser: createUser,
    getUpdatedUser: getUpdatedUser,
    encryptPass: encryptPass,
    checkUser: checkUser,
    updateUser: updateUser
};
