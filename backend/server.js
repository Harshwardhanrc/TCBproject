const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const ExpenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  category: String,
  date: String
});

const IncomeSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  source: String,
  date: String
});

const BudgetSchema = new mongoose.Schema({
  amount: Number
});

const Expense = mongoose.model("Expense", ExpenseSchema);
const Income = mongoose.model("Income", IncomeSchema);
const Budget = mongoose.model("Budget", BudgetSchema);

app.post("/expense", async (req, res) => {
  const newExpense = new Expense(req.body);
  await newExpense.save();
  res.json({ message: "Expense saved" });
});

app.get("/expenses", async (req, res) => {
  const data = await Expense.find();
  res.json(data);
});

app.delete("/expenses/:id", async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

app.post("/income", async (req, res) => {
  const newIncome = new Income({
    description: req.body.description,   // 🔥 ADD THIS
    amount: Number(req.body.amount),
    source: req.body.source,
    date: req.body.date
  });

  await newIncome.save();
  res.json({ message: "Income saved" });
});

app.get("/income", async (req, res) => {
  const data = await Income.find();
  res.json(data);
});

app.delete("/income/:id", async (req, res) => {
  await Income.findByIdAndDelete(req.params.id);
  res.json({ message: "Income deleted" });
});

app.post("/budget", async (req, res) => {
  const { amount } = req.body;

  let budget = await Budget.findOne();

  if (budget) {
    budget.amount = amount;
    await budget.save();
  } else {
    budget = new Budget({ amount });
    await budget.save();
  }

  res.json({ message: "Budget saved" });
});

app.get("/budget", async (req, res) => {
  const budget = await Budget.findOne();
  res.json(budget || { amount: 0 });
});

app.delete("/budget", async (req, res) => {
  await Budget.deleteMany({});
  res.json({ message: "Budget deleted" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});