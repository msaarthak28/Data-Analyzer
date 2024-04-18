# Ice Cream Sales API

This API provides endpoints to analyze ice cream sales data. It includes functionality to calculate total sales, month-wise sales totals, most popular items, revenue-generating items, and statistics for the most popular item.

## Endpoints

### Total Sales

- **URL:** `/totalSales`
- **Method:** GET
- **Description:** Calculates the total sales of the store.
- **Response:** JSON object with the total sales value.

### Month-wise Sales Totals

- **URL:** `/monthWiseSales`
- **Method:** GET
- **Description:** Calculates the sales totals for each month.
- **Response:** JSON object with month-wise sales totals.

### Most Popular Item

- **URL:** `/mostPopularItem`
- **Method:** GET
- **Description:** Finds the most popular item (most quantity sold) in each month.
- **Response:** JSON object with the most popular item for each month.

### Revenue-generating Items

- **URL:** `/highestRevenueItems`
- **Method:** GET
- **Description:** Identifies the items generating the most revenue in each month.
- **Response:** JSON array with revenue-generating items for each month.

### Min-Max-Avg Orders

- **URL:** `/mostPopularItemStats`
- **Method:** GET
- **Description:** Calculates the minimum, maximum, and average orders for the most popular item in each month.
- **Response:** JSON object with statistics for the most popular item in each month.

## Deployment

- The API's are deployed at [Data Analyzer API's](https://data-analyzer-28a33d21fbe6.herokuapp.com/)
- The complete project is deployed and accessible at [Data Analyzer](https://data-analyzer-ui-c275ac72c028.herokuapp.com/).

## Usage

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Start the server using `npm start`.
4. Send requests to the provided endpoints using a tool like Postman or cURL.

## Data Format

The API expects data in CSV format with the following columns: Date, SKU, Unit Price, Quantity, Total Price. Ensure that the data file is named `data.txt` and placed in the `data` directory within the project.

## Dependencies

- Node.js
- Express.js: For creating the RESTful API endpoints.
- fs: For file system operations like reading data from a file.
