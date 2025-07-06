let quotes = [];

document.addEventListener('DOMContentLoaded', () => {
  loadQuotes();
  populateCategories();
  showRandomQuote();
  createAddQuoteForm();
  setupEventListeners();
});

// Load from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Save to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Show random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const filteredQuotes = getFilteredQuotes();
  const random = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.textContent = random ? `${random.text} (${random.category})` : 'No quotes available.';
}

// Get quotes based on filter
function getFilteredQuotes() {
  const selected = localStorage.getItem('selectedCategory') || 'all';
  return selected === 'all' ? quotes : quotes.filter(q => q.category === selected);
}

// Add quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    alert('Quote added!');
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  }
}

// Create input form
function createAddQuoteForm() {
  const container = document.createElement('div');
  container.id = 'quoteForm';

  const textInput = document.createElement('input');
  textInput.id = 'newQuoteText';
  textInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.addEventListener('click', addQuote);

  container.append(textInput, categoryInput, addButton);
  document.body.appendChild(container);
}

// Populate categories
function populateCategories() {
  const select = document.getElementById('categoryFilter');
  const selected = localStorage.getItem('selectedCategory') || 'all';
  const categories = [...new Set(quotes.map(q => q.category))];

  select.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(category => {
    const opt = document.createElement('option');
    opt.value = category;
    opt.textContent = category;
    if (category === selected) opt.selected = true;
    select.appendChild(opt);
  });
}

// Filter quotes
function filterQuotes() {
  const selected = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selected);
  showRandomQuote();
}

// Export to JSON
function exportToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Import from JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    try {
      const imported = JSON.parse(e.target.result);
      quotes.push(...imported);
      saveQuotes();
      populateCategories();
      alert('Quotes imported!');
    } catch (err) {
      alert('Invalid JSON file');
    }
  };
  reader.readAsText(file);
}

// Setup event listeners
function setupEventListeners() {
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('exportQuotes').addEventListener('click', exportToJson);
  document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);
}