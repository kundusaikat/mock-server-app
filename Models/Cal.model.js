const mongoose = require("mongoose");

const CalSchema = new mongoose.Schema(
  {
    instalment: { type: Number, required: true },
    intrest: { type: Number, required: true },
    totalnumberyear: { type: Number, required: true },
  },
  {
    versionKey: false,
  }
);

const CalModel = mongoose.model("cal", CalSchema);

module.exports = CalModel;
