let transactions = [
  {id: 1, amount: 30000, category: "Deposit", date: "15/04/2025", type: "income"},
  {id: 2, amount: -1500, category: "Food", date: "16/04/2025", type: "expense"}
];

let userSettings = { theme: "light", currency: "₹" };

const transactionForm = document.getElementById('transactionForm');
const transactionList = document.getElementById('transactionList');
const balanceAmount = document.getElementById('balance-amount');
const balanceDisplay = document.getElementById('balance-display');
const themeSwitcher = document.getElementById('theme-switcher');

function initApp() {
  loadTransactions();
  updateBalance();
  displayTransactions();
  updateUI();

  transactionForm.addEventListener('submit', handleFormSubmit);
  themeSwitcher.addEventListener('click', switchTheme);
}

function loadTransactions() {
  const saved = localStorage.getItem('transactions');
  if(saved) transactions = JSON.parse(saved);
}

function handleFormSubmit(e) {
  e.preventDefault();

  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const type = document.querySelector('input[name="type"]:checked').value;

  addTransaction(amount, category, type);
  updateApp();
  e.target.reset();
}

function addTransaction(amount, category, type) {
  const newTransaction = {
    id: Date.now(),
    amount: type === 'income' ? amount : -amount,
    category,
    type,
    date: new Date().toLocaleDateString('en-IN')
  };
  transactions.push(newTransaction);
}

const calculateBalance = () => {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
};

function updateBalance() {
  const balance = calculateBalance();
  balanceAmount.textContent = balance.toLocaleString('en-IN');
  balanceDisplay.style.color = balance >= 0 ? 'green' : 'red';
}

function displayTransactions() {
  transactionList.innerHTML = transactions.map(t => {
    const icon = getCategoryIcon(t.category);
    const amountFormatted = `${t.amount >= 0 ? '+' : ''}${Math.abs(t.amount).toLocaleString('en-IN')} ${userSettings.currency}`;
    
    return `
      <div class="transaction ${Math.abs(t.amount) >= 10000 ? 'large-transaction' : ''}">
        <span class="category">
          <span class="icon">${icon}</span>
          ${t.category} (${t.date})
        </span>
        <span class="amount ${t.type}">
          ${amountFormatted}
        </span>
      </div>
    `;
  }).reverse().join('');
}

function getCategoryIcon(category) {
  switch(category) {
    case "Food": return "🍕";
    case "Transport": return "🚗";
    case "Deposit": return "💰";
    case "Bills": return "💡";
    case "Entertainment": return "🎬";
    case "Shopping": return "🛍️";
    default: return "📌";
  }
}

function switchTheme() {
  userSettings.theme = userSettings.theme === 'light' ? 'dark' : 'light';
  updateUI();
}

function updateUI() {
  document.body.className = userSettings.theme;
}

function updateApp() {
  updateBalance();
  displayTransactions();
  saveToLocalStorage();
}

function saveToLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

document.addEventListener('DOMContentLoaded', initApp);
