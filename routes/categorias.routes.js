const { Router } = require("express");
const { check } = require("express-validator");
const { createCategory } = require("../controllers/categorias.controller");

const { validarCampos, validarJWT } = require("../middlewares");

const router = Router();

/**
 * {{url}}/api/categorias
 */

// Obtener todas las categorias - publico
router.get("/", (req, res) => {
  res.json("Get");
});

// Obtener una categoria por id - publico
router.get("/:id", (req, res) => {
  res.json("Get");
});

// Crear una nueva categoria - privado - cualquiera con un token valido
router.post(
  "/",
  [
    validarJWT,
    check("name", "Name is required").not().isEmpty(),
    validarCampos,
  ],
  createCategory
);

// Actualizar una categoria por id - privado - cualquiera con un token valido
router.put("/:id", (req, res) => {
  res.json("Put");
});

// Borrar una categoria por id - Admin
router.delete("/:id", (req, res) => {
  res.json("Delete");
});

module.exports = router;
