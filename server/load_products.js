const fs = require('fs');
const queries = require('./queries');
const checkProduct = queries.checkProduct;
const createProduct = queries.createProduct;


const validate = (name, keyword, price, photo_url, stock, row) => {

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
            pattern: "^(http(s)?://|www[.])[a-zA-Z0-9\\.\\-_]{2,50}[.][a-z]{2,3}([.][a-z]{2,3})?([/][a-zA-Z0-9%/_\\&\\#\\-\\.\\?\\!\\+\\=]{1,230})?$",
            msg: "Invalid URL format"
        },
        {
            property: stock,
            pattern: "^[0-9]{1,7}$",
            msg: "Stock must be an integer, minimum value: 0"
        }
    ]

    if (name == undefined || keyword == undefined || price == undefined || photo_url == undefined || stock == undefined) {
        console.log("PRODUCT NOT INSERTED: Properties missing. Content row:", row);
        return false;
    }

    for (j = 0; j < validations.length; j++) {

        let exp = new RegExp(validations[j].pattern);
        let toCheck = validations[j].property;

        let valid = exp.test(toCheck);

        if (!valid) {
            console.log("PRODUCT NOT INSERTED:", validations[j].msg + ". Content row:", row);

            return false;
        }
    }

    let productMatch = checkProduct(name, keyword, 0
    ).then(data => {

        if (data) {
            console.log("PRODUCT NOT INSERTED: Product with the same", data, "already exists. Name:", name + ", keyword:", keyword + ", Content row:", row);
            return false;
        } else {
            return true;
        }
    });

    return productMatch;

}


fs.readFile('./database/products.csv', 'utf8', async (error, data) => {

    if (error) {
        console.log(error);
        return;
    }

    let splitRows = data.split("\r\n");

    try {

        for (i = 1; i < splitRows.length - 1; i++) {

            let productData = splitRows[i].split(",");

            let name = productData[0];
            let keyword = productData[1];
            let price = productData[2];
            let photo_url = productData[3];
            let stock = productData[4];

            let valid = await validate(name, keyword, price, photo_url, stock, i);

            if (valid) {
                let newProduct = await createProduct(name, keyword, price, photo_url, stock);
            }
        }

    } catch (err) {
        console.log("Database error:", err);
    }
});
