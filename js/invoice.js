/* =========================================================
   NEXORA ERP - INVOICE MANAGEMENT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const invoiceSearch = document.getElementById("invoiceSearch");
    const invoicePaymentFilter = document.getElementById("invoicePaymentFilter");
    const invoiceCount = document.getElementById("invoiceCount");
    const invoiceTableBody = document.getElementById("invoiceTableBody");

    const invoiceModal = document.getElementById("invoiceModal");

    const closeInvoiceButton = document.getElementById("closeInvoiceButton");
    const closeInvoiceBottomButton = document.getElementById("closeInvoiceBottomButton");
    const printInvoiceButton = document.getElementById("printInvoiceButton");

    const invoiceViewId = document.getElementById("invoiceViewId");
    const invoiceViewCustomer = document.getElementById("invoiceViewCustomer");
    const invoiceViewCustomerEmail = document.getElementById("invoiceViewCustomerEmail");
    const invoiceViewCustomerPhone = document.getElementById("invoiceViewCustomerPhone");
    const invoiceViewDate = document.getElementById("invoiceViewDate");
    const invoiceViewSaleId = document.getElementById("invoiceViewSaleId");
    const invoiceViewPayment = document.getElementById("invoiceViewPayment");

    const invoiceItemsBody = document.getElementById("invoiceItemsBody");

    const invoiceViewSubtotal = document.getElementById("invoiceViewSubtotal");
    const invoiceViewDiscount = document.getElementById("invoiceViewDiscount");
    const invoiceViewVat = document.getElementById("invoiceViewVat");
    const invoiceViewGrandTotal = document.getElementById("invoiceViewGrandTotal");

    /* =====================================================
       IMPORTANT:
       HIDE INVOICE MODAL WHEN PAGE LOADS
    ===================================================== */

    if (invoiceModal) {
        invoiceModal.style.display = "none";
        invoiceModal.classList.remove("show");
    }


    /* =====================================================
       LOAD DATA
    ===================================================== */

    let sales = [];
    let customers = [];

    try {
        sales = JSON.parse(localStorage.getItem("nexoraSales")) || [];
    } catch (error) {
        console.error("Error loading sales:", error);
        sales = [];
    }

    try {
        customers = JSON.parse(localStorage.getItem("nexoraCustomers")) || [];
    } catch (error) {
        console.error("Error loading customers:", error);
        customers = [];
    }


    /* =====================================================
       DEMO SALES DATA
       Only used if no sales exist
    ===================================================== */

    if (sales.length === 0) {

        sales = [
            {
                id: "SALE001",
                customerId: "CUS001",
                customerName: "Rahim Ahmed",
                customerEmail: "rahim@example.com",
                customerPhone: "01711111111",
                date: "2026-09-01",
                paymentMethod: "Cash",
                items: [
                    {
                        productId: "PRD001",
                        productName: "NEXORA Pro Laptop",
                        quantity: 1,
                        price: 85000
                    }
                ],
                subtotal: 85000,
                discount: 0,
                vat: 4250,
                grandTotal: 89250
            },
            {
                id: "SALE002",
                customerId: "CUS002",
                customerName: "Karim Hasan",
                customerEmail: "karim@example.com",
                customerPhone: "01822222222",
                date: "2026-09-03",
                paymentMethod: "Card",
                items: [
                    {
                        productId: "PRD002",
                        productName: "NEXORA Monitor",
                        quantity: 2,
                        price: 18000
                    }
                ],
                subtotal: 36000,
                discount: 1000,
                vat: 1750,
                grandTotal: 36750
            },
            {
                id: "SALE003",
                customerId: "CUS003",
                customerName: "Nusrat Jahan",
                customerEmail: "nusrat@example.com",
                customerPhone: "01933333333",
                date: "2026-09-05",
                paymentMethod: "Mobile Banking",
                items: [
                    {
                        productId: "PRD003",
                        productName: "NEXORA Keyboard",
                        quantity: 1,
                        price: 2500
                    },
                    {
                        productId: "PRD004",
                        productName: "NEXORA Mouse",
                        quantity: 2,
                        price: 1200
                    }
                ],
                subtotal: 4900,
                discount: 200,
                vat: 235,
                grandTotal: 4935
            }
        ];

        localStorage.setItem("nexoraSales", JSON.stringify(sales));
    }


    /* =====================================================
       SUMMARY ELEMENTS
    ===================================================== */

    const totalInvoices = document.getElementById("totalInvoices");
    const totalInvoiceAmount = document.getElementById("totalInvoiceAmount");
    const todayInvoices = document.getElementById("todayInvoices");
    const averageInvoice = document.getElementById("averageInvoice");


    /* =====================================================
       FORMAT CURRENCY
    ===================================================== */

    function formatCurrency(amount) {

        amount = Number(amount) || 0;

        return "৳" + amount.toLocaleString("en-BD", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    function formatDate(dateValue) {

        if (!dateValue) {
            return "-";
        }

        const date = new Date(dateValue);

        if (isNaN(date.getTime())) {
            return dateValue;
        }

        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }


    /* =====================================================
       GET CUSTOMER
    ===================================================== */

    function getCustomer(customerId) {

        return customers.find(function (customer) {
            return customer.id === customerId;
        }) || null;
    }


    /* =====================================================
       GET CUSTOMER INFORMATION
    ===================================================== */

    function getCustomerInfo(sale) {

        const customer = getCustomer(sale.customerId);

        return {
            name: sale.customerName ||
                (customer ? customer.name : "Unknown Customer"),

            email: sale.customerEmail ||
                (customer ? customer.email : "-"),

            phone: sale.customerPhone ||
                (customer ? customer.phone : "-")
        };
    }


    /* =====================================================
       UPDATE SUMMARY
    ===================================================== */

    function updateInvoiceSummary() {

        const invoiceTotal = sales.length;

        const totalAmount = sales.reduce(function (sum, sale) {
            return sum + (Number(sale.grandTotal) || 0);
        }, 0);

        const today = new Date().toISOString().split("T")[0];

        const todayTotal = sales.filter(function (sale) {
            return sale.date === today;
        }).length;

        const average = invoiceTotal > 0
            ? totalAmount / invoiceTotal
            : 0;


        if (totalInvoices) {
            totalInvoices.textContent = invoiceTotal;
        }

        if (totalInvoiceAmount) {
            totalInvoiceAmount.textContent = formatCurrency(totalAmount);
        }

        if (todayInvoices) {
            todayInvoices.textContent = todayTotal;
        }

        if (averageInvoice) {
            averageInvoice.textContent = formatCurrency(average);
        }
    }


    /* =====================================================
       RENDER INVOICES
    ===================================================== */

    function renderInvoices() {

        if (!invoiceTableBody) {
            return;
        }

        const searchText = invoiceSearch
            ? invoiceSearch.value.trim().toLowerCase()
            : "";

        const paymentFilter = invoicePaymentFilter
            ? invoicePaymentFilter.value
            : "all";


        const filteredSales = sales.filter(function (sale) {

            const customer = getCustomerInfo(sale);

            const invoiceId = String(
                sale.invoiceId || sale.id || ""
            ).toLowerCase();

            const saleId = String(
                sale.id || ""
            ).toLowerCase();

            const customerName = String(
                customer.name || ""
            ).toLowerCase();

            const customerEmail = String(
                customer.email || ""
            ).toLowerCase();


            const matchesSearch =
                invoiceId.includes(searchText) ||
                saleId.includes(searchText) ||
                customerName.includes(searchText) ||
                customerEmail.includes(searchText);


            const matchesPayment =
                paymentFilter === "all" ||
                sale.paymentMethod === paymentFilter;


            return matchesSearch && matchesPayment;
        });


        if (invoiceCount) {
            invoiceCount.textContent =
                filteredSales.length + " invoices";
        }


        if (filteredSales.length === 0) {

            invoiceTableBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align:center; padding:30px;">
                        No invoices found.
                    </td>
                </tr>
            `;

            return;
        }


        invoiceTableBody.innerHTML = filteredSales.map(function (sale) {

            const customer = getCustomerInfo(sale);

            const invoiceId =
                sale.invoiceId ||
                "INV-" + String(sale.id || "").replace("SALE", "");


            return `
                <tr>

                    <td>
                        <strong>${invoiceId}</strong>
                    </td>

                    <td>
                        ${customer.name}
                    </td>

                    <td>
                        ${formatDate(sale.date)}
                    </td>

                    <td>
                        ${sale.id || "-"}
                    </td>

                    <td>
                        ${sale.paymentMethod || "-"}
                    </td>

                    <td>
                        ${formatCurrency(sale.subtotal)}
                    </td>

                    <td>
                        <strong>
                            ${formatCurrency(sale.grandTotal)}
                        </strong>
                    </td>

                    <td>

                        <div class="action-buttons">

                            <button
                                type="button"
                                class="view-button"
                                onclick="viewInvoice('${sale.id}')">
                                👁 View
                            </button>

                        </div>

                    </td>

                </tr>
            `;

        }).join("");
    }


    /* =====================================================
       VIEW INVOICE
    ===================================================== */

    window.viewInvoice = function (saleId) {

        const sale = sales.find(function (item) {
            return item.id === saleId;
        });


        if (!sale) {
            alert("Invoice information not found.");
            return;
        }


        const customer = getCustomerInfo(sale);

        const invoiceId =
            sale.invoiceId ||
            "INV-" + String(sale.id || "").replace("SALE", "");


        /* -----------------------------------------------
           BASIC INFORMATION
        ------------------------------------------------ */

        if (invoiceViewId) {
            invoiceViewId.textContent = invoiceId;
        }

        if (invoiceViewCustomer) {
            invoiceViewCustomer.textContent = customer.name;
        }

        if (invoiceViewCustomerEmail) {
            invoiceViewCustomerEmail.textContent = customer.email;
        }

        if (invoiceViewCustomerPhone) {
            invoiceViewCustomerPhone.textContent = customer.phone;
        }

        if (invoiceViewDate) {
            invoiceViewDate.textContent = formatDate(sale.date);
        }

        if (invoiceViewSaleId) {
            invoiceViewSaleId.textContent = sale.id || "-";
        }

        if (invoiceViewPayment) {
            invoiceViewPayment.textContent =
                sale.paymentMethod || "-";
        }


        /* -----------------------------------------------
           INVOICE ITEMS
        ------------------------------------------------ */

        if (invoiceItemsBody) {

            const items = Array.isArray(sale.items)
                ? sale.items
                : [];


            if (items.length === 0) {

                invoiceItemsBody.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align:center;">
                            No products found.
                        </td>
                    </tr>
                `;

            } else {

                invoiceItemsBody.innerHTML = items.map(function (item, index) {

                    const quantity = Number(item.quantity) || 0;
                    const price = Number(item.price) || 0;
                    const total = quantity * price;


                    return `
                        <tr>

                            <td>
                                ${index + 1}
                            </td>

                            <td>
                                ${item.productName || "-"}
                            </td>

                            <td>
                                ${quantity}
                            </td>

                            <td>
                                ${formatCurrency(price)}
                            </td>

                            <td>
                                ${formatCurrency(total)}
                            </td>

                        </tr>
                    `;

                }).join("");
            }
        }


        /* -----------------------------------------------
           TOTALS
        ------------------------------------------------ */

        if (invoiceViewSubtotal) {
            invoiceViewSubtotal.textContent =
                formatCurrency(sale.subtotal);
        }

        if (invoiceViewDiscount) {
            invoiceViewDiscount.textContent =
                formatCurrency(sale.discount);
        }

        if (invoiceViewVat) {
            invoiceViewVat.textContent =
                formatCurrency(sale.vat);
        }

        if (invoiceViewGrandTotal) {
            invoiceViewGrandTotal.textContent =
                formatCurrency(sale.grandTotal);
        }


        /* -----------------------------------------------
           OPEN MODAL
        ------------------------------------------------ */

        if (invoiceModal) {

            invoiceModal.style.display = "flex";

            invoiceModal.classList.add("show");
        }
    };


    /* =====================================================
       CLOSE INVOICE MODAL
    ===================================================== */

    function closeInvoiceModal() {

        if (!invoiceModal) {
            return;
        }

        invoiceModal.classList.remove("show");

        invoiceModal.style.display = "none";
    }


    /* =====================================================
       CLOSE BUTTONS
    ===================================================== */

    if (closeInvoiceButton) {

        closeInvoiceButton.addEventListener(
            "click",
            closeInvoiceModal
        );
    }


    if (closeInvoiceBottomButton) {

        closeInvoiceBottomButton.addEventListener(
            "click",
            closeInvoiceModal
        );
    }


    /* =====================================================
       CLICK OUTSIDE MODAL
    ===================================================== */

    if (invoiceModal) {

        invoiceModal.addEventListener("click", function (event) {

            if (event.target === invoiceModal) {
                closeInvoiceModal();
            }

        });
    }


    /* =====================================================
       ESC KEY
    ===================================================== */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            if (
                invoiceModal &&
                invoiceModal.style.display !== "none"
            ) {
                closeInvoiceModal();
            }
        }

    });


    /* =====================================================
       PRINT INVOICE
    ===================================================== */

    if (printInvoiceButton) {

        printInvoiceButton.addEventListener("click", function () {

            window.print();

        });
    }


    /* =====================================================
       SEARCH
    ===================================================== */

    if (invoiceSearch) {

        invoiceSearch.addEventListener(
            "input",
            renderInvoices
        );
    }


    /* =====================================================
       PAYMENT FILTER
    ===================================================== */

    if (invoicePaymentFilter) {

        invoicePaymentFilter.addEventListener(
            "change",
            renderInvoices
        );
    }


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    updateInvoiceSummary();

    renderInvoices();

});