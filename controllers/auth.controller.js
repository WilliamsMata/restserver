const { request, response } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");
const { genJWT } = require("../helpers/genJWT");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    // Verifica si el email existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        msg: "Credenciales incorrectas",
      });
    }

    // Verificar si el usuario esta activo en la base de datos
    if (!usuario.status) {
      return res.status(400).json({
        msg: "Credenciales incorrectas",
      });
    }

    // Verificar la contraseña
    const isValidPassword = bcryptjs.compareSync(password, usuario.password);
    if (!isValidPassword) {
      return res.status(400).json({
        msg: "Credenciales incorrectas",
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
      msg: "Hubo un error en el servidor al procesar su solicitud. Vuelva a intentarlo más tarde o póngase en contacto con el soporte si el problema persiste.",
    });
  }
};

const googleSingIn = async (req = request, res = response) => {
  const { id_token } = req.body;

  try {
    const { name, email, picture: img } = await googleVerify(id_token);

    let usuario = await Usuario.findOne({ email });

    if (!usuario) {
      // crear el usuario
      const data = {
        name,
        email,
        password: ":P",
        img,
        google: true,
      };
      usuario = new Usuario(data);
      await usuario.save();
    }

    // Si el usuario en DB tiene el status en false
    if (!usuario.status) {
      return res.status(401).json({
        msg: "Hable con el administrador, usuario bloqueado",
      });
    }

    // Generar el JWT
    const token = await genJWT(usuario.id);

    res.json({ usuario, token });
  } catch (error) {
    res.status(400).json({
      msg: "Token de Google no es valido",
    });
  }
};

module.exports = {
  login,
  googleSingIn,
};
