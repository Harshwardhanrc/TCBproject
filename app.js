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
    const description = document.getElementById("income-description").value;
    const amount = document.getElementById("income-amount").value;
    const source = document.getElementById("income-source").value;
    const date = document.getElementById("income-date").value;

    if (!description || !amount || isNaN(amount) || !date) {
        alert("Enter valid amount");
        return;
    }

    await fetch(`${BASE_URL}/income`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            description,
            amount: Number(amount),
            source,
            date
        })
    });

    alert("Income added!");
    window.location.href = "expenses.html";
}

async function displayTransactions() {
    const expenseTable = document.getElementById("expense-tbody");
    const incomeTable = document.getElementById("income-tbody");

    if (!expenseTable && !incomeTable) return;

    if (expenseTable) expenseTable.innerHTML = "";
    if (incomeTable) incomeTable.innerHTML = "";

    try {
        const [expenseRes, incomeRes] = await Promise.all([
            fetch(`${BASE_URL}/expenses`),
            fetch(`${BASE_URL}/income`)
        ]);

        const expenses = await expenseRes.json();
        const incomes = await incomeRes.json();

        if (expenseTable) {
            expenses.forEach((e) => {
                expenseTable.innerHTML += `
                <tr>
                    <td>${e.description}</td>
                    <td style="color:#ef4444;">
                        ₹${Number(e.amount).toLocaleString("en-IN")}
                    </td>
                    <td>${e.category}</td>
                    <td>${e.date}</td>
                    <td>
                        <button onclick="deleteTransaction('${e._id}', 'expense')">
                            Delete
                        </button>
                    </td>
                </tr>
                `;
            });
        }

        if (incomeTable) {
            incomes.forEach((i) => {
                incomeTable.innerHTML += `
                <tr>
                    <td>${i.description || "-"}</td>
                    <td style="color:#10b981;">
                        ₹${Number(i.amount).toLocaleString("en-IN")}
                    </td>
                    <td>${i.source}</td>
                    <td>${i.date}</td>
                    <td>
                        <button onclick="deleteTransaction('${i._id}', 'income')">
                            Delete
                        </button>
                    </td>
                </tr>
                `;
            });
        }

    } catch (err) {
        console.log("Error loading data:", err);
    }
}

async function deleteTransaction(id, type) {
    const url = type === "expense"
        ? `${BASE_URL}/expenses/${id}`
        : `${BASE_URL}/income/${id}`;

    await fetch(url, {
        method: "DELETE"
    });

    displayTransactions();
}

async function saveBudget() {
    const budget = document.getElementById("budget-input").value;

    if (!budget || isNaN(budget)) {
        alert("Enter valid budget");
        return;
    }

    await fetch(`${BASE_URL}/budget`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            amount: Number(budget)
        })
    });

    alert("Budget updated!");
    window.location.href = "dashboard.html";
}

async function deleteBudget() {
    if (!confirm("Delete your budget?")) return;

    await fetch(`${BASE_URL}/budget`, {
        method: "DELETE"
    });

    alert("Budget deleted!");
    window.location.href = "dashboard.html";
}

async function showTotals() {
    const [expensesRes, incomeRes] = await Promise.all([
        fetch(`${BASE_URL}/expenses`),
        fetch(`${BASE_URL}/income`)
    ]);

    const expenses = await expensesRes.json();
    const incomes = await incomeRes.json();
    const budgetRes = await fetch(`${BASE_URL}/budget`);
    const budgetData = await budgetRes.json();
    const budget = budgetData.amount || 0;

    const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount), 0);
    const remaining = totalIncome - totalSpent;


    if (document.getElementById("budget-display")) {
        document.getElementById("budget-display").textContent =
            "₹" + Number(budget).toLocaleString("en-IN");
    }

    if (document.getElementById("total-income")) {
        document.getElementById("total-income").textContent =
            "₹" + totalIncome.toLocaleString("en-IN");
        document.getElementById("total-income").style.color = "#10b981";
    }

    if (document.getElementById("total-spent")) {
        document.getElementById("total-spent").textContent =
            "₹" + totalSpent.toLocaleString("en-IN");
        document.getElementById("total-spent").style.color = "#ef4444";
    }

    const remainingEl = document.getElementById("remaining");
    if (remainingEl) {
        remainingEl.textContent =
            "₹" + remaining.toLocaleString("en-IN");
        remainingEl.style.color = remaining < 0 ? "red" : "#10b981";
    }

    drawExpensePieChart(expenses);
}

function drawExpensePieChart(expenses) {
    const canvas = document.getElementById("expense-pie-chart");
    const legend = document.getElementById("expense-chart-legend");

    if (!canvas || !legend) return;

    const totals = expenses.reduce((acc, expense) => {
        const category = expense.category || "Other";
        acc[category] = (acc[category] || 0) + Number(expense.amount);
        return acc;
    }, {});

    const labels = Object.keys(totals);
    const values = labels.map((label) => totals[label]);
    const total = values.reduce((sum, value) => sum + value, 0);
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    legend.innerHTML = "";

    if (!labels.length || total === 0) {
        ctx.font = "16px Poppins, sans-serif";
        ctx.fillStyle = "#94a3b8";
        ctx.textAlign = "center";
        ctx.fillText("No expenses yet", canvas.width / 2, canvas.height / 2);
        legend.innerHTML = "<div class='chart-note'>Add expenses to see category data.</div>";
        return;
    }

    const colors = ["#f59e0b", "#ef4444", "#22c55e", "#6366f1", "#14b8a6", "#fb7185", "#f97316"];
    let startAngle = -0.5 * Math.PI;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    labels.forEach((label, index) => {
        const value = totals[label];
        const sliceAngle = (value / total) * 2 * Math.PI;
        const color = colors[index % colors.length];

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();

        startAngle += sliceAngle;

        const legendItem = document.createElement("div");
        legendItem.className = "chart-legend-item";
        legendItem.innerHTML = `
            <span class="legend-color" style="background:${color}"></span>
            <span>${label}: ₹${value.toLocaleString("en-IN")}</span>
        `;
        legend.appendChild(legendItem);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    displayTransactions();
    showTotals();
});