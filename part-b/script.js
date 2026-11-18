let allDeals = [];
let useLive = false;
let currency = "R";

const dealsDiv = document.getElementById("deals");
const searchBox = document.getElementById("search");
const saleBox = document.getElementById("onlySale");
const sourceBtn = document.getElementById("sourceBtn");
const info = document.getElementById("info");

async function loadDeals() {
  if (useLive) {
    const response = await fetch(
      "https://www.cheapshark.com/api/1.0/deals?pageSize=10"
    );
    const data = await response.json();

    // cheapshark sends prices as strings and only gives a store id,
    // so I change it to look like my own deals.json
    const converted = [];
    for (let i = 0; i < data.length; i++) {
      converted.push({
        id: data[i].dealID,
        title: data[i].title,
        normalPrice: Number(data[i].normalPrice),
        salePrice: Number(data[i].salePrice),
        store: "Store " + data[i].storeID,
      });
    }
    return converted;
  }

  const response = await fetch("deals.json");
  return await response.json();
}

function isOnSale(deal) {
  return deal.salePrice < deal.normalPrice;
}

function getCurrentPrice(deal) {
  if (isOnSale(deal)) {
    return deal.salePrice;
  }
  return deal.normalPrice;
}

function getDiscount(deal) {
  if (!isOnSale(deal)) {
    return 0;
  }
  return Math.round(((deal.normalPrice - deal.salePrice) / deal.normalPrice) * 100);
}

function cheapestGame(deals) {
  let cheapest = deals[0];
  for (let i = 1; i < deals.length; i++) {
    if (getCurrentPrice(deals[i]) < getCurrentPrice(cheapest)) {
      cheapest = deals[i];
    }
  }
  return cheapest;
}

// applies the search box and the checkbox
function getFilteredDeals() {
  const search = searchBox.value.toLowerCase();
  const onlySale = saleBox.checked;
  const results = [];

  for (let i = 0; i < allDeals.length; i++) {
    const deal = allDeals[i];
    if (!deal.title.toLowerCase().includes(search)) {
      continue;
    }
    if (onlySale && !isOnSale(deal)) {
      continue;
    }
    results.push(deal);
  }
  return results;
}

function showDeals() {
  const deals = getFilteredDeals();
  dealsDiv.innerHTML = "";

  if (deals.length === 0) {
    dealsDiv.innerHTML = '<p class="empty">No games found.</p>';
    info.textContent = "";
    return;
  }

  const cheapest = cheapestGame(deals);
  info.textContent =
    deals.length + " games shown. Cheapest right now: " + cheapest.title +
    " (" + currency + getCurrentPrice(cheapest).toFixed(2) + ")";

  for (let i = 0; i < deals.length; i++) {
    const deal = deals[i];
    const onSale = isOnSale(deal);

    const card = document.createElement("div");
    card.className = onSale ? "deal on-sale" : "deal";

    let html = "<div><h3></h3><span class='store'></span></div>";
    html += "<div class='prices'>";
    if (onSale) {
      html += "<div class='normal crossed'>" + currency + deal.normalPrice.toFixed(2) + "</div>";
      html += "<div class='sale'>" + currency + deal.salePrice.toFixed(2) + "</div>";
    } else {
      html += "<div class='normal'>" + currency + deal.normalPrice.toFixed(2) + "</div>";
    }
    html += "</div>";
    card.innerHTML = html;

    // textContent for the title/store so weird characters from the api dont break the page
    const title = card.querySelector("h3");
    title.textContent = deal.title;
    if (onSale) {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = "ON SALE -" + getDiscount(deal) + "%";
      title.appendChild(tag);
    }
    card.querySelector(".store").textContent = deal.store;

    dealsDiv.appendChild(card);
  }
}

async function start() {
  info.textContent = "Loading...";
  try {
    allDeals = await loadDeals();
    showDeals();
  } catch (error) {
    console.log(error);
    dealsDiv.innerHTML =
      '<p class="empty">Could not load the deals. If you opened the file directly, use a local server (see README).</p>';
    info.textContent = "";
  }
}

searchBox.addEventListener("input", showDeals);
saleBox.addEventListener("change", showDeals);

sourceBtn.addEventListener("click", function () {
  useLive = !useLive;
  // cheapshark prices are in dollars, not rand
  currency = useLive ? "$" : "R";
  sourceBtn.textContent = useLive
    ? "Go back to my deals.json"
    : "Use live CheapShark deals";
  start();
});

start();