document.addEventListener("DOMContentLoaded", () => {
    const resultDiv = document.getElementById("result");
    const staticCards = document.getElementById("staticCards");
    const keywordInput = document.getElementById("keywordInput");
    const form = document.getElementById("searchForm");

    function renderProductCard(product) {
        return `
      <div class="card">
        <img src="${product.image_url || ''}" alt="Product Image">
        <h3>${product.product_name || 'No name available'}</h3>
        <p><strong>Brand:</strong> ${product.brands || 'Unknown'}</p>
        <p><strong>Quantity:</strong> ${product.quantity || 'N/A'}</p>
        <p><strong>Categories:</strong> ${product.categories || 'N/A'}</p>
      </div>
    `;
    }

    async function searchByKeywords(keywords) {
        staticCards.style.display = "none"; // Hide static cards
        resultDiv.innerHTML = '<div class="card">Searching...</div>';

        try {
            const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(keywords)}&search_simple=1&json=1`;
            const res = await fetch(url);
            const data = await res.json();

            if (data.products?.length > 0) {
                const cards = data.products.slice(0, 5).map(renderProductCard).join("");
                resultDiv.innerHTML = cards;
            } else {
                resultDiv.innerHTML = `<div class="card"><p class="error">No results for "${keywords}"</p></div>`;
            }
        } catch {
            resultDiv.innerHTML = `<div class="card"><p class="error">Error fetching results.</p></div>`;
        }
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const keywords = keywordInput.value.trim();
        if (keywords) {
            searchByKeywords(keywords);
        } else {
            staticCards.style.display = "grid"; // Show static cards again
            resultDiv.innerHTML = ""; // Clear results
        }
    });
});
