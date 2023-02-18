const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "Invalid token",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(401).json({
        msg: "Invalid token - user don't exist",
      });
    }

    // Verificar si el usuario tiene status en true
    if (!usuario.status) {
      return res.status(401).json({
        msg: "Invalid token - status: false",
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Invalid token",
    });
  }
};

module.exports = {
  validarJWT,
};
