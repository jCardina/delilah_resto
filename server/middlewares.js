
const jwt = require('jsonwebtoken');
const signature = "token_Generator_3402921GtFDnL";

const serverErrorHandler = (error, request, response, next) => {

    console.log('ERROR:', error);
    response.status(500).json({ msg: "An error occurred trying to process your request" });
}


const validateUser = (request, response, next) => {

    let token = request.headers.authorization;

    console.log(request.path);

    try {
        token = token.split(' ')[1];

        let verifyToken = jwt.verify(token, signature);

        request.userId = verifyToken.id;
        request.admin = verifyToken.admin;

        console.log(verifyToken);
        console.log(request.userId);
        console.log(request.admin);

        next();

    } catch (error) {
        response.status(401).json({ msg: 'Token missing or invalid' });
    }
}


const validateAdmin = (request, response, next) => {
    if (request.admin == 'true') {
        next();
    } else {
        response.status(403).json({ msg: 'Forbidden' });
    }
}


module.exports = {
    signature: signature,
    serverErrorHandler: serverErrorHandler,
    validateUser: validateUser,
    validateAdmin: validateAdmin
}

