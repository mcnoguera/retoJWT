let jwt = require("jsonwebtoken");
let config = require("./config");
var User = require("./src/models/user_model.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Clase encargada de la creación del token
class HandlerGenerator {
  async login(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        console.log("Contraseña encriptada " + hash);
      });
    });
    try {
      let userDoc = User.findOne(
        { username: { $gte: username } },
        (err, user) => {
          if (err) return null;
          if (!user) return null;
          if (user) return user;
        }
      );
      userDoc.then( async (value)   => {
        if (value != null) {
          if (username && password) {
            // Si los usuarios y las contraseñas coinciden, proceda con la generación del token
            // de lo contrario, un mensaje de error es retornado

            // let passwordMatch =  hash === value["password"]
            let passwordMatch =  await bcrypt.compare(password,value["password"])
            if (
              username === value["username"] &&
              passwordMatch
              // password === value["password"]
            ) {
              // Se genera un nuevo token para el nombre de usuario el cuál expira en 24 horas
              let token = jwt.sign({ username: username }, config.secret, {
                expiresIn: "24h",
              });

              // Retorna el token el cuál debe ser usado durante las siguientes solicitudes
              res.json({
                success: true,
                message: "Authentication successful!",
                token: token,
                role: value["role"],
              });
            } else {
              res.sendStatus(403).json({
                success: false,
                message: "Incorrect username or password",
              });
            }
          }
        } else {
          res.sendStatus(403).json({
            success: false,
            message: "Incorrect username or password",
          });
        }
        // Si se especifico un usuario y contraseña, proceda con la validación
        // de lo contrario, un mensaje de error es retornado
      });
    } catch (error) {
      console.log(error);
      res.sendStatus(400).json({
        success: false,
        message: "Authentication failed! Please check the request",
      });
    }
  }

  index(req, res) {
    // Retorna una respuesta exitosa con previa validación del token
    res.json({
      success: true,
      message: "Index page",
    });
  }
}

module.exports = HandlerGenerator;
