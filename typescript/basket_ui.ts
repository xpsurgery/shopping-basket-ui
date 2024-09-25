// To run this script:
// deno run --allow-all --unstable-ffi --allow-ffi basket_ui.ts

import { WebUI } from "https://deno.land/x/webui/mod.ts";

const myHtml = `
<!DOCTYPE html>
<html>
	<head>
    <script src="webui.js"></script>
		<title>XPSurgery | Shopping basket exercise</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        color: white;
        background: linear-gradient(#097ca6, #58a6c3);
        text-align: left;
        font-size: 18px;
      }
      button, input {
        padding: 10px;
        margin: 10px;
        border-radius: 3px;
        border: 1px solid #ccc;
        box-shadow: 0 3px 5px rgba(0,0,0,0.1);
        transition: 0.2s;
      }
      button {
        background: #3498db;
        color: #fff;
        cursor: pointer;
        font-size: 16px;
      }
      button:hover { background: #c9913d; }
      input:focus { outline: none; border-color: #3498db; }
    </style>
    </head>
    <body>
        <h1>Welcome to the XP Surgery Shoppe!</h1><br>
        <section>
          <h2>Emmental</h2>
          <div style="display: flex">
            <div>Price: <input id="emmentalPrice"></div>
            <button id="addemmental">Add</button>
          </div>
        </section>
        <section>
          <h2>Screwdrivers</h2>
          <div style="display: flex">
            <div>Price: <input id="screwdriverPrice"></div>
            <button id="addscrewdriver">Add</button>
          </div>
        </section>
        <section>
          <h2>Basket</h2>
          <div id="basketTotal">Total: 0</div>
        </section>
        <section>
          <button id="exit">Exit</button>
        </section>
        <script>
            let CurrentTotal = 0;

            function getEmmentalPrice() {
              return parseInt(document.getElementById('emmentalPrice').value);
            }

            function getScrewdriverPrice() {
              return parseInt(document.getElementById('screwdriverPrice').value);
            }

            function set_total(newTotal) {
              CurrentTotal = newTotal;
              document.getElementById("basketTotal").innerHTML = 'Total: ' + CurrentTotal;
            }
        </script>
    </body>
</html>
`;

const form = new WebUI();
form.bind("exit", () => WebUI.exit());

interface Product {
  price: number,
}

class Screwdriver {
  price: number

  constructor(parse: number)
  {
    this.price = parse;
  }
}

class Emmental {
  price: number

  constructor(price: number)
  {
    this.price = price
  }
}


class ShoppingCart {
  private form: WebUI
  private products: Product[] = []

  constructor(form: WebUI) {
    this.form = form
    this.form.bind("addemmental", this.addEmmental.bind(this));
    this.form.bind("addscrewdriver", this.addScrewdriver.bind(this));
  }

  async addEmmental(e: WebUI.Event): Promise<void> {
    const price = await this.form.script("return getEmmentalPrice()");
    this.products.push(new Emmental(parseInt(price)))
    const basketTotal = this.products.reduce((tot, p) => tot + p.price, 0)
    this.form.run(`set_total(${basketTotal});`);
  }

  async addScrewdriver(e: WebUI.Event) {
    const price = await this.form.script("return getScrewdriverPrice()");
    this.products.push(new Screwdriver(parseInt(price)))
    const basketTotal = this.products.reduce((tot, p) => tot + p.price, 0)
    this.form.run(`set_total(${basketTotal});`);
  }
}

const cart = new ShoppingCart(form)

form.show(myHtml);
await WebUI.wait();

console.log("Thank you for shopping!");

