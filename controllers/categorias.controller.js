const { request, response } = require("express");
const { Categoria } = require("../models");

const getCategories = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;

  const query = { status: true };

  try {
    // ejecutamos 2 funciones asíncronas al mismo tiempo
    const [total, categorias] = await Promise.all([
      Categoria.countDocuments(query),
      Categoria.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
        .populate("user", "name"),
    ]);

    return res.status(200).json({
      total,
      categorias,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const getCategory = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const category = await Categoria.findById(id).populate("user", "name");

    return res.status(200).json(category);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const createCategory = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();

  const categoryDB = await Categoria.findOne({ name });

  if (categoryDB) {
    if (categoryDB.status === false) {
      categoryDB.status = true;
      categoryDB.user = req.usuario._id;

      await categoryDB.save();

      return res.status(201).json(categoryDB);
    } else {
      return res.status(404).json({
        msg: `The ${categoryDB.name} category already exists`,
      });
    }
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

const updateCategory = async (req = request, res = response) => {
  const { id } = req.params;
  const { status, user, ...data } = req.body;

  data.name = data.name.toUpperCase();
  data.user = req.usuario._id;

  try {
    const categoryDB = await Categoria.findByIdAndUpdate(id, data, {
      new: true,
    }).populate("user", "name");

    return res.status(200).json(categoryDB);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const deleteCategory = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const category = await Categoria.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );

    return res.status(200).json({
      msg: "Categoria eliminada",
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
