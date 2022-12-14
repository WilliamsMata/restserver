const { request, response } = require("express");
const bcrypt = require("bcryptjs");

// importamos el modelo de usuario
const Usuario = require("../models/usuario");

// obtener usuarios
const usuariosGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { status: true };

  // ejecutamos 2 funciones asíncronas al mismo tiempo
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    total,
    usuarios,
  });
};

// Crear usuario
const usuariosPost = async (req, res) => {
  // recibimos los datos del body
  const { nombre, email, password, role } = req.body;

  // creamos un nuevo usuario
  const usuario = new Usuario({
    nombre,
    email,
    password,
    role,
  });

  // Encriptar la contraseña
  const salt = bcrypt.genSaltSync();
  usuario.password = bcrypt.hashSync(password, salt);

  // guardamos el usuario en mongo
  await usuario.save();

  // realizamos la respuesta
  res.status(201).json(usuario);
};

// Editar usuario
const usuariosPut = async (req, res) => {
  const { id } = req.params;
  const { _id, password, google, email, ...resto } = req.body;

  if (password) {
    // Encriptar la contraseña
    const salt = bcrypt.genSaltSync();
    resto.password = bcrypt.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json(usuario);
};

const usuariosPatch = (req, res) => {
  res.json({
    message: "PATCH API - controlador",
  });
};

// Eliminar usuario
const usuariosDelete = async (req, res) => {
  const { id } = req.params;

  // Físicamente lo borramos de la base de datos
  // const usuario = await Usuario.findByIdAndDelete(id);

  // cambiamos el status a false
  const usuario = await Usuario.findByIdAndUpdate(id, { status: false });

  res.json(usuario);
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
};
