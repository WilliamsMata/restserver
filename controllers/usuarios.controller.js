const { request, response } = require("express");

const usuariosGet = (req = request, res = response) => {
  const { q, nombre = "No name", apikey } = req.query;

  res.json({
    message: "GET API - controlador",
    q,
    nombre,
    apikey,
  });
};

const usuariosPost = (req, res) => {
  const { nombre, edad } = req.body;

  res.status(201).json({
    message: "POST API - controlador",
    nombre,
    edad,
  });
};

const usuariosPut = (req, res) => {
  const { id } = req.params;

  res.json({
    message: "PUT API - controlador",
    id,
  });
};

const usuariosPatch = (req, res) => {
  res.json({
    message: "PATCH API - controlador",
  });
};

const usuariosDelete = (req, res) => {
  res.json({
    message: "DELETE API - controlador",
  });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
};
