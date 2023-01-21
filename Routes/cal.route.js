const { Router } = require("express");
const CalModel = require("../Models/Cal.model");
const UserModel = require("../Models/User.model");

const Cal = Router();
Cal.get("/", (req, res) => {
  res.send("I am Happy");
});

Cal.post("/cal", async (req, res) => {
  const { instalment, intrest, totalnumberyear, user_id } = req.body;
  let new_data = new CalModel({
    instalment,
    intrest,
    totalnumberyear,
    user_id,
  });
  await new_data.save();
  try {
    P = instalment;
    i = intrest / 100;
    n = totalnumberyear;
    let Maturityvalue = P * (((1 + i) ** n) - 1 / i);
    let TotalInvestmentAmount = P * n;
    let TotalInterestGained = Maturityvalue - TotalInvestmentAmount;
    console.log(Maturityvalue);
    return res.send({
      msg: "Calculated data",
      Maturityvalue,
      TotalInvestmentAmount,
      TotalInterestGained,
    });
  } catch (error) {
    res.send("error");
  }
});
module.exports = Cal;
