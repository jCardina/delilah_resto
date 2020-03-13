const Sequelize = require('sequelize'); //sacar de este archivo?

const sequelize = new Sequelize("delilah_db", "root", "", {
    host: "localhost",
    dialect: "mysql",
});


const getProducts = (request, response) => {

    sequelize.query("SELECT * FROM products",
        { type: sequelize.QueryTypes.SELECT }
    ).then(data => {
        response.json({ data: data });
    });

}

// module.exports = { getProducts };

const validateTest = (request, response, next) => { //revisar

    // if (request.admin == 'true') {
        console.log(request);
        next();
    // } else {
    //     response.status(403).json({ msj: 'forbidden' }); //cambiar mensaje
    // }

}


module.exports = {
    getProducts: getProducts,
    validateTest: validateTest
};