const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");

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
router.post("/", (req, res) => {
  res.json("Post");
});

// Actualizar una categoria por id - privado - cualquiera con un token valido
router.put("/:id", (req, res) => {
  res.json("Put");
});

// Borrar una categoria por id - Admin
router.delete("/:id", (req, res) => {
  res.json("Delete");
});

module.exports = router;
