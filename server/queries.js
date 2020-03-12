
const Sequelize = require('sequelize');

const sequelize = new Sequelize("delilah_db", "root", "", {
    host: "localhost",
    dialect: "mysql",
});


function updatedUser(id) {
    const query = sequelize.query("SELECT id, name, username, email, address, phone_number, IF(admin, 'true', 'false') AS admin FROM users WHERE id = ?",
        { replacements: [id], type: sequelize.QueryTypes.SELECT }
    ).then(function (data) {
        // response.json({ data: data[0] }); //cambiar status code
        // console.log(data);
        return data[0];
    });
    return query;
}

function encryptPass(pass) {

    let encrypted = sequelize.query("SELECT md5(?)",
        { replacements: [pass], type: sequelize.QueryTypes.SELECT }
    ).then(function (data) {

        let hash = Object.values(data[0])[0];
        // console.log(hash);

        return hash;
    });
    return encrypted;
}

function checkUser(user, email, id) {

    let userMatch = sequelize.query("SELECT username, email FROM users WHERE (username = ? OR email = ?) AND id != ?",
        { replacements: [user, email, id], type: sequelize.QueryTypes.SELECT }
    ).then(data => {
        if (data.length > 0) {
            return true;
        } else {
            return false;
        }
    });
    return userMatch;
}

function updateUser(request, id, name, username, email, address, phone, password) {

    let userNoPass = "UPDATE users SET name = ?, username = ?, email = ?, address = ?, phone_number = ? WHERE id = ?";
    let userPass = "UPDATE users SET name = ?, username = ?, email = ?, address = ?, phone_number = ?, password = ? WHERE id = ?";
    let adminNoPass = "UPDATE users SET name = ?, username = ?, email = ? WHERE id = ?";
    let adminPass = "UPDATE users SET name = ?, username = ?, email = ?, password = ? WHERE id = ?";
    let query;

    if (password != undefined && request.admin == "false") {

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

    if (password == undefined && request.admin == "false") {

        query = sequelize.query(userNoPass,
            { replacements: [name, username, email, address, phone, id] }
        ).then(data => {
            //hace falta el then?
            return data;
        });
        return query;

    }

    if (password != undefined && request.admin == "true") {

        // password = await encryptPass(password);

        query = sequelize.query(adminPass,
            { replacements: [name, username, email, password, id] } //encriptar
        ).then(data => {
            //hace falta el then?
            return data;
        });
        return query;

    }

    if (password == undefined && request.admin == "true") {

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
    updatedUser: updatedUser,
    encryptPass: encryptPass,
    checkUser: checkUser,
    updateUser: updateUser
};
