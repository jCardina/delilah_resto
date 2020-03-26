// const Sequelize = require('sequelize'); //sacar de este archivo?

// const sequelize = new Sequelize("delilah_db", "root", "", {
//     host: "localhost",
//     dialect: "mysql",
// });

const queries = require('./queries.js');

//sacar?-----
const getUpdatedUser = queries.getUpdatedUser;
const encryptPass = queries.encryptPass;
const updateUser = queries.updateUser;
const checkUser = queries.checkUser;
//--------



// const validateTest = (request, response, next) => { //revisar

//         console.log(request);
//         next();


// }

const postProduct = async (request, response) => {
    let { name, keyword, price, photo_url } = request.body;

    let post = await queries.insertProduct(name, keyword, price, photo_url);
    let newProduct = await queries.getOneProduct(post[0]);
    console.log(post);

    response.status(201).json({data: newProduct}); //que datos devolver?
}


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
        response.status(404).json({ msg: "Producto no encontrado" });
    } else {
        response.status(204).send();
    }

}



module.exports = {
    postProduct: postProduct,
    getProducts: getProducts,
    getProductById: getProductById,
    putProductById: putProductById,
    deleteProductById: deleteProductById
    // validateTest: validateTest
};