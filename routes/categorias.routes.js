const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos, validarJWT, isAdminRole } = require("../middlewares");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categorias.controller");
const { existeCategoriaPorID } = require("../helpers/db-validators");

const router = Router();

/**
 * {{url}}/api/categorias
 */

// Obtener todas las categorias - publico
router.get("/", getCategories);

// Obtener una categoria por id - publico
router.get(
  "/:id",
  [
    check("id", "Id invalido").isMongoId(),
    check("id").custom(existeCategoriaPorID),
    validarCampos,
  ],
  getCategory
);

// Crear una nueva categoria - privado - cualquiera con un token valido
router.post(
  "/",
  [
    validarJWT,
    check("name", "El nombre (name) es requerido").not().isEmpty(),
    validarCampos,
  ],
  createCategory
);

// Actualizar una categoria por id - privado - cualquiera con un token valido
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "Id invalido").isMongoId(),
    check("name", "El nombre (name) es requerido").notEmpty(),
    check("id").custom(existeCategoriaPorID),
    validarCampos,
  ],
  updateCategory
);

// Borrar una categoria por id - Admin
router.delete(
  "/:id",
  [
    validarJWT,
    check("id", "Id invalido").isMongoId(),
    isAdminRole,
    check("id").custom(existeCategoriaPorID),
    validarCampos,
  ],
  deleteCategory
);

module.exports = router;
