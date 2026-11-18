const fs = require("fs/promises");

async function fetchDeals() {
  const response = await fs.readFile("./PART A/deals.json", "utf-8");
  const deals = JSON.parse(response);
  return deals;
}

function gamesOnSale(deals) {
  for (let i = 0; i < deals.length; i++) {
    const deal = deals[i];
    if (deal.salePrice < deal.normalPrice) {
      console.log(`Game: ${deal.title}`);
    }
  }
}

function gamesDiscount(deals) {
  for (let i = 0; i < deals.length; i++) {
    const deal = deals[i];
    if (deal.salePrice < deal.normalPrice) {
      const discount =
        ((deal.normalPrice - deal.salePrice) / deal.normalPrice) * 100;
      console.log(`Game: ${deal.title} - Discount: ${discount.toFixed(2)}%`);
    }
  }
}


function getOnSale(deals) {
  const onSale = [];
  for (let i = 0; i < deals.length; i++) {
    const deal = deals[i];
    if (deal.salePrice < deal.normalPrice) {
      onSale.push(deal);
    }
  }
  return onSale;
}


function getDiscount(deal) {
  if (deal.salePrice >= deal.normalPrice) {
    return 0;
  }
  const discount = ((deal.normalPrice - deal.salePrice) / deal.normalPrice) * 100;
  return Math.round(discount);
}


function getCurrentPrice(deal) {
  if (deal.salePrice < deal.normalPrice) {
    return deal.salePrice;
  }
  return deal.normalPrice;
}

function cheapestGame(deals) {
  let cheapest = deals[0];
  for (let i = 1; i < deals.length; i++) {
    const deal = deals[i];
    if (getCurrentPrice(deal) < getCurrentPrice(cheapest)) {
      cheapest = deal;
    }
  }
  return cheapest;
}


function searchGames(deals, word) {
  const results = [];
  const search = word.toLowerCase();
  for (let i = 0; i < deals.length; i++) {
    const deal = deals[i];
    if (deal.title.toLowerCase().includes(search)) {
      results.push(deal);
    }
  }
  return results;
}

async function main() {
  const deals = await fetchDeals();
  gamesOnSale(deals);
  gamesDiscount(deals);

  console.log("---- on sale (returned list) ----");
  const onSale = getOnSale(deals);
  console.log(onSale.length + " games on sale");

  console.log("---- whole number discounts ----");
  for (let i = 0; i < onSale.length; i++) {
    console.log(`${onSale[i].title}: ${getDiscount(onSale[i])}%`);
  }

  console.log("---- cheapest ----");
  const cheapest = cheapestGame(deals);
  console.log(`${cheapest.title} at R${getCurrentPrice(cheapest)}`);

  console.log("---- search ----");
  console.log(searchGames(deals, "hol")); //case Insensitive
  console.log(searchGames(deals, "ST"));  //case Insensitive
  console.log(searchGames(deals, "zzz")); //not in the list
}

main();