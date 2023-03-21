const { response, request } = require("express");

const isAdminRole = (req = request, res = response, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      msg: "El rol se está verificando sin validar primero el token",
    });
  }

  const { role, name } = req.usuario;

  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${name} no es un administrador`,
    });
  }

  next();
};

const haveRole = (...roles) => {
  return (req = request, res = response, next) => {
    if (!req.usuario) {
      return res.status(500).json({
        msg: "El rol se está verificando sin validar primero el token",
      });
    }

    if (!roles.includes(req.usuario.role)) {
      return res.status(401).json({
        msg: `El servicio require uno de estos roles: ${roles}`,
      });
    }

    next();
  };
};

module.exports = {
  isAdminRole,
  haveRole,
};
