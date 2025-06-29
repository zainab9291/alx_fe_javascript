const quotes = [
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "If you judge people, you have no time to love them.", category: "Wisdom" }
];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const displayDiv = document.getElementById("quoteDisplay");
  displayDiv.innerHTML = `
    <div class="quote">"${quote.text}"</div>
    <div class="category">- ${quote.category}</div>
  `;
}

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText && newCategory) {
    quotes.push({ text: newText, category: newCategory });
    textInput.value = "";
    categoryInput.value = "";
    showRandomQuote();
  } else {
    alert("Please enter both quote and category.");
  }
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Initial quote display
showRandomQuote();