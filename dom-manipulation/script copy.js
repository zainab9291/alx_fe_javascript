let quotes = [];
let lastViewedQuote = null;

// Load quotes from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
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

// Populate category dropdown
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

// Show a random quote
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

// Filter quotes
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
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added!");
  } else {
    alert("Please enter both quote text and category.");
  }
}

// Export quotes as JSON
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
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

// ✅ Fetch quotes from server
async function fetchQuotesFromServer() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3');
    const data = await res.json();

    const serverQuotes = data.map(post => ({
      text: post.title,
      category: "Server"
    }));

    quotes = [...serverQuotes, ...quotes];
    saveQuotes();
    populateCategories();

    alert("Quotes synced from server successfully.");
  } catch (error) {
    console.error("Error syncing with server:", error);
  }
}

// ✅ Upload quotes to server using POST
async function uploadQuotesToServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quotes)
    });

    if (response.ok) {
      alert("Quotes uploaded to server successfully (simulated).");
    } else {
      alert("Failed to upload quotes.");
    }
  } catch (err) {
    console.error("Upload error:", err);
  }
}

// Initialize on page load
window.onload = function () {
  loadQuotes();
  populateCategories();

  const last = sessionStorage.getItem('lastViewedQuote');
  if (last) {
    const quote = JSON.parse(last);
    document.getElementById("quoteDisplay").textContent = `"${quote.text}" - ${quote.category}`;
  }

  // Auto-sync every 30 seconds
  setInterval(fetchQuotesFromServer, 30000);
};
async function syncQuotes() {
  await fetchQuotesFromServer();     // Get server data first
  await uploadQuotesToServer();     // Then push our current data
  alert("Sync complete!");
};
async function syncQuotes() {
  try {
    await fetchQuotesFromServer();   // Pull new quotes from server
    await uploadQuotesToServer();   // Push local quotes to server
    console.log("Quotes synced with server!");
    alert("Quotes synced with server!");
  } catch (error) {
    console.error("Error syncing quotes:", error);
    alert("Failed to sync with server.");
  }
};
function createAddQuoteForm() {
  const formContainer = document.createElement('div');
  formContainer.id = 'quoteForm';

  const quoteInput = document.createElement('input');
  quoteInput.id = 'newQuoteText';
  quoteInput.type = 'text';
  quoteInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.onclick = addQuote;

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}
window.onload = function () {
  loadQuotes();         // Load from localStorage or server
  populateCategories(); // Populate dropdown
  showRandomQuote();    // Show one quote on load
  createAddQuoteForm(); // Create the input form dynamically
};
