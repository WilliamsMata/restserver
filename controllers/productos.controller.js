const { request, response } = require("express");
const { Producto } = require("../models");

const getProducts = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;

  const query = { status: true };

  try {
    // ejecutamos 2 funciones asíncronas al mismo tiempo
    const [total, productos] = await Promise.all([
      Producto.countDocuments(query),
      Producto.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
        .populate("user", "name")
        .populate("category", "name"),
    ]);

    return res.status(200).json({
      total,
      productos,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const getProduct = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const producto = await Producto.findById(id)
      .populate("user", "name")
      .populate("category", "name");

    return res.status(200).json(producto);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const createProduct = async (req = request, res = response) => {
  const { status, user, ...body } = req.body;

  const productDB = await Producto.findOne({
    name: body.name.toUpperCase(),
    category: body.category,
  });

  if (productDB) {
    return res.status(400).json({ error: "Producto ya existe" });
  }

  const data = {
    ...body,
    name: body.name.toUpperCase(),
    user: req.usuario._id,
  };

  const producto = new Producto(data);

  // guardar en DB
  await producto.save();

  res.status(201).json(producto);
};

const updateProduct = async (req = request, res = response) => {
  const { id } = req.params;
  const { status, user, ...data } = req.body;

  if (data.name) {
    data.name = data.name.toUpperCase();
  }

  data.user = req.usuario._id;

  try {
    const producto = await Producto.findByIdAndUpdate(id, data, {
      new: true,
    })
      .populate("user", "name")
      .populate("category", "name");

    return res.status(200).json(producto);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const deleteProduct = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const producto = await Producto.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );

    return res.status(200).json({
      msg: "Producto eliminada",
      producto,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
