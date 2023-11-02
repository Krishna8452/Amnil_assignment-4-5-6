const port = 5000;
const express = require("express");
const { default: mongoose } = require("mongoose");
const cors = require('cors');
const bodyParser = require("body-parser")
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
app.use(express.json());
app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");
const cartRouter = require("./routes/cartRouter")

app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/carts", cartRouter);

  
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'This is Node express api for Ecommerce',
      version: '1.0.0',
      description:'this is a api for ecommerce web application'
    },
    servers: [
      {
        url: `http://localhost:${port}`
      }
    ]
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
