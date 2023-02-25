const { request, response } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");
const { genJWT } = require("../helpers/genJWT");

const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    // Verifica si el email existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        msg: "Incorrect credentials",
      });
    }

    // Verificar si el usuario esta activo en la base de datos
    if (!usuario.status) {
      return res.status(400).json({
        msg: "Incorrect credentials",
      });
    }

    // Verificar la contraseña
    const isValidPassword = bcryptjs.compareSync(password, usuario.password);
    if (!isValidPassword) {
      return res.status(400).json({
        msg: "Incorrect credentials",
      });
    }

    // Generar el JWT
    const token = await genJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: "There was a server error processing your request. Please try again later or contact support if the problem persists.",
    });
  }
};

const googleSingIn = async (req = request, res = response) => {
  const { id_token } = req.body;

  res.json({
    msg: "todo ok en google sign in",
    id_token,
  });
};

module.exports = {
  login,
  googleSingIn,
};
