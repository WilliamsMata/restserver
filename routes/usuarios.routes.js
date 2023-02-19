const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { isAdminRole } = require("../middlewares/validar-roles");
const {
  esRolValido,
  existeEmail,
  existeUsuarioPorID,
} = require("../helpers/db-validators");
const {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
} = require("../controllers/usuarios.controller");

router.get("/", usuariosGet);

router.post(
  // ruta
  "/",
  // middleware
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe contener mas de 6 caracteres").isLength(
      { min: 6 }
    ),
    check("email", "El email no es valido").isEmail(),
    // chequeamos que el email no este repetido en la base de datos
    check("email").custom(existeEmail),
    // check("role", "No es un rol permitido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    // chequeamos que el role exista en la base de datos
    check("role").custom(esRolValido),
    // validamos los campos
    validarCampos,
  ],
  // controlador
  usuariosPost
);

router.put(
  "/:id",
  [
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(existeUsuarioPorID),
    check("role").custom(esRolValido),
    validarCampos,
  ],
  usuariosPut
);

router.patch("/", usuariosPatch);

router.delete(
  "/:id",
  [
    validarJWT,
    isAdminRole,
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(existeUsuarioPorID),
    validarCampos,
  ],
  usuariosDelete
);

module.exports = router;
