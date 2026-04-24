function loadExpenses() {
    return JSON.parse(localStorage.getItem("expenses")) || [];
}

function saveExpenses(expenses) {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}
function loadIncome() {
    return JSON.parse(localStorage.getItem("income")) || [];
}

function saveIncome(income) {
    localStorage.setItem("income", JSON.stringify(income));
}
function addExpense() {
    const description = document.getElementById("description").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;
    const editIdInput = document.getElementById("edit-id");
    const editId = editIdInput ? editIdInput.value : "";

    const expenses = loadExpenses();

    if (editId) {
        const expenseIndex = expenses.findIndex(e => e.id === editId);
        if (expenseIndex !== -1) {
            expenses[expenseIndex] = {
                id: editId,
                description: description,
                amount: parseFloat(amount),
                category: category,
                date: date
            };
        }
    } else {
        const newExpense = {
            id: Date.now().toString(),
            description: description,
            amount: parseFloat(amount),
            category: category,
            date: date
        };
        expenses.push(newExpense);
    }

    saveExpenses(expenses);
    alert(editId ? "Expense updated!" : "Expense added!");
    window.location.href = "expenses.html";
}

function addIncome() {
    const amount = document.getElementById("income-amount").value;
    const source = document.getElementById("income-source").value;
    const date = document.getElementById("income-date").value;

    if (!amount || !date) {
        alert("Please fill all fields");
        return;
    }

    const incomeList = loadIncome();

    const newIncome = {
        id: Date.now().toString(),
        amount: parseFloat(amount),
        source: source,
        date: date
    };

    incomeList.push(newIncome);
    saveIncome(incomeList);

   alert("Income added!");
window.location.href = "dashboard.html";
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
          <button onclick="editExpense('${expense.id}')">Edit</button>
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
    const incomes = loadIncome();
    const budget = localStorage.getItem("budget") || 0;

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);

    const remaining = totalIncome - totalSpent;

    if (document.getElementById("budget-display")) {
        document.getElementById("budget-display").textContent = "₹" + budget;
    }

    if (document.getElementById("total-income")) {
        document.getElementById("total-income").textContent = "₹" + totalIncome;
    }

    if (document.getElementById("total-spent")) {
        document.getElementById("total-spent").textContent = "₹" + totalSpent;
    }

    const remainingEl = document.getElementById("remaining");

if (remainingEl) {
    remainingEl.textContent = "₹" + remaining;

    if (remaining < 0) {
        remainingEl.style.color = "red";
    } else {
        remainingEl.style.color = "#ef4444";
    }
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

    const editId = localStorage.getItem("editId");
    if (editId && document.getElementById("edit-id")) {
        const expenses = loadExpenses();
        const expense = expenses.find(e => e.id === editId);
        if (expense) {
            document.getElementById("edit-id").value = expense.id;
            document.getElementById("description").value = expense.description;
            document.getElementById("amount").value = expense.amount;
            document.getElementById("category").value = expense.category;
            document.getElementById("date").value = expense.date;
            
            const btn = document.querySelector("button[onclick='addExpense()']");
            if (btn) btn.textContent = "Update Expense";
        }
        localStorage.removeItem("editId");
    }
});

function editExpense(id) {
    localStorage.setItem("editId", id);
    window.location.href = "add.html";
}