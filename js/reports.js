// ================================
// NEXORA ERP - REPORTS JS
// ================================

document.addEventListener("DOMContentLoaded", function () {

    // ================================
    // STORAGE KEYS
    // ================================

    const SALES_KEY = "nexoraSales";
    const PRODUCTS_KEY = "nexoraProducts";
    const CUSTOMERS_KEY = "nexoraCustomers";
    const EMPLOYEES_KEY = "nexoraEmployees";


    // ================================
    // ELEMENTS
    // ================================

    const totalSalesElement =
        document.getElementById("reportTotalSales");

    const totalRevenueElement =
        document.getElementById("reportTotalRevenue");

    const totalProductsElement =
        document.getElementById("reportTotalProducts");

    const totalCustomersElement =
        document.getElementById("reportTotalCustomers");

    const salesTableBody =
        document.getElementById("reportSalesTableBody");

    const productTableBody =
        document.getElementById("reportProductTableBody");

    const inventoryTableBody =
        document.getElementById("reportInventoryTableBody");

    const employeeSummary =
        document.getElementById("employeeReportSummary");

    const customerSummary =
        document.getElementById("customerReportSummary");

    const salesSearch =
        document.getElementById("reportSalesSearch");

    const paymentFilter =
        document.getElementById("reportPaymentFilter");

    const productCategoryFilter =
        document.getElementById(
            "reportProductCategoryFilter"
        );

    const refreshButton =
        document.getElementById(
            "refreshReportsButton"
        );


    // ================================
    // FORMAT MONEY
    // ================================

    function formatMoney(amount) {

        return "$" +
            Number(amount || 0).toLocaleString(
                "en-US",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );
    }


    // ================================
    // LOAD DATA
    // ================================

    function getData(key) {

        const savedData =
            localStorage.getItem(key);

        if (!savedData) {
            return [];
        }

        try {

            return JSON.parse(savedData);

        } catch (error) {

            console.error(
                "Data loading error:",
                error
            );

            return [];
        }
    }


    // ================================
    // GET SALES
    // ================================

    function getSales() {

        return getData(SALES_KEY);
    }


    // ================================
    // GET PRODUCTS
    // ================================

    function getProducts() {

        return getData(PRODUCTS_KEY);
    }


    // ================================
    // GET CUSTOMERS
    // ================================

    function getCustomers() {

        return getData(CUSTOMERS_KEY);
    }


    // ================================
    // GET EMPLOYEES
    // ================================

    function getEmployees() {

        return getData(EMPLOYEES_KEY);
    }


    // ================================
    // UPDATE SUMMARY CARDS
    // ================================

    function updateSummary() {

        const sales =
            getSales();

        const products =
            getProducts();

        const customers =
            getCustomers();


        // Total sales

        const totalSales =
            sales.length;


        // Total revenue

        const totalRevenue =
            sales.reduce(
                function (total, sale) {

                    return total +
                        Number(
                            sale.grandTotal || 0
                        );
                },
                0
            );


        totalSalesElement.textContent =
            totalSales;


        totalRevenueElement.textContent =
            formatMoney(totalRevenue);


        totalProductsElement.textContent =
            products.length;


        totalCustomersElement.textContent =
            customers.length;
    }


    // ================================
    // SALES REPORT
    // ================================

    function renderSalesReport() {

        const sales =
            getSales();

        const customers =
            getCustomers();


        const searchText =
            salesSearch
                ? salesSearch.value
                    .toLowerCase()
                    .trim()
                : "";


        const selectedPayment =
            paymentFilter
                ? paymentFilter.value
                : "all";


        const filteredSales =
            sales.filter(function (sale) {

                const customer =
                    customers.find(
                        function (item) {

                            return (
                                item.id ===
                                sale.customerId
                            );
                        }
                    );


                const customerName =
                    customer
                        ? customer.name
                        : (
                            sale.customerName ||
                            "Walk-in Customer"
                        );


                const saleId =
                    String(
                        sale.id ||
                        sale.saleId ||
                        ""
                    );


                const matchesSearch =
                    saleId
                        .toLowerCase()
                        .includes(searchText) ||

                    customerName
                        .toLowerCase()
                        .includes(searchText);


                const payment =
                    String(
                        sale.paymentMethod || ""
                    );


                const matchesPayment =
                    selectedPayment === "all" ||
                    payment === selectedPayment;


                return (
                    matchesSearch &&
                    matchesPayment
                );
            });


        salesTableBody.innerHTML = "";


        if (filteredSales.length === 0) {

            salesTableBody.innerHTML = `
                <tr>
                    <td colspan="6"
                        style="text-align:center;">
                        No sales records found.
                    </td>
                </tr>
            `;

            return;
        }


        filteredSales.forEach(function (sale) {

            const customer =
                customers.find(
                    function (item) {

                        return (
                            item.id ===
                            sale.customerId
                        );
                    }
                );


            const customerName =
                customer
                    ? customer.name
                    : (
                        sale.customerName ||
                        "Walk-in Customer"
                    );


            const saleId =
                sale.id ||
                sale.saleId ||
                "N/A";


            const saleDate =
                sale.date ||
                sale.saleDate ||
                "N/A";


            const items =
                Array.isArray(sale.items)
                    ? sale.items.length
                    : 0;


            const payment =
                sale.paymentMethod ||
                "N/A";


            const total =
                Number(
                    sale.grandTotal || 0
                );


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${saleId}
                </td>

                <td>
                    ${saleDate}
                </td>

                <td>
                    ${customerName}
                </td>

                <td>
                    ${items}
                </td>

                <td>
                    ${payment}
                </td>

                <td>
                    ${formatMoney(total)}
                </td>

            `;


            salesTableBody.appendChild(row);

        });
    }


    // ================================
    // PRODUCT REPORT
    // ================================

    function getStockStatus(quantity) {

        quantity =
            Number(quantity || 0);


        if (quantity <= 0) {

            return "Out of Stock";

        }

        if (quantity <= 10) {

            return "Low Stock";

        }

        return "In Stock";
    }


    function renderProductReport() {

        const products =
            getProducts();


        const selectedCategory =
            productCategoryFilter
                ? productCategoryFilter.value
                : "all";


        const filteredProducts =
            products.filter(
                function (product) {

                    return (
                        selectedCategory === "all" ||
                        product.category ===
                        selectedCategory
                    );
                }
            );


        productTableBody.innerHTML = "";


        if (filteredProducts.length === 0) {

            productTableBody.innerHTML = `
                <tr>
                    <td colspan="6"
                        style="text-align:center;">
                        No products found.
                    </td>
                </tr>
            `;

            return;
        }


        filteredProducts.forEach(
            function (product) {

                const status =
                    getStockStatus(
                        product.quantity
                    );


                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${product.id}
                    </td>

                    <td>
                        ${product.name}
                    </td>

                    <td>
                        ${product.category}
                    </td>

                    <td>
                        ${formatMoney(product.price)}
                    </td>

                    <td>
                        ${product.quantity}
                    </td>

                    <td>
                        ${status}
                    </td>

                `;


                productTableBody.appendChild(row);

            }
        );
    }


    // ================================
    // INVENTORY REPORT
    // ================================

    function renderInventoryReport() {

        const products =
            getProducts();


        inventoryTableBody.innerHTML = "";


        if (products.length === 0) {

            inventoryTableBody.innerHTML = `
                <tr>
                    <td colspan="6"
                        style="text-align:center;">
                        No inventory data found.
                    </td>
                </tr>
            `;

            return;
        }


        products.forEach(function (product) {

            const quantity =
                Number(
                    product.quantity || 0
                );


            const price =
                Number(
                    product.price || 0
                );


            const stockValue =
                quantity * price;


            const status =
                getStockStatus(quantity);


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${product.name}
                </td>

                <td>
                    ${product.category}
                </td>

                <td>
                    ${quantity}
                </td>

                <td>
                    ${formatMoney(price)}
                </td>

                <td>
                    ${formatMoney(stockValue)}
                </td>

                <td>
                    ${status}
                </td>

            `;


            inventoryTableBody.appendChild(row);

        });
    }


    // ================================
    // EMPLOYEE REPORT
    // ================================

    function renderEmployeeReport() {

        const employees =
            getEmployees();


        employeeSummary.innerHTML = "";


        if (employees.length === 0) {

            employeeSummary.innerHTML = `
                <p>
                    No employee data available.
                </p>
            `;

            return;
        }


        const activeEmployees =
            employees.filter(
                function (employee) {

                    return (
                        String(
                            employee.status || ""
                        ).toLowerCase() ===
                        "active"
                    );
                }
            ).length;


        const inactiveEmployees =
            employees.filter(
                function (employee) {

                    return (
                        String(
                            employee.status || ""
                        ).toLowerCase() !==
                        "active"
                    );
                }
            ).length;


        employeeSummary.innerHTML = `

            <div class="report-summary-item">

                <span>
                    Total Employees
                </span>

                <strong>
                    ${employees.length}
                </strong>

            </div>


            <div class="report-summary-item">

                <span>
                    Active Employees
                </span>

                <strong>
                    ${activeEmployees}
                </strong>

            </div>


            <div class="report-summary-item">

                <span>
                    Inactive Employees
                </span>

                <strong>
                    ${inactiveEmployees}
                </strong>

            </div>

        `;
    }


    // ================================
    // CUSTOMER REPORT
    // ================================

    function renderCustomerReport() {

        const customers =
            getCustomers();


        customerSummary.innerHTML = "";


        if (customers.length === 0) {

            customerSummary.innerHTML = `
                <p>
                    No customer data available.
                </p>
            `;

            return;
        }


        const activeCustomers =
            customers.filter(
                function (customer) {

                    return (
                        String(
                            customer.status || ""
                        ).toLowerCase() ===
                        "active"
                    );
                }
            ).length;


        const inactiveCustomers =
            customers.filter(
                function (customer) {

                    return (
                        String(
                            customer.status || ""
                        ).toLowerCase() !==
                        "active"
                    );
                }
            ).length;


        customerSummary.innerHTML = `

            <div class="report-summary-item">

                <span>
                    Total Customers
                </span>

                <strong>
                    ${customers.length}
                </strong>

            </div>


            <div class="report-summary-item">

                <span>
                    Active Customers
                </span>

                <strong>
                    ${activeCustomers}
                </strong>

            </div>


            <div class="report-summary-item">

                <span>
                    Inactive Customers
                </span>

                <strong>
                    ${inactiveCustomers}
                </strong>

            </div>

        `;
    }


    // ================================
    // MONTHLY SALES DATA
    // ================================

    function getMonthlySalesData() {

        const sales =
            getSales();


        const months = [

            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"

        ];


        const salesData =
            new Array(12).fill(0);


        const revenueData =
            new Array(12).fill(0);


        sales.forEach(function (sale) {

            const saleDate =
                new Date(
                    sale.date ||
                    sale.saleDate
                );


            if (!isNaN(saleDate)) {

                const month =
                    saleDate.getMonth();


                salesData[month] += 1;


                revenueData[month] +=
                    Number(
                        sale.grandTotal || 0
                    );
            }
        });


        return {

            months,
            salesData,
            revenueData

        };
    }


    // ================================
    // PRODUCT CATEGORY DATA
    // ================================

    function getProductCategoryData() {

        const products =
            getProducts();


        const categories = {};


        products.forEach(function (product) {

            const category =
                product.category ||
                "Other";


            if (!categories[category]) {

                categories[category] = 0;
            }


            categories[category] += 1;

        });


        return {

            labels:
                Object.keys(categories),

            data:
                Object.values(categories)

        };
    }


    // ================================
    // CUSTOMER STATUS DATA
    // ================================

    function getCustomerStatusData() {

        const customers =
            getCustomers();


        let active = 0;
        let inactive = 0;


        customers.forEach(function (customer) {

            if (
                String(
                    customer.status || ""
                ).toLowerCase() ===
                "active"
            ) {

                active++;

            } else {

                inactive++;
            }
        });


        return {

            labels: [
                "Active",
                "Inactive"
            ],

            data: [
                active,
                inactive
            ]

        };
    }


    // ================================
    // CHART VARIABLES
    // ================================

    let salesChart = null;
    let revenueChart = null;
    let productChart = null;
    let customerChart = null;


    // ================================
    // UPDATE CHARTS
    // ================================

    function updateCharts() {

        if (
            typeof Chart ===
            "undefined"
        ) {

            console.error(
                "Chart.js is not loaded."
            );

            return;
        }


        const salesCanvas =
            document.getElementById(
                "reportSalesChart"
            );


        const revenueCanvas =
            document.getElementById(
                "reportRevenueChart"
            );


        const productCanvas =
            document.getElementById(
                "reportProductChart"
            );


        const customerCanvas =
            document.getElementById(
                "reportCustomerChart"
            );


        if (
            !salesCanvas ||
            !revenueCanvas ||
            !productCanvas ||
            !customerCanvas
        ) {

            return;
        }


        // Destroy old charts

        if (salesChart) {
            salesChart.destroy();
        }

        if (revenueChart) {
            revenueChart.destroy();
        }

        if (productChart) {
            productChart.destroy();
        }

        if (customerChart) {
            customerChart.destroy();
        }


        // ================================
        // MONTHLY DATA
        // ================================

        const monthlyData =
            getMonthlySalesData();


        // ================================
        // SALES CHART
        // ================================

        salesChart =
            new Chart(
                salesCanvas,
                {

                    type: "line",

                    data: {

                        labels:
                            monthlyData.months,

                        datasets: [

                            {

                                label:
                                    "Number of Sales",

                                data:
                                    monthlyData.salesData,

                                tension:
                                    0.3,

                                fill:
                                    false

                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio:
                            false,

                        scales: {

                            y: {

                                beginAtZero:
                                    true,

                                ticks: {

                                    stepSize: 1

                                }

                            }

                        }

                    }

                }
            );


        // ================================
        // REVENUE CHART
        // ================================

        revenueChart =
            new Chart(
                revenueCanvas,
                {

                    type: "bar",

                    data: {

                        labels:
                            monthlyData.months,

                        datasets: [

                            {

                                label:
                                    "Revenue",

                                data:
                                    monthlyData.revenueData

                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio:
                            false,

                        scales: {

                            y: {

                                beginAtZero:
                                    true

                            }

                        }

                    }

                }
            );


        // ================================
        // PRODUCT CHART
        // ================================

        const productData =
            getProductCategoryData();


        productChart =
            new Chart(
                productCanvas,
                {

                    type: "pie",

                    data: {

                        labels:
                            productData.labels,

                        datasets: [

                            {

                                label:
                                    "Products",

                                data:
                                    productData.data

                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio:
                            false

                    }

                }
            );


        // ================================
        // CUSTOMER CHART
        // ================================

        const customerData =
            getCustomerStatusData();


        customerChart =
            new Chart(
                customerCanvas,
                {

                    type: "doughnut",

                    data: {

                        labels:
                            customerData.labels,

                        datasets: [

                            {

                                label:
                                    "Customers",

                                data:
                                    customerData.data

                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio:
                            false

                    }

                }
            );
    }


    // ================================
    // REFRESH ALL REPORTS
    // ================================

    function refreshReports() {

        updateSummary();

        renderSalesReport();

        renderProductReport();

        renderInventoryReport();

        renderEmployeeReport();

        renderCustomerReport();

        updateCharts();
    }


    // ================================
    // SEARCH EVENT
    // ================================

    if (salesSearch) {

        salesSearch.addEventListener(
            "input",
            renderSalesReport
        );
    }


    // ================================
    // PAYMENT FILTER
    // ================================

    if (paymentFilter) {

        paymentFilter.addEventListener(
            "change",
            renderSalesReport
        );
    }


    // ================================
    // PRODUCT CATEGORY FILTER
    // ================================

    if (productCategoryFilter) {

        productCategoryFilter.addEventListener(
            "change",
            renderProductReport
        );
    }


    // ================================
    // REFRESH BUTTON
    // ================================

    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            function () {

                refreshReports();

                alert(
                    "Reports refreshed successfully!"
                );

            }
        );
    }


    // ================================
    // INITIAL LOAD
    // ================================

    refreshReports();

});