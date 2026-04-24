const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://harshwardhanc10_db_user:HarshwardhanMongo101@ac-tn1ws54-shard-00-00.t0mn14q.mongodb.net:27017,ac-tn1ws54-shard-00-01.t0mn14q.mongodb.net:27017,ac-tn1ws54-shard-00-02.t0mn14q.mongodb.net:27017/?ssl=true&replicaSet=atlas-jjsio3-shard-0&authSource=admin&appName=Cluster0")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Schemas
const ExpenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  category: String,
  date: String
});

const IncomeSchema = new mongoose.Schema({
  amount: Number,
  source: String,
  date: String
});

// Models
const Expense = mongoose.model("Expense", ExpenseSchema);
const Income = mongoose.model("Income", IncomeSchema);

// Routes

// Add Expense
app.post("/expense", async (req, res) => {
  const newExpense = new Expense(req.body);
  await newExpense.save();
  res.json({ message: "Expense saved" });
});

// Get Expenses
app.get("/expenses", async (req, res) => {
  const data = await Expense.find();
  res.json(data);
});

// Add Income
app.post("/income", async (req, res) => {
  const newIncome = new Income(req.body);
  await newIncome.save();
  res.json({ message: "Income saved" });
});

// Get Income
app.get("/income", async (req, res) => {
  const data = await Income.find();
  res.json(data);
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});