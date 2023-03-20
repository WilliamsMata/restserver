const { request, response } = require("express");
const { Categoria } = require("../models");

const createCategory = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();

  const categoryDB = await Categoria.findOne({ name });

  if (categoryDB) {
    return res.status(404).json({
      msg: `The ${categoryDB.name} category already exists`,
    });
  }

  // Generar la data a guardar
  const data = {
    name,
    user: req.usuario._id,
  };

  const category = new Categoria(data);

  // Guardar DB
  await category.save();

  res.status(201).json(category);
};

module.exports = {
  createCategory,
};
