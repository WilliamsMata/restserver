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

  try {
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
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error",
      error,
    });
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
