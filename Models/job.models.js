const mongoose = require("mongoose");

const jobSchema = mongoose.Schema(
  {
    company: { type: String, required: true },
    postedAt: { type: String, default: new Date().toLocaleDateString() },
    position: { type: String, required: true },
    contract: { type: String, required: true },
    location: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

const JobModel = mongoose.model("job", jobSchema);
module.exports = JobModel;
