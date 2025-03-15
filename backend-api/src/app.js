const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const JSend = require("./jsend");
const path = require('path');

const orderRouter = require("./routes/orders.router");
const usersRouter = require("./routes/users.router"); // modify
const cartsRouter = require("./routes/carts.router") // mới thêm
const productsRouter = require("./routes/products.router"); // mới thêm

const app = express();
const { specs, swaggerUi } = require("./docs/swagger");
const {
  resourceNotFound,
  handleError,
} = require("./controllers/errors.controller");
app.use(cookieParser()); // Thêm cookie-parser để sử dụng cookie
app.use(cors({
  origin: ['https://dthanh2306.github.io/SmartphoneStore/','http://localhost:5173','https://localhost' ], // Hoặc một danh sách các nguồn cụ thể
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  credentials: true, // Cho phép cookie và thông tin xác thực
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.json(JSend.success());
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use('/public/uploads', express.static(path.join(__dirname, 'public/uploads')));

productsRouter.setup(app); // mới thêm
cartsRouter.setup(app); // mới thêm
usersRouter.setup(app); // modify
orderRouter.setup(app);

//Handle 404 response
app.use(resourceNotFound);

//define error-handling middle ...
app.use(handleError);
module.exports = app;
