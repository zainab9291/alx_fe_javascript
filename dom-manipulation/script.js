let quotes = [];
let lastViewedQuote = null;

// Load quotes from localStorage if available
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    // Sample initial quotes
    quotes = [
      { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Tech" },
      { text: "Stay hungry, stay foolish.", category: "Inspiration" }
    ];
    saveQuotes();
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Populate category filter dropdown
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  select.innerHTML = `<option value="all">All Categories</option>`;
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });

  const savedFilter = localStorage.getItem('selectedCategory');
  if (savedFilter) {
    select.value = savedFilter;
    filterQuotes();
  }
}

// Show a random quote (filtered if a category is selected)
function showRandomQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").textContent = "No quotes in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  document.getElementById("quoteDisplay").textContent = `"${quote.text}" - ${quote.category}`;

  lastViewedQuote = quote;
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Filter quotes by selected category
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem('selectedCategory', selected);
  showRandomQuote();
}

// Add new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added!");
  } else {
    alert("Please enter both quote text and category.");
  }
}

// Export quotes as JSON file
function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "quotes.json";
  a.click();
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format.");
      }
    } catch (err) {
      alert("Error parsing JSON.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

// ✅ Fetch quotes from mock server (simulation)
function fetchQuotesFromServer() {
  fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
    .then(response => response.json())
    .then(data => {
      const newServerQuotes = data.map(post => ({
        text: post.title,
        category: "Server"
      }));

      // Simulate conflict resolution (server wins)
      quotes = [...newServerQuotes, ...quotes];
      saveQuotes();
      populateCategories();
      alert("Quotes synced from server (server quotes take precedence).");
    })
    .catch(err => {
      console.error("Error syncing with server:", err);
    });
}

// Load from localStorage on startup
window.onload = function () {
  loadQuotes();
  populateCategories();

  const last = sessionStorage.getItem('lastViewedQuote');
  if (last) {
    document.getElementById("quoteDisplay").textContent = `"${JSON.parse(last).text}" - ${JSON.parse(last).category}`;
  }

  // Periodic sync every 30 seconds (demo)
  setInterval(fetchQuotesFromServer, 30000);
};