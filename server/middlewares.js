
const jwt = require('jsonwebtoken');
const signature = "token_Generator_3402921GtFDnL";

const serverErrorHandler = (error, req, res, next) => {
    
    if(!error) {
        
        return next();
    }
    console.log('There has been an error', error);
    res.status(500).send('Error');
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


module.exports = {
    // splitToken: splitToken, //sacar porque esta en el mismo archivo?
    serverErrorHandler: serverErrorHandler,
    signature: signature,
    validateUser: validateUser,
    validateAdmin: validateAdmin
}

