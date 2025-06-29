// quotes array
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "Strive not to be a success, but rather to be of value.", category: "Success" }
];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const categoryFilter = document.getElementById('categoryFilter');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');

// Save to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Show a random quote
function showRandomQuote() {
  const selectedCategory = categoryFilter?.value;
  let filteredQuotes = (selectedCategory && selectedCategory !== 'all')
    ? quotes.filter(q => q.category === selectedCategory)
    : quotes;

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const random = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[random];
  quoteDisplay.textContent = quote.text;

  // store last viewed
  sessionStorage.setItem('lastQuote', quote.text);
}

// Add new quote
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();

  newQuoteText.value = '';
  newQuoteCategory.value = '';
  populateCategories();
  showRandomQuote();
}

// Export quotes as JSON
function exportQuotes() {
  const data = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(data);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();

  URL.revokeObjectURL(url);
}

// Import from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert('Quotes imported successfully!');
    } catch (err) {
      alert('Failed to import JSON.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Populate filter dropdown
function populateCategories() {
  if (!categoryFilter) return;

  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last filter
  const lastFilter = localStorage.getItem('lastFilter');
  if (lastFilter) {
    categoryFilter.value = lastFilter;
  }
}

// Filter based on selected category
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem('lastFilter', selected);
  showRandomQuote();
}

// Simulated fetch from server
function fetchFromServer() {
  // Simulate mock API data
  const serverQuotes = [
    { text: "Don't watch the clock; do what it does. Keep going.", category: "Motivation" },
    { text: "Success is not final, failure is not fatal.", category: "Success" }
  ];

  // Conflict resolution: server takes priority
  const existingTexts = quotes.map(q => q.text);
  const newOnes = serverQuotes.filter(q => !existingTexts.includes(q.text));
  if (newOnes.length > 0) {
    quotes.push(...newOnes);
    saveQuotes();
    populateCategories();
    alert('Synced new quotes from server.');
  }
}

// Sync every 30 seconds
setInterval(fetchFromServer, 30000);

// On load
populateCategories();
showRandomQuote();