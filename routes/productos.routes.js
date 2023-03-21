const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos, validarJWT, isAdminRole } = require("../middlewares");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productos.controller");
const {
  existeProductoPorID,
  existeCategoriaPorID,
} = require("../helpers/db-validators");

const router = Router();

/**
 * {{url}}/api/productos
 */

// Obtener todas las categorias - publico
router.get("/", getProducts);

// Obtener una categoria por id - publico
router.get(
  "/:id",
  [
    check("id", "Id invalido").isMongoId(),
    check("id").custom(existeProductoPorID),
    validarCampos,
  ],
  getProduct
);

// Crear una nueva categoria - privado - cualquiera con un token valido
router.post(
  "/",
  [
    validarJWT,
    check("name", "El nombre (name) es requerido").not().isEmpty(),
    check("price", "El precio debe ser un numero").optional().isNumeric(),
    check("category", "La categoria no es valida").isMongoId(),
    check("category").custom(existeCategoriaPorID),
    validarCampos,
  ],
  createProduct
);

// Actualizar una categoria por id - privado - cualquiera con un token valido
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "Id invalido").isMongoId(),
    check("id").custom(existeProductoPorID),
    check("price", "El precio debe ser un numero").optional().isNumeric(),
    check("available", "Available debe ser un valor booleano")
      .optional()
      .isBoolean(),
    check("category", "La categoria no es valida").optional().isMongoId(),
    check("category").optional().custom(existeCategoriaPorID),
    validarCampos,
  ],
  updateProduct
);

// Borrar una categoria por id - Admin
router.delete(
  "/:id",
  [
    validarJWT,
    isAdminRole,
    check("id", "Id invalido").isMongoId(),
    check("id").custom(existeProductoPorID),
    validarCampos,
  ],
  deleteProduct
);

module.exports = router;
