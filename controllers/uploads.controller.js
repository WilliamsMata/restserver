const path = require("path");
const fs = require("fs");

const { request, response } = require("express");
const { subirArchivo } = require("../helpers");

const { Usuario, Producto } = require("../models");

const cargarArchivo = async (req = request, res = response) => {
  try {
    // txt, md
    // const nombre = await subirArchivo(req.files, ["txt", "md"], "textos");
    const nombre = await subirArchivo(req.files, undefined, "imgs");
    res.json({ nombre });
  } catch (msg) {
    res.status(400).json({ msg });
  }
};

const actualizarImagen = async (req = request, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);

      if (!modelo) {
        return res.status(400).json({ msg: "No existe el usuario" });
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);

      if (!modelo) {
        return res.status(400).json({ msg: "No existe el producto" });
      }
      break;

    default:
      return res.status(500).json({
        msg: "Se me olvido validar esto",
      });
  }

  // Limpiar imagenes previas
  if (modelo.img) {
    // Hay que borrar la imagen del servidor
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );

    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen);
    }
  }

  try {
    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();
  } catch (msg) {
    return res.status(404).json({ msg });
  }

  res.json(modelo);
};

module.exports = {
  cargarArchivo,
  actualizarImagen,
};
