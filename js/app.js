// const { listenerCount } = require("gulp");

function Calculator(form, summary) {
  // price list
  this.prices = {
    products: 0.5,
    orders: 0.25,
    package: {
      basic: 0,
      professional: 25,
      premium: 60
    },
    accounting: 35,
    terminal: 5
  };
  // form elements
  this.form = {
    products: form.querySelector("#products"),
    orders: form.querySelector("#orders"),
    package: form.querySelector("#package"),
    accounting: form.querySelector("#accounting"),
    terminal: form.querySelector("#terminal")
  };
//  summary elements
  this.summary = {
    list: summary.querySelector("ul"),
    items: summary.querySelector("ul").children,
    
    total: {
      container: summary.querySelector("#total-price"),
      price: summary.querySelector(".total-price")
    }
  };
  
  this.addEvents();
};

Calculator.prototype.addEvents = function() {
  // Inputs
  this.form.products.addEventListener("change", this.inputEvent.bind(this));
  this.form.products.addEventListener("keyup", this.inputEvent.bind(this));
  this.form.orders.addEventListener("change", this.inputEvent.bind(this));
  this.form.orders.addEventListener("keyup", this.inputEvent.bind(this));

  // Select
  this.form.package.addEventListener("click", this.selectPackage.bind(this));

  // Checkboxes
  this.form.accounting.addEventListener("change", this.checkboxEvent.bind(this));
  this.form.terminal.addEventListener("change", this.checkboxEvent.bind(this));
};

Calculator.prototype.updateTotal = function() {
  let show = this.summary.list.querySelectorAll(".open").length > 0;

  if (show) {
    let productSum = this.form.products.value < 0 ? 0 : this.form.products.value * this.prices.products;
    let ordersSum = this.form.orders.value < 0 ? 0 : this.form.orders.value * this.prices.orders;
    let packagePrice = this.form.package.dataset.value.length === 0 ? 0 : this.prices.package[this.form.package.dataset.value];
    let accounting = this.form.accounting.checked ? this.prices.accounting : 0;
    let terminal = this.form.terminal.checked ? this.prices.terminal : 0;

    this.summary.total.price.innerText = "$" + (productSum + ordersSum + packagePrice + accounting + terminal);

    this.summary.total.container.classList.add("open");
  } else {
    this.summary.total.container.classList.remove("open");
  }
};


Calculator.prototype.inputEvent = function(e) {
  let id = e.currentTarget.id;
  let value = e.currentTarget.value;
  let singlePrice = this.prices[id];
  let totalPrice = value * singlePrice;
  
  
  this.sumValue(id, value + " * $" + singlePrice, totalPrice, function(item, calc, total) {
    if(value < 0) {
      calc.innerHTML = null;
      total.innerText = "Value should be greater than 0";
    }

    if(value === 0) {
      item.classList.remove("open");
    }
  });
  this.updateTotal();
};



Calculator.prototype.sumValue = function(id, calc, total, callback) {
  let sum = this.summary.list.querySelector("[data-id=" + id + "]");
  let sumCalc = sum.querySelector(".item-calc");
  let sumTotal = sum.querySelector(".item-price");

  sum.classList.add("open");

  if (sumCalc !== null) {
    sumCalc.innerText = calc;
  };

  sumTotal.innerText = "$" + total;

  if(typeof callback === "function") {
    callback(sum, sumCalc, sumTotal);
  };
};


Calculator.prototype.selectPackage = function(e) {
  this.form.package.classList.toggle("open");


  let value = typeof e.target.dataset.value !== "undefined" ? e.target.dataset.value : "";
  let text = typeof e.target.dataset.value !== "undefined" ? e.target.innerText : "Choose package";

  if (value.length > 0) {
    this.form.package.dataset.value = value;
    this.form.package.querySelector(".select-input").innerText = text;

    this.sumValue("package", text, this.prices.package[value]);
    this.updateTotal();
  }
};

Calculator.prototype.checkboxEvent = function(e) {
  let checkbox = e.currentTarget;
  let id = checkbox.id;
  let checked = e.currentTarget.checked;

  this.sumValue(id, undefined, this.prices[id], function (item) {
    if (!checked) {
      item.classList.remove("open");
    }
  });
  this.updateTotal();
};


document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".calc-form");
  const summary = document.querySelector(".calc-summary");

  new Calculator(form, summary);
});