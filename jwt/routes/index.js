var express = require("express");
// Cargamos el módulo de mongoose para poder conectarnos a MongoDB
var mongoose = require("mongoose");

var HandlerGenerator = require("../handlegenerator.js");

var middleware = require("../middleware.js");

var router = express.Router();

// Le indicamos a Mongoose que haremos la conexión con Promesas
mongoose.Promise = global.Promise;

// Usamos el método connect para conectarnos a nuestra base de datos
mongoose
  .connect(
    "mongodb+srv://admin:admin@clusterjwt.x1ipl.mongodb.net/reto_jwt?retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true }
  )
  .then(() => {
    console.log(
      "La conexión a la base de datos reto_jwt se ha realizado correctamente"
    );
  })
  // Si no se conecta correctamente escupimos el error
  .catch((err) => console.log(err));
HandlerGenerator = new HandlerGenerator();

/* GET home page. */
router.get("/", middleware.checkToken, HandlerGenerator.index);

router.post("/login", HandlerGenerator.login);

module.exports = router;
