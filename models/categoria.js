const { Schema, model } = require("mongoose");

const CategoriaSchema = Schema({
  name: {
    type: String,
    required: [true, "name is required"],
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

module.exports = model("Categoria", CategoriaSchema);
