// ========================================
// NEXORA ERP - Dashboard JavaScript
// ========================================


// ========================================
// DASHBOARD STATISTICS
// ========================================

function updateDashboardStats() {

    const totalRevenue = document.getElementById("totalRevenue");
    const totalSales = document.getElementById("totalSales");
    const totalCustomers = document.getElementById("totalCustomers");
    const totalEmployees = document.getElementById("totalEmployees");
    const totalProducts = document.getElementById("totalProducts");
    const totalOrders = document.getElementById("totalOrders");


    // Demo ERP Data

    const dashboardData = {
        revenue: 125500,
        sales: 1250,
        customers: 850,
        employees: 120,
        products: 540,
        orders: 2430
    };


    // Update Revenue

    if (totalRevenue) {
        totalRevenue.textContent =
            "$" + dashboardData.revenue.toLocaleString();
    }


    // Update Sales

    if (totalSales) {
        totalSales.textContent =
            dashboardData.sales.toLocaleString();
    }


    // Update Customers

    if (totalCustomers) {
        totalCustomers.textContent =
            dashboardData.customers.toLocaleString();
    }


    // Update Employees

    if (totalEmployees) {
        totalEmployees.textContent =
            dashboardData.employees.toLocaleString();
    }


    // Update Products

    if (totalProducts) {
        totalProducts.textContent =
            dashboardData.products.toLocaleString();
    }


    // Update Orders

    if (totalOrders) {
        totalOrders.textContent =
            dashboardData.orders.toLocaleString();
    }
}



// ========================================
// DASHBOARD CHARTS
// ========================================

document.addEventListener("DOMContentLoaded", function () {


    // ====================================
    // UPDATE DASHBOARD STATISTICS
    // ====================================

    updateDashboardStats();



    // ====================================
    // SALES OVERVIEW CHART
    // ====================================

    const salesCanvas =
        document.getElementById("salesChart");


    if (salesCanvas && typeof Chart !== "undefined") {

        new Chart(salesCanvas, {

            type: "line",

            data: {

                labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June"
                ],

                datasets: [
                    {
                        label: "Sales",

                        data: [
                            120,
                            190,
                            150,
                            220,
                            280,
                            320
                        ],

                        borderWidth: 3,

                        tension: 0.4,

                        fill: false
                    }
                ]
            },


            options: {

                responsive: true,

                maintainAspectRatio: false,


                plugins: {

                    legend: {
                        display: true
                    }
                },


                scales: {

                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

    }



    // ====================================
    // REVENUE OVERVIEW CHART
    // ====================================

    const revenueCanvas =
        document.getElementById("revenueChart");


    if (revenueCanvas && typeof Chart !== "undefined") {

        new Chart(revenueCanvas, {

            type: "bar",

            data: {

                labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June"
                ],

                datasets: [
                    {
                        label: "Revenue ($)",

                        data: [
                            12000,
                            18000,
                            15000,
                            23000,
                            28000,
                            35000
                        ],

                        borderWidth: 1
                    }
                ]
            },


            options: {

                responsive: true,

                maintainAspectRatio: false,


                plugins: {

                    legend: {
                        display: true
                    }
                },


                scales: {

                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

    }

});