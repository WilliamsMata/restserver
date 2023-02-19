const { response, request } = require("express");

const isAdminRole = (req = request, res = response, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      msg: "The role is being verified without first validating the token",
    });
  }

  const { role, name } = req.usuario;

  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${name} is not an admin user`,
    });
  }

  next();
};

const haveRole = (...roles) => {
  return (req = request, res = response, next) => {
    if (!req.usuario) {
      return res.status(500).json({
        msg: "The role is being verified without first validating the token",
      });
    }

    if (!roles.includes(req.usuario.role)) {
      return res.status(401).json({
        msg: `The service requires one of these roles: ${roles}`,
      });
    }

    next();
  };
};

module.exports = {
  isAdminRole,
  haveRole,
};
