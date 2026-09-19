document.addEventListener("DOMContentLoaded", function () {

    const notificationButton = document.getElementById("notificationButton");
    const notificationPanel = document.getElementById("notificationPanel");
    const notificationList = document.getElementById("notificationList");
    const notificationCount = document.getElementById("notificationCount");
    const clearNotificationsButton = document.getElementById("clearNotificationsButton");


    // Get data from LocalStorage
    function getProducts() {
        return JSON.parse(localStorage.getItem("nexoraProducts")) || [];
    }


    function getSales() {
        return JSON.parse(localStorage.getItem("nexoraSales")) || [];
    }


    function getCustomers() {
        return JSON.parse(localStorage.getItem("nexoraCustomers")) || [];
    }


    // Create notifications
    function generateNotifications() {

        const notifications = [];

        const products = getProducts();
        const sales = getSales();
        const customers = getCustomers();


        // Low / Out of Stock Products
        products.forEach(function (product) {

            const quantity = Number(product.quantity) || 0;

            if (quantity === 0) {

                notifications.push({
                    type: "danger",
                    title: "Out of Stock",
                    message: `${product.name} is out of stock.`,
                    time: "Inventory Alert"
                });

            } else if (quantity <= 10) {

                notifications.push({
                    type: "warning",
                    title: "Low Stock Alert",
                    message: `${product.name} stock is running low. Only ${quantity} left.`,
                    time: "Inventory Alert"
                });

            }

        });


        // New Orders
        if (sales.length > 0) {

            const latestSale = sales[sales.length - 1];

            notifications.push({
                type: "success",
                title: "New Order",
                message: `New sale received from ${latestSale.customer || "Customer"}.`,
                time: "Sales"
            });

        }


        // New Customers
        if (customers.length > 0) {

            const latestCustomer = customers[customers.length - 1];

            notifications.push({
                type: "info",
                title: "New Customer",
                message: `${latestCustomer.name || "A new customer"} has been added.`,
                time: "Customers"
            });

        }


        // System Notification
        notifications.push({
            type: "info",
            title: "System Update",
            message: "NEXORA ERP dashboard is running normally.",
            time: "System"
        });


        return notifications;
    }


    // Display notifications
    function renderNotifications() {

        const notifications = generateNotifications();


        // Notification count
        notificationCount.textContent = notifications.length;


        // If no notification
        if (notifications.length === 0) {

            notificationList.innerHTML = `
                <p class="no-notification">
                    No new notifications.
                </p>
            `;

            return;
        }


        // Show notifications
        notificationList.innerHTML = notifications.map(function (notification) {

            return `
                <div class="notification-item ${notification.type}">

                    <div class="notification-item-header">

                        <strong>
                            ${notification.title}
                        </strong>

                        <span>
                            ${notification.time}
                        </span>

                    </div>

                    <p>
                        ${notification.message}
                    </p>

                </div>
            `;

        }).join("");

    }


    // Open / Close notification panel
    if (notificationButton) {

        notificationButton.addEventListener("click", function (event) {

            event.stopPropagation();

            notificationPanel.classList.toggle("show");

        });

    }


    // Prevent panel click from closing itself
    if (notificationPanel) {

        notificationPanel.addEventListener("click", function (event) {

            event.stopPropagation();

        });

    }


    // Close notification panel when clicking outside
    document.addEventListener("click", function () {

        if (notificationPanel) {

            notificationPanel.classList.remove("show");

        }

    });


    // Clear notifications
    if (clearNotificationsButton) {

        clearNotificationsButton.addEventListener("click", function () {

            notificationList.innerHTML = `
                <p class="no-notification">
                    No new notifications.
                </p>
            `;

            notificationCount.textContent = "0";

        });

    }


    // Refresh notifications
    renderNotifications();


    // Make function available globally
    window.refreshNotifications = renderNotifications;

});