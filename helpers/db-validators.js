const { Categoria, Role, Usuario, Producto } = require("../models");

//validamos si no existe el rol en la base de datos
const esRolValido = async (role = "") => {
  // buscamos si existe el rol en la base de datos
  const existeRol = await Role.findOne({ role });

  // si no existe retornamos un error
  if (!existeRol)
    throw new Error(`El rol ${role} no esta registrado en la base de datos`);
};

// validamos si existe el email
const existeEmail = async (email = "") => {
  //buscamos si existe el email en la base de datos
  const existeEmailDB = await Usuario.findOne({ email });

  // Si existe retornamos un error
  if (existeEmailDB) throw new Error(`El correo ${email} ya esta registrado`);
};

// validamos si existe el usuario con su respectivo id
const existeUsuarioPorID = async (id = "") => {
  //buscamos si existe el usuario con el id en la base de datos
  const existeEmailDB = await Usuario.findById(id);

  // Si no existe retornamos un error
  if (!existeEmailDB) throw new Error(`El usuario con el id ${id} no existe`);
};

// validamos si existe la categoria con su respectivo id
const existeCategoriaPorID = async (id = "") => {
  //buscamos si existe la categoria con el id en la base de datos
  const existeCategoriaDB = await Categoria.findById(id);

  // Si no existe retornamos un error
  if (!existeCategoriaDB)
    throw new Error(`La categoria con el id ${id} no existe`);
};

// validamos si existe el producto con su respectivo id
const existeProductoPorID = async (id = "") => {
  //buscamos si existe la categoria con el id en la base de datos
  const existeProductoDB = await Producto.findById(id);

  // Si no existe retornamos un error
  if (!existeProductoDB)
    throw new Error(`El producto con el id ${id} no existe`);
};

module.exports = {
  esRolValido,
  existeEmail,
  existeUsuarioPorID,
  existeCategoriaPorID,
  existeProductoPorID,
};
