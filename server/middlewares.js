
const jwt = require('jsonwebtoken');
const signature = "token_Generator_3402921GtFDnL";

const serverErrorHandler = (error, request, response, next) => { //revisar!!!!!!
    
    if(!error) {
        
        return next(); //hace falta?
    }
    console.log('There has been an error', error);
    response.status(500).send();
}

const splitToken = (token) => {
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
        response.status(401).json({ msg: 'Token missing' });
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
        response.status(401).json({ msg: 'Invalid login' }); //cambiar mensaje
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
    // splitToken: splitToken, //sacar porque esta en el mismo archivo?
    serverErrorHandler: serverErrorHandler,
    signature: signature,
    validateUser: validateUser,
    validateAdmin: validateAdmin
}

