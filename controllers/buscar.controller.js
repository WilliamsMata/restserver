const { request, response } = require("express");
const { isValidObjectId } = require("mongoose");

const { Usuario, Categoria, Producto } = require("../models");

const coleccionesPermitidas = ["usuarios", "categorias", "productos", "roles"];

const buscarUsuarios = async (termino = "", res = response) => {
  const esMongoId = isValidObjectId(termino);

  if (esMongoId) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      results: usuario ? [usuario] : [],
    });
  }

  const usuarios = await Usuario.find({
    $or: [
      { name: { $regex: termino, $options: "i" } },
      { email: { $regex: termino, $options: "i" } },
    ],
    $and: [{ status: true }],
  });

  res.json({
    results: usuarios,
  });
};

const buscarCategorias = async (termino = "", res = response) => {
  const esMongoId = isValidObjectId(termino);

  if (esMongoId) {
    const categoria = await Categoria.findById(termino).populate(
      "user",
      "name"
    );
    return res.json({
      results: categoria ? [categoria] : [],
    });
  }

  const categorias = await Categoria.find({
    name: { $regex: termino, $options: "i" },
    $and: [{ status: true }],
  }).populate("user", "name");

  res.json({
    results: categorias,
  });
};

const buscarProductos = async (termino = "", res = response) => {
  const esMongoId = isValidObjectId(termino);

  if (esMongoId) {
    const producto = await Producto.findById(termino)
      .populate("user", "name")
      .populate("category", "name");
    return res.json({
      results: producto ? [producto] : [],
    });
  }

  const productos = await Producto.find({
    name: { $regex: termino, $options: "i" },
    $and: [{ status: true }],
  })
    .populate("user", "name")
    .populate("category", "name");

  res.json({
    results: productos,
  });
};

const buscar = (req = request, res = response) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case "usuarios":
      buscarUsuarios(termino, res);
      break;
    case "categorias":
      buscarCategorias(termino, res);
      break;
    case "productos":
      buscarProductos(termino, res);
      break;

    default:
      res.status(500).json({
        msg: "Se le olvido hacer esta búsqueda",
      });
      break;
  }
};

module.exports = {
  buscar,
};
