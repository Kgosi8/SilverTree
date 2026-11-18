# PC Game Deals

## Part D: Write-up

**Setup**
1. Install Node.js (only needed for Part A).
2. Part A: open functions.js, right click anywhere on the code and click "run code". This is done using VScode as yout IDE. It reads `PART A/deals.json` and prints the results.
3. part-b: open the `PART B` folder in VS Code and right click `index.html` -> "Open with Live Server". (Or run `npx serve` inside `PART B` and open the link it gives you.) Opening the file by double clicking won't work, because the browser blocks `fetch` on local files.
4. Use the search box, the "only on sale" checkbox, and the button to switch to the live CheapShark data.

**Choices**
I kept it to plain `for` loops and small functions so the logic is easy to read. In Part A the functions return the games (not just print) so I could reuse them in the page. The page uses one `getFilteredDeals` function so the search and the checkbox work together. I rounded the discount with `Math.round` as the brief asked for a whole number. I used plain HTML/CSS/JS and no framework since the brief said that was fine.

**Obstacles**
- `fetch("deals.json")` fails when the page is opened straight from the folder, so I had to run it through a local server.
- CheapShark gives prices as strings and only a store id (not a name), so I convert them to numbers and match them to my own data shape. Its prices are also in dollars, so I switch the symbol to `$` when live data is on.
- Games that aren't on sale must not show a sale price or the tag, so everything checks `salePrice < normalPrice` first.

**Resources**
MDN docs (fetch, `includes`, `toLowerCase`), the CheapShark API docs, and an AI tool (Claude) to help tidy the code, and get suggestions which I then read through and tested myself.

**Time**
[fill in your real time here, e.g. about 3 hours]

**Next time**
- Get the real store names from CheapShark's `/stores` endpoint.
- Sort options (cheapest first, biggest discount first).
- Better styling and a loading spinner.
- Debounce the search for bigger lists.