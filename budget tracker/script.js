let bank = 0;
let wallet = 0;

let incomes = [];
let expenses = [];

let budgets = {};
let currentPage = "records";

const categories = [
  "Food", "Transport", "Housing",
  "Entertainment", "Clothing", "Health", "Education", "Other"
];

function showPage(page) {
  currentPage = page;
  render();
}

function addTransaction(type, source, amount, category) {
  amount = Number(amount);

  if (type === "income") {
    if (source === "bank") bank += amount;
    else wallet += amount;

    incomes.push({ amount, source, date: new Date() });

  } else {
    if (source === "bank") bank -= amount;
    else wallet -= amount;

    expenses.push({ amount, source, category, date: new Date() });
  }

  render();
}

function totalIncome() {
  return incomes.reduce((sum, i) => sum + i.amount, 0);
}

function totalExpense() {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

function render() {
  let content = document.getElementById("content");

  // RECORDS
  if (currentPage === "records") {
    content.innerHTML = "<h3>No records yet</h3>";
  }

  // ANALYSIS
  if (currentPage === "analysis") {
    content.innerHTML = `
      <h3>Analysis</h3>
      <p>Income: ₹${totalIncome()}</p>
      <p>Expense: ₹${totalExpense()}</p>
      <p>Balance: ₹${totalIncome() - totalExpense()}</p>
    `;
  }

  // ACCOUNTS
  if (currentPage === "accounts") {
    content.innerHTML = `
      <h3>Accounts</h3>
      <p>Bank: ₹${bank}</p>
      <p>Wallet: ₹${wallet}</p>
    `;
  }

  // ADD
  if (currentPage === "add") {
    content.innerHTML = `
      <h3>Add Transaction</h3>

      <input id="amount" placeholder="Enter amount">

      <select id="type">
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <select id="source">
        <option value="bank">Bank</option>
        <option value="wallet">Wallet</option>
      </select>

      <select id="category">
        ${categories.map(c => `<option>${c}</option>`).join("")}
      </select>

      <button onclick="handleAdd()">Add</button>
    `;
  }

  // BUDGET
  if (currentPage === "budget") {
    content.innerHTML = `
      <h3>Budget</h3>
      <p>Total Budget: ₹0</p>
      <p>Total Spent: ₹${totalExpense()}</p>
    `;
  }
}

function handleAdd() {
  let amount = document.getElementById("amount").value;
  let type = document.getElementById("type").value;
  let source = document.getElementById("source").value;
  let category = document.getElementById("category").value;

  addTransaction(type, source, amount, category);
}

render();
