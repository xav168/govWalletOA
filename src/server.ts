import express from "express";
import * as staffController from "./controllers/staff";
import * as redemptionController from "./controllers/redemption";
import prisma from "../prisma/client";

export const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/staff", staffController.getStaff);
app.post("/staff/init", staffController.initStaff);

app.get("/redemptionstatus", redemptionController.checkTeamRedemption);
app.post("/redeem", redemptionController.redeemGift);
app.post("/reset", async (req, res) => {
  let deleteStaff = await prisma.staff.deleteMany({});
  let deleteRedemptions = await prisma.redemption.deleteMany({});
  res.send("Successfully reset DBs");
});
