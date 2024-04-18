const express = require("express");
const fs = require("fs");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 2000;

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
      monthlyItemQuantities[month][item] = [quantity];
    } else {
      monthlyItemQuantities[month][item].push(quantity);
    }

    let totalQuantity = 0;
    for (const qty of monthlyItemQuantities[month][item]) {
      totalQuantity += qty;
    }

    if (
      !mostPopularItem[month] ||
      totalQuantity > mostPopularItem[month].quantity
    ) {
      mostPopularItem[month] = {
        item: item,
        quantity: totalQuantity,
      };
    }
  });

  const result = {};

  for (const month in mostPopularItem) {
    const item = mostPopularItem[month].item;
    const quantities = monthlyItemQuantities[month][item];
    let minQuantity = Infinity;
    let maxQuantity = -Infinity;
    let sum = 0;
    let count = 0;

    for (const qty of quantities) {
      if (qty < minQuantity) {
        minQuantity = qty;
      }
      if (qty > maxQuantity) {
        maxQuantity = qty;
      }
      sum += qty;
      count++;
    }

    const avgQuantity = sum / count;

    result[month] = {
      item: item,
      minOrders: minQuantity,
      maxOrders: maxQuantity,
      avgOrders: avgQuantity,
    };
  }

  res.json(result);
});

app.get("/", (req, resp) => {
  resp.send("Welcome to analytics");
});

app.listen(PORT, () => {
  console.log("app running at port 2000");
});
