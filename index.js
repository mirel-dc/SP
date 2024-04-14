const express = require("express");
const routes = require("./routes");
const db_connection = require("./dbConnection");
const app = express();
app.use(express.json());
app.use(routes);

app.get("/", function (req, res) {
  routes.get();
  db_connection.query();
});

// Handling Errors
app.use((err, req, res, next) => {
  // console.log(err);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({
    message: err.message,
  });
});

app.listen(3000, () => console.log("Server is running on port 3000"));
