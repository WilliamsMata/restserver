const { Schema, model } = require("mongoose");

const ProductoSchema = Schema({
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
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Categoria",
    required: [true, "La categoria es requerida"],
  },
  description: {
    type: String,
  },
  available: {
    type: Boolean,
    default: true,
  },
  img: {
    type: String,
  },
});

// métodos personalizado
ProductoSchema.methods.toJSON = function () {
  const { __v, status, ...producto } = this.toObject();
  return producto;
};

module.exports = model("Producto", ProductoSchema);
