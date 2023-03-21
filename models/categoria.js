const { Schema, model } = require("mongoose");

const CategoriaSchema = Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    unique: true,
  },
  status: {
    type: Boolean,
    default: true,
    required: [true, "status is required"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: [true, "user is required"],
  },
});

// métodos personalizado
CategoriaSchema.methods.toJSON = function () {
  const { __v, status, ...categoria } = this.toObject();
  return categoria;
};

module.exports = model("Categoria", CategoriaSchema);
