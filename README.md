# Delilah Resto API

An API for food delivery services.

## Requirements

### Node.js

Download the installer from the official [Node.js website](https://nodejs.org).

## Starting the server

### Server configuration

1. Install all required dependencies with the command

```
npm install
```

2. Set new `signature` for jsonwebtoken in [middlewares.js](./server/middlewares.js)

### Database configuration

3. Create a new SQL database
4. Import [delila_db.sql](./server/database/delila_db.sql)
5. Set database credentials for `sequelize` in [queries.js](./server/queries.js)
6. Set new timezone if required

#### Bulk insertion of products (optional)

- Edit or replace [products.csv](./server/database/products.csv) following the provided format to add products.
- Character encoding must be UTF-8 for special characters to be processed correctly.
- Run [load_products.js](./server/load_products.js)

```
node load_products
```

### Start the server

7. Use the command

```
node index
```

## Documentation

For request/response format details and available paths refer to the [documentation](./documentation/spec.yaml).

### Default database admin credentials

- username: admin_1
- password: cSkdlRF_9462

### Accepted values for type-string properties

#### Products

| Property  | Length   | Must contain | Allowed                                | Example                             |
| ----------| ---------| -------------| ---------------------------------------| ------------------------------------|
| name      | 3 to 30  | 1 a-z or A-Z | a-z, A-Z, " ", ñÑ, áÁ, éÉ, íÍ, óÓ, úÚü | Chicken Wrap                        |
| keyword   | 3 to 10  | 1 a-z or A-Z | a-z, A-Z, -, _                         | chckn_wrap                          |
| photo_url | 8 to 300 | --           | most standard URLs                     | http://domain.com/product-photo.jpg |

#### Users

| Property     | Length   | Must contain           | Allowed                                          | Example                 |
| -------------| ---------| -----------------------| -------------------------------------------------| ------------------------|
| name         | 5 to 40  | 1 a-z or A-Z           | a-z, A-Z, " ", ñÑ, áÁ, éÉ, íÍ, óÓ, úÚü           | John Smith              |
| username     | 6 to 15  | 1 a-z or A-Z           | a-z, A-Z, 0-9, -, _                              | john_Smith14            |
| email        | 8 to 300 | --                     | most standard email addresses                    | john_smith356@email.com |
| address      | 5 to 100 | 1 a-z or A-Z           | a-z, A-Z, 0-9, " ", ",", ñÑ, áÁ, éÉ, íÍ, óÓ, úÚü | Street Name 123, City   |
| phone_number | 10 to 15 | --                     | area code + space + number                       | 11 23456789             |
| password     | 8 to 20  | 1 a-z or A-Z and 1 0-9 | a-z, A-Z, 0-9, -, _                              | Pass-_word64            |

#### Orders

| Property       | Allowed values                                                |
| ---------------| --------------------------------------------------------------|
| payment_method | efectivo, tarjeta                                             |
| status         | nuevo, confirmado, preparando, enviando, entregado, cancelado |
