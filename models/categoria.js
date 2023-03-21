const { Schema, model } = require("mongoose");

const CategoriaSchema = Schema({
  name: {
    type: String,
    required: [true, "El nombre es requerido"],
    unique: true,
  },
  status: {
    type: Boolean,
    default: true,
    required: [true, "El status es requerido"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: [true, "El usuario es requerido"],
  },
});

// métodos personalizado
CategoriaSchema.methods.toJSON = function () {
  const { __v, status, ...categoria } = this.toObject();
  return categoria;
};

module.exports = model("Categoria", CategoriaSchema);
