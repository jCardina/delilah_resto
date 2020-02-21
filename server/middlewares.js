// const invalid = "invalid";

const jwt = require('jsonwebtoken');
const signature = "token_Generator_3402921GtFDnL";


const validateUser = (request, response, next) => { //revisar
    
    function splitToken() {
        try {
            let getToken = request.headers.authorization.split(' ')[1];
            return getToken;
        } catch(error) {
            response.status(401).json({msj: 'Token missing'});
            return false;
        }
    }


    const token =  splitToken();
    console.log(token);

    if(!token) {
        return;
    }

    
    try { //revisar funcionamiento
        
        let verifyToken = jwt.verify(token, signature);

        
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
        response.status(401).json({msj: 'Invalid login'}); //cambiar mensaje
    }                  
}

const validateSameUser = (request, response, next) => {
    const id = request.params.id;

    if(request.userId == id) {
        next();
    } else {
        response.status(403).json({msj: 'forbidden'}); //cambiar mensaje
    }
}


//validar admin
const validateAdmin = (request, response, next) => {
    if(request.admin) {
        next();
    } else {
        response.status(403).json({msj: 'forbidden'}); //cambiar mensaje
    }
}

module.exports.validateUser = validateUser;
module.exports.validateAdmin = validateAdmin;
module.exports.validateSameUser = validateSameUser;