// Cargamos los modelos para usarlos posteriormente
var User = require("../models/user_model.js");

// Conseguir datos de un usuario
 function getUser( username) {

  //buscar un documento por un  id
  return User.findById(username, (err, user) => {
    if (err) return null;
    if (!user) return null;
    if (user) return user;
  });
}
module.export= { getUser };

