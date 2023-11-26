const descriptionInput = document.getElementById("descriptionInput");
const amountInput = document.getElementById("amountInput");
const categorySelect = document.getElementById("categorySelect");
const addTransactionButton = document.getElementById("addTransactionButton");
const transactionList = document.getElementById("transactionList");
const filterCategory = document.getElementById("filterCategory");
const totalIncomeExpense = document.getElementById("totalIncomeExpense");

addTransactionButton.addEventListener("click", addTransaction);
filterCategory.addEventListener("change", filterTransactions);

// Load existing transactions from local storage on page load
window.addEventListener("load", () => {
    loadTransactions();
    updateTotalIncomeExpense();
});

function addTransaction() {
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);
    const category = categorySelect.value;

    if (description.trim() !== "" && !isNaN(amount) && amount !== 0) {
        const transactionItem = createTransactionItem(description, amount, category);
        transactionList.appendChild(transactionItem);

        // Update total income and expense
        updateTotalIncomeExpense();

        // Save transactions to local storage
        saveTransactions();

        // Clear input fields
        descriptionInput.value = "";
        amountInput.value = "";
    } else {
        alert("Please enter a valid transaction.");
    }
}

function createTransactionItem(description, amount, category) {
    const transactionItem = document.createElement("li");
    const transactionText = document.createElement("span");
    const deleteButton = document.createElement("button");

    transactionText.textContent = `${description}: $${amount.toFixed(2)} (${category})`;
    deleteButton.textContent = "Delete";

    transactionItem.classList.add(amount >= 0 ? "income" : "expense");
    transactionItem.appendChild(transactionText);
    transactionItem.appendChild(deleteButton);

    // Attach event listener for deleting a transaction
    deleteButton.addEventListener("click", () => {
        transactionList.removeChild(transactionItem);
        updateTotalIncomeExpense();
        saveTransactions();
    });

    return transactionItem;
}

function filterTransactions() {
    const selectedCategory = filterCategory.value;
    const transactions = document.querySelectorAll("#transactionList li");

    transactions.forEach((transaction) => {
        const category = transaction.textContent.split("(")[1].split(")")[0].toLowerCase();
        if (selectedCategory === "all" || category === selectedCategory) {
            transaction.style.display = "flex";
        } else {
            transaction.style.display = "none";
        }
    });
}

function updateTotalIncomeExpense() {
    const transactions = document.querySelectorAll("#transactionList li");
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
        const amount = parseFloat(transaction.textContent.split(": $")[1]);
        if (amount >= 0) {
            totalIncome += amount;
        } else {
            totalExpense += amount;
        }
    });

    totalIncomeExpense.textContent = `Total Income: $${totalIncome.toFixed(2)} | Total Expense: $${totalExpense.toFixed(2)}`;
}

function saveTransactions() {
    const transactions = [];
    const transactionItems = document.querySelectorAll("#transactionList li");

    transactionItems.forEach((transactionItem) => {
        transactions.push({
            description: transactionItem.textContent.split(": $")[0],
            amount: parseFloat(transactionItem.textContent.split(": $")[1]),
            category: transactionItem.textContent.split("(")[1].split(")")[0],
        });
    });

    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function loadTransactions() {
    const savedTransactions = localStorage.getItem("transactions");

    if (savedTransactions) {
        const transactions = JSON.parse(savedTransactions);

        transactions.forEach((transaction) => {
            const transactionItem = createTransactionItem(transaction.description, transaction.amount, transaction.category);
            transactionList.appendChild(transactionItem);
        });

        updateTotalIncomeExpense();
    }
}
