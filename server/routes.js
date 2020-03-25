const Sequelize = require('sequelize'); //sacar de este archivo?

const sequelize = new Sequelize("delilah_db", "root", "", {
    host: "localhost",
    dialect: "mysql",
});

const queries = require('./queries.js');



// const validateTest = (request, response, next) => { //revisar

//         console.log(request);
//         next();
  

// }


//----------------------------middlewares
const jwt = require('jsonwebtoken');
const signature = "token_Generator_3402921GtFDnL"; //sacar?

function splitToken(token) {
    try {
        let getToken = token.split(' ')[1];
        return getToken;
    } catch (error) {
        return false;
    }
}

const validateUser = (request, response, next) => { //revisar

    let Token = request.headers.authorization;

    console.log(request.path);

    const token = splitToken(Token);
    console.log(token);

    if (!token) {
        response.status(401).json({ msj: 'Token missing' });
        return;
    }


    try { //revisar funcionamiento

        let verifyToken = jwt.verify(token, signature);
        // console.log(verifyToken);


        // if(decodedToken){
        request.userId = verifyToken.id;
        request.admin = verifyToken.admin;
        console.log(verifyToken);
        console.log(request.userId);
        console.log(request.admin);
        next();
        // }else{
        //     throw "No permmision"; //??
        // }
    } catch (error) {
        response.status(401).json({ msj: 'Invalid login' }); //cambiar mensaje
    }
}



//validar admin
const validateAdmin = (request, response, next) => {
    if (request.admin == 'true') {
        next();
    } else {
        response.status(403).json({ msj: 'forbidden' }); //cambiar mensaje
    }
}


//-----------------fin middlewares---------------------



const getProducts = async (request, response) => {

    // sequelize.query("SELECT * FROM products",
    //     { type: sequelize.QueryTypes.SELECT }
    // ).then(data => {
    //     response.json({ data: data });
    // });

    let data = await queries.getAllProducts();
    response.json({ data: data });

}


const getProductById = async (request, response) => { //hace falta?
    const id = request.params.id;

    // sequelize.query("SELECT * FROM products WHERE id = ?",
    //     { replacements: [id], type: sequelize.QueryTypes.SELECT }
    // ).then(data => {
    //     response.json({ data: data[0] });
    // });
    let data = await queries.getOneProduct(id);
    response.json({ data: data});

}



module.exports = {
    splitToken: splitToken, //sacar porque esta en el mismo archivo?
    validateUser: validateUser,
    validateAdmin: validateAdmin,
    getProducts: getProducts,
    getProductById: getProductById
    // validateTest: validateTest
};