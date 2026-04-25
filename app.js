const BASE_URL = "https://budget-tracker-szz5.onrender.com";

async function addExpense() {
    const description = document.getElementById("description").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    if (!description || !amount || isNaN(amount) || !category || !date) {
        alert("Please fill all fields correctly");
        return;
    }

    await fetch(`${BASE_URL}/expense`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            description,
            amount: Number(amount),   
            category,
            date
        })
    });

    alert("Expense added!");
    window.location.href = "expenses.html";
}

async function addIncome() {
    const amount = document.getElementById("income-amount").value;
    const source = document.getElementById("income-source").value;
    const date = document.getElementById("income-date").value;

    if (!amount || isNaN(amount) || !date) {
        alert("Enter valid amount");
        return;
    }

    await fetch(`${BASE_URL}/income`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            amount: Number(amount),   
            source,
            date
        })
    });

    alert("Income added!");
    window.location.href = "dashboard.html";
}

async function displayExpenses() {
    const res = await fetch(`${BASE_URL}/expenses`);
    const expenses = await res.json();

    const tableBody = document.getElementById("expense-tbody");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    expenses.forEach((expense) => {
        tableBody.innerHTML += `
        <tr>
            <td>${expense.description}</td>
            <td>₹${expense.amount}</td>
            <td>${expense.category}</td>
            <td>${expense.date}</td>
            <td>
                <button onclick="deleteExpense('${expense._id}')">Delete</button>
            </td>
        </tr>
        `;
    });
}

async function deleteExpense(id) {
    await fetch(`${BASE_URL}/expenses/${id}`, {
        method: "DELETE"
    });

    displayExpenses();
}

async function showTotals() {
    const [expensesRes, incomeRes] = await Promise.all([
        fetch(`${BASE_URL}/expenses`),
        fetch(`${BASE_URL}/income`)
    ]);

    const expenses = await expensesRes.json();
    const incomes = await incomeRes.json();

    const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount), 0);
    const remaining = totalIncome - totalSpent;

    if (document.getElementById("total-income")) {
        document.getElementById("total-income").textContent = "₹" + totalIncome;
    }

    if (document.getElementById("total-spent")) {
        document.getElementById("total-spent").textContent = "₹" + totalSpent;
    }

    const remainingEl = document.getElementById("remaining");
    if (remainingEl) {
        remainingEl.textContent = "₹" + remaining;
        remainingEl.style.color = remaining < 0 ? "red" : "#10b981";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    displayExpenses();
    showTotals();
});