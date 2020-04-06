const jwt = require('jsonwebtoken');
const signature = "token_Generator_3402921GtFDnL";

const serverErrorHandler = (error, request, response, next) => {

    console.log('ERROR:', error);
    response.status(500).json({ msg: "An error occurred trying to process your request" });
}


const validateUser = (request, response, next) => {

    let token = request.headers.authorization;

    try {
        token = token.split(' ')[1];

        let verifyToken = jwt.verify(token, signature);

        request.userId = verifyToken.id;
        request.admin = verifyToken.admin;

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


const validateBodyProducts = (request, response, next) => {

    let { name, keyword, price, photo_url, stock } = request.body;

    const validations = [
        {
            property: name,
            pattern: "^(?=.*[A-Za-z])[a-zA-ZñÑáéíóúÁÉÍÓÚü][a-zA-ZñÑáéíóúÁÉÍÓÚü ]{3,28}[a-zA-ZñÑáéíóúÁÉÍÓÚü]$",
            msg: "Product name must contain between 3 and 30 characters, at least one letter, no numbers; Special characters allowed: spaces, '´' accented vowels, 'ñ'"
        },
        {
            property: keyword,
            pattern: "^(?=.*[A-Za-z])[a-zA-Z_-]{3,10}$",
            msg: "Keyword must contain between 3 and 10 characters, at least one letter, no numbers, no spaces; Special characters allowed: '-', '_'"
        },
        {
            property: price,
            pattern: "^[0-9]{1,}([.][0-9]{1,2})?$",
            msg: "Price must contain at least 1 digit, use '.' to separate decimals (up to two digits)"
        },
        {
            property: photo_url,
            pattern: "^(http(s)?://|www[.])[a-zA-Z0-9\\.\\-_]{2,30}[.][a-z]{2,3}([.][a-z]{2,3})?([/][a-zA-Z0-9%/_\\&\\#\\-\\.\\?\\!\\+\\=\\,]{1,})?$",
            msg: "Invalid URL format"
        },
        {
            property: stock,
            pattern: "^[0-9]{1,7}$",
            msg: "Stock must be an integer, minimum value: 0"
        }
    ]

    if (request.method == 'POST') {

        //check that all required table columns are sent to create a product
        if (name == undefined || keyword == undefined || price == undefined || photo_url == undefined || stock == undefined) {

            response.status(400).send();
            return;
        }

    } else {

        //check that at least one table column is sent to update a product
        if (name == undefined && keyword == undefined && price == undefined && photo_url == undefined && stock == undefined) {

            response.status(400).send();
            return;
        }
    }

    //check request.body information format
    for (i = 0; i < validations.length; i++) {

        let exp = new RegExp(validations[i].pattern);
        let toCheck = validations[i].property;

        let valid = exp.test(toCheck);

        if (toCheck != undefined && !valid) {
            response.status(422).json({ msg: validations[i].msg });
            return;
        }
    }

    next();
}


const validateBodyUsers = (request, response, next) => {

    let { name, username, email, address, phone_number, password } = request.body;

    const validations = [
        {
            property: name,
            pattern: "^(?=.*[A-Za-z])[a-zA-ZñÑáéíóúÁÉÍÓÚü][a-zA-ZñÑáéíóúÁÉÍÓÚü ]{5,38}[a-zA-ZñÑáéíóúÁÉÍÓÚü]$",
            msg: "Name must contain between 5 and 40 characters, at least one letter, no numbers; Special characters allowed: spaces, '´' accented vowels, 'ñ'"
        },
        {
            property: username,
            pattern: "^(?=.*[A-Za-z])[a-zA-Z0-9_-]{6,15}$",
            msg: "Username must contain between 6 and 15 characters, at least one letter, numbers allowed, no spaces; Special characters allowed: '-', '_'"
        },
        {
            property: email,
            pattern: "^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$",
            msg: "Invalid email format"
        },
        {
            property: address,
            pattern: "^(?=.*[A-Za-z])[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚü ]{5,50}$",
            msg: "Address must contain between 5 and 50 characters, at least one letter, numbers allowed; Special characters allowed: spaces, '´' accented vowels, 'ñ'"
        },
        {
            property: phone_number,
            pattern: "^[0-9]{2,4}[ ][0-9]{7,10}$",
            msg: "Phone number format: area code, space, 7 to 10 digits"
        },
        {
            property: password,
            pattern: "^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9_-]{8,20}$",
            msg: "Pasword must be at least 8 characters, at least one letter and one number; Special characters allowed: '-', '_'"
        }
    ];


    if (request.method == 'POST') {

        //check that all required table columns are sent to create a user
        if (name == undefined || username == undefined || email == undefined || password == undefined) {

            response.status(400).send();
            return;
        }

        if (!request.admin && (address == undefined || phone_number == undefined)) {

            response.status(400).send();
            return;
        }

    } else {

        //check that at least one table column is sent to update a user
        if (name == undefined && username == undefined && email == undefined && address == undefined && phone_number == undefined && password == undefined) {

            response.status(400).send();
            return;
        }
    }

    //check request.body information format
    for (i = 0; i < validations.length; i++) {

        let exp = new RegExp(validations[i].pattern);
        let toCheck = validations[i].property;

        let valid = exp.test(toCheck);

        if (toCheck != undefined && !valid) {
            response.status(422).json({ msg: validations[i].msg });
            return;
        }
    }

    next();
}


const validateBodyOrders = (request, response, next) => {

    if (request.method == 'PATCH') {

        const { status } = request.body;

        //check that status is sent and valid to update an order
        if (status != "nuevo" && status != "confirmado" && status != "preparando" && status != "enviando" && status != "entregado" && status != "cancelado") {

            response.status(400).json({ msg: "Order status missing or invalid. Valid options: 'nuevo', 'confirmado', 'preparando', 'enviando', 'entregado', 'cancelado'" });
            return;

        } else {
            return next();
        }
    }

    let { products, payment_method } = request.body;

    //check that products list is sent to create an order
    if (typeof (products) != "object" || products.length == undefined || products.length < 1) {
        response.status(400).json({ msg: "List of products missing" });
        return;
    }

    //check that payment method is sent and valid to create an order
    if (payment_method != "efectivo" && payment_method != "tarjeta") {
        response.status(400).json({ msg: "Payment method missing or invalid. Valid options: 'efectivo', 'tarjeta'" });
        return;
    }

    let idProductsOrdered = [];

    for (i = 0; i < products.length; i++) {

        let validations = [
            {
                property: products[i].id,
                pattern: "^[0-9]{1,9}$",
                msg: "Product id must be an integer between 1 and 9 digits, minimum value: 1"
            },
            {
                property: products[i].quantity,
                pattern: "^[0-9]{1,2}$",
                msg: "Quantity must be an integer between 1 and 2 digits, minimum value: 1"
            }
        ];

        //check format and content of each product object
        for (x = 0; x < validations.length; x++) {

            let exp = new RegExp(validations[x].pattern);
            let toCheck = validations[x].property;

            let valid = exp.test(toCheck);

            if (!valid || toCheck < 1) {
                response.status(422).json({ msg: validations[x].msg });
                return;
            }
        }

        //check that there are no repeated products
        for (j = 0; j < idProductsOrdered.length; j++) {

            if (products[i].id == idProductsOrdered[j]) {
                response.status(400).json({ msg: "Each product can only be sent once per order" });
                return;
            }
        }

        idProductsOrdered.push(products[i].id);
    }

    next();
}


module.exports = {
    signature: signature,
    serverErrorHandler: serverErrorHandler,
    validateUser: validateUser,
    validateAdmin: validateAdmin,
    validateBodyProducts: validateBodyProducts,
    validateBodyUsers: validateBodyUsers,
    validateBodyOrders: validateBodyOrders
}
