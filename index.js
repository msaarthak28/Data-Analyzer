const express = require("express");
const fs = require("fs");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4000;

const data = fs
  .readFileSync("./data/data.txt", "utf8")
  .split("\n")
  .map((line) => line.split(","));

const header = data.shift();

const formattedData = data.map((row) => {
  const obj = {};
  header.forEach((key, index) => {
    obj[key] = row[index];
  });
  return obj;
});

app.get("/totalSales", (req, res) => {
  let totalSales = 0;
  formattedData.forEach((row) => {
    totalSales += parseFloat(row["Total Price"]);
  });
  res.json({totalSales});
});

app.get("/monthWiseSales", (req, res) => {
  const monthWiseSales = {};
  formattedData.forEach((row) => {
    const date = new Date(row.Date);
    const month = date.getMonth() + 1;
    if (!monthWiseSales[month]) {
      monthWiseSales[month] = 0;
    }
    monthWiseSales[month] += parseFloat(row["Total Price"]);
  });
  res.json(monthWiseSales);
});

app.get("/mostPopularItem", (req, res) => {
  const mostPopularItem = {};
  const monthlyItemQuantities = {};

  formattedData.forEach((row) => {
    const date = new Date(row.Date);
    const month = date.getMonth() + 1;
    const item = row.SKU;
    const quantity = parseInt(row.Quantity);

    if (!monthlyItemQuantities[month]) {
      monthlyItemQuantities[month] = {};
    }

    if (!monthlyItemQuantities[month][item]) {
      monthlyItemQuantities[month][item] = quantity;
    } else {
      monthlyItemQuantities[month][item] += quantity;
    }

    if (
      !mostPopularItem[month] ||
      monthlyItemQuantities[month][item] > mostPopularItem[month].quantity
    ) {
      mostPopularItem[month] = {
        item: item,
        quantity: monthlyItemQuantities[month][item],
      };
    }
  });

  res.json(mostPopularItem);
});

app.get("/highestRevenueItems", (req, res) => {
  const highestRevenueItems = {};
  const monthlyItemRevenues = {};

  formattedData.forEach((row) => {
    const date = new Date(row.Date);
    const month = date.getMonth() + 1;
    const item = row.SKU;
    const revenue = parseFloat(row["Total Price"]);

    if (!monthlyItemRevenues[month]) {
      monthlyItemRevenues[month] = {};
    }

    if (!monthlyItemRevenues[month][item]) {
      monthlyItemRevenues[month][item] = revenue;
    } else {
      monthlyItemRevenues[month][item] += revenue;
    }

    if (
      !highestRevenueItems[month] ||
      monthlyItemRevenues[month][item] > highestRevenueItems[month].revenue
    ) {
      highestRevenueItems[month] = {
        item: item,
        revenue: monthlyItemRevenues[month][item],
      };
    }
  });

  res.json(highestRevenueItems);
});

app.get("/mostPopularItemStats", (req, res) => {
  const mostPopularItemStats = {};

  formattedData.forEach((row) => {
    const date = new Date(row.Date);
    const month = date.getMonth() + 1;
    const item = row.SKU;
    const quantity = parseInt(row.Quantity);

    if (!mostPopularItemStats[month]) {
      mostPopularItemStats[month] = {
        item: "",
        quantity: 0,
        orders: [],
      };
    }

    if (quantity > mostPopularItemStats[month].quantity) {
      mostPopularItemStats[month].item = item;
      mostPopularItemStats[month].quantity = quantity;
      mostPopularItemStats[month].orders = [quantity];
    } else if (quantity === mostPopularItemStats[month].quantity) {
      mostPopularItemStats[month].orders.push(quantity);
    }
  });

  for (const month in mostPopularItemStats) {
    const orders = mostPopularItemStats[month].orders;
    const minOrders = Math.min(...orders);
    const maxOrders = Math.max(...orders);
    const avgOrders = orders.reduce((acc, val) => acc + val, 0) / orders.length;
    mostPopularItemStats[month].minOrders = minOrders;
    mostPopularItemStats[month].maxOrders = maxOrders;
    mostPopularItemStats[month].avgOrders = avgOrders;
    delete mostPopularItemStats[month].orders;
  }

  res.json(mostPopularItemStats);
});

app.get("/", (req, resp) => {
  resp.send("Welcome to analytics");
});

app.listen(PORT, () => {
  console.log("app running at port 2000");
});
