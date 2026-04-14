function loadExpenses() {
    return JSON.parse(localStorage.getItem("expenses")) || [];
}

function saveExpenses(expenses) {
    localStorage.setItem("expenses", JSON.stringify(expenses));
} function addExpense() {
    const description = document.getElementById("description").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    const newExpense = {
        id: Date.now().toString(),
        description: description,
        amount: parseFloat(amount),
        category: category,
        date: date
    };
    const expenses = loadExpenses();
    expenses.push(newExpense);
    saveExpenses(expenses);
    alert("Expense added!");
    window.location.href = "expenses.html";
}
function displayExpenses() {
    const expenses = loadExpenses();
    const tableBody = document.getElementById("expense-tbody");

    if (!tableBody) return;
    tableBody.innerHTML = "";

    expenses.forEach(function (expense) {
        tableBody.innerHTML += `
      <tr>
        <td>${expense.description}</td>
        <td>₹${expense.amount}</td>
        <td>${expense.category}</td>
        <td>${expense.date}</td>
        <td>
          <button onclick="deleteExpense('${expense.id}')">Delete</button>
        </td>
      </tr>
    `;
    });
}
function deleteExpense(id) {
    const expenses = loadExpenses();
    const updated = expenses.filter(function (expense) {
        return expense.id !== id;
    });
    saveExpenses(updated);
    displayExpenses();
}
function showTotals() {
    const expenses = loadExpenses();
    const budget = localStorage.getItem("budget") || 0;

    const totalSpent = expenses.reduce(function (sum, expense) {
        return sum + expense.amount;
    }, 0);

    const remaining = budget - totalSpent;

    if (document.getElementById("budget-display")) {
        document.getElementById("budget-display").textContent = "₹" + budget;
    }
    if (document.getElementById("total-spent")) {
        document.getElementById("total-spent").textContent = "₹" + totalSpent;
        document.getElementById("remaining").textContent = "₹" + remaining;
    }
}
function saveBudget() {
    const budget = document.getElementById("budget-input").value;
    localStorage.setItem("budget", budget);
    alert("Budget updated!");
    window.location.href = "dashboard.html";
}

document.addEventListener("DOMContentLoaded", () => {
    displayExpenses();
    showTotals();
});