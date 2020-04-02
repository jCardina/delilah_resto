
const jwt = require('jsonwebtoken');
const signature = "token_Generator_3402921GtFDnL";

const serverErrorHandler = (error, request, response, next) => { //revisar!!!!!!

    // if (!error) {
    //     return next(); //hace falta?
    // }
    console.log('ERROR:', error);
    response.status(500).json({ msg: "An error occurred trying to process your request" });
}

// const splitToken = (token) => {
//     try {
//         let getToken = token.split(' ')[1];
//         return getToken;
//     } catch (error) {
//         return false;
//     }
// }

const validateUser = (request, response, next) => { //revisar

    let token = request.headers.authorization;

    console.log(request.path);

    try { //revisar funcionamiento
        // const token = splitToken(Token);
        token = token.split(' ')[1];
        // console.log(token);

        // if (!token) {
        //     response.status(401).json({ msg: 'Token missing' });
        //     return;
        // }

        let verifyToken = jwt.verify(token, signature);

        request.userId = verifyToken.id;
        request.admin = verifyToken.admin;

        console.log(verifyToken);
        console.log(request.userId);
        console.log(request.admin);

        next();

    } catch (error) {
        response.status(401).json({ msg: 'Token missing or invalid' }); //cambiar mensaje
    }
}



//validar admin
const validateAdmin = (request, response, next) => {
    if (request.admin == 'true') {
        next();
    } else {
        response.status(403).json({ msg: 'Forbidden' }); //cambiar mensaje?
    }
}


module.exports = {
    serverErrorHandler: serverErrorHandler,
    signature: signature,
    validateUser: validateUser,
    validateAdmin: validateAdmin
}

