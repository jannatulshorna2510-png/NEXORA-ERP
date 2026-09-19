// ======================================================
// NEXORA ERP - SALES MANAGEMENT
// ======================================================


// ===================== STORAGE KEYS =====================

const SALES_PRODUCT_KEY = "nexoraProducts";
const SALES_CUSTOMER_KEY = "nexoraCustomers";
const SALES_HISTORY_KEY = "nexoraSales";


// ===================== DEMO PRODUCTS =====================

const salesDemoProducts = [
    {
        id: "PRO001",
        name: "NEXORA ProBook 15",
        category: "Laptop",
        price: 850,
        quantity: 25
    },

    {
        id: "PRO002",
        name: "NEXORA Ultra Monitor",
        category: "Monitor",
        price: 320,
        quantity: 12
    },

    {
        id: "PRO003",
        name: "NEXORA Mechanical Keyboard",
        category: "Keyboard",
        price: 75,
        quantity: 40
    },

    {
        id: "PRO004",
        name: "NEXORA Wireless Mouse",
        category: "Mouse",
        price: 35,
        quantity: 60
    },

    {
        id: "PRO005",
        name: "NEXORA Sound Pro",
        category: "Headphone",
        price: 95,
        quantity: 8
    },

    {
        id: "PRO006",
        name: "NEXORA Smart X1",
        category: "Smartphone",
        price: 550,
        quantity: 18
    },

    {
        id: "PRO007",
        name: "NEXORA Laser Printer",
        category: "Printer",
        price: 210,
        quantity: 5
    },

    {
        id: "PRO008",
        name: "NEXORA HD Webcam",
        category: "Webcam",
        price: 65,
        quantity: 30
    },

    {
        id: "PRO009",
        name: "NEXORA SSD 1TB",
        category: "SSD",
        price: 110,
        quantity: 0
    },

    {
        id: "PRO010",
        name: "NEXORA USB Hub",
        category: "Accessories",
        price: 25,
        quantity: 45
    }
];


// ===================== GET PRODUCTS =====================

function getSalesProducts() {

    const savedProducts =
        JSON.parse(
            localStorage.getItem(SALES_PRODUCT_KEY)
        );

    if (
        Array.isArray(savedProducts) &&
        savedProducts.length > 0
    ) {
        return savedProducts;
    }

    localStorage.setItem(
        SALES_PRODUCT_KEY,
        JSON.stringify(salesDemoProducts)
    );

    return [...salesDemoProducts];
}


// ===================== SAVE PRODUCTS =====================

function saveSalesProducts(products) {

    localStorage.setItem(
        SALES_PRODUCT_KEY,
        JSON.stringify(products)
    );
}


// ===================== GET CUSTOMERS =====================

function getSalesCustomers() {

    const customers =
        JSON.parse(
            localStorage.getItem(SALES_CUSTOMER_KEY)
        );

    if (Array.isArray(customers)) {
        return customers;
    }

    return [];
}


// ===================== GET SALES HISTORY =====================

function getSalesHistory() {

    const sales =
        JSON.parse(
            localStorage.getItem(SALES_HISTORY_KEY)
        );

    if (Array.isArray(sales)) {
        return sales;
    }

    return [];
}


// ===================== SAVE SALES HISTORY =====================

function saveSalesHistory(sales) {

    localStorage.setItem(
        SALES_HISTORY_KEY,
        JSON.stringify(sales)
    );
}


// ======================================================
// CART
// ======================================================

let salesCart = [];


// ======================================================
// FORMAT MONEY
// ======================================================

function formatSaleMoney(amount) {

    return "$" + Number(amount).toFixed(2);

}


// ======================================================
// LOAD PRODUCT DROPDOWN
// ======================================================

function loadSalesProducts() {

    const select =
        document.getElementById("saleProduct");

    if (!select) {
        return;
    }


    const products =
        getSalesProducts();


    select.innerHTML = `
        <option value="">
            Select a product
        </option>
    `;


    products.forEach(product => {

        const option =
            document.createElement("option");


        option.value = product.id;


        option.textContent =
            `${product.name} — $${Number(product.price).toFixed(2)} — Stock: ${product.quantity}`;


        if (Number(product.quantity) <= 0) {

            option.disabled = true;

        }


        select.appendChild(option);

    });

}


// ======================================================
// LOAD CUSTOMER DROPDOWN
// ======================================================

function loadSalesCustomers() {

    const select =
        document.getElementById("saleCustomer");

    if (!select) {
        return;
    }


    const customers =
        getSalesCustomers();


    select.innerHTML = `
        <option value="">
            Walk-in Customer
        </option>
    `;


    customers.forEach(customer => {

        const option =
            document.createElement("option");


        option.value =
            customer.id || customer.email;


        option.textContent =
            `${customer.name} - ${customer.company || "Customer"}`;


        select.appendChild(option);

    });

}


// ======================================================
// SET TODAY'S DATE
// ======================================================

function setSalesDate() {

    const dateInput =
        document.getElementById("saleDate");


    if (!dateInput) {
        return;
    }


    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(today.getMonth() + 1)
            .padStart(2, "0");


    const day =
        String(today.getDate())
            .padStart(2, "0");


    dateInput.value =
        `${year}-${month}-${day}`;

}


// ======================================================
// ADD PRODUCT TO CART
// ======================================================

function addProductToCart() {

    const productSelect =
        document.getElementById("saleProduct");


    const quantityInput =
        document.getElementById("saleQuantity");


    if (!productSelect || !quantityInput) {
        return;
    }


    const productId =
        productSelect.value;


    const quantity =
        Number(quantityInput.value);


    // ================= VALIDATION =================

    if (!productId) {

        alert("Please select a product.");

        return;

    }


    if (!quantity || quantity <= 0) {

        alert("Please enter a valid quantity.");

        return;

    }


    // ================= FIND PRODUCT =================

    const products =
        getSalesProducts();


    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) {

        alert("Product not found.");

        return;

    }


    // ================= CHECK STOCK =================

    const existingCartItem =
        salesCart.find(
            item => item.productId === productId
        );


    const alreadyInCart =
        existingCartItem
            ? existingCartItem.quantity
            : 0;


    const requestedTotal =
        alreadyInCart + quantity;


    if (
        requestedTotal >
        Number(product.quantity)
    ) {

        alert(
            `Not enough stock!\n\n` +
            `Available stock: ${product.quantity}\n` +
            `Already in cart: ${alreadyInCart}`
        );

        return;

    }


    // ================= ADD / UPDATE CART =================

    if (existingCartItem) {

        existingCartItem.quantity += quantity;

    }

    else {

        salesCart.push({

            productId:
                product.id,

            name:
                product.name,

            price:
                Number(product.price),

            quantity:
                quantity

        });

    }


    renderSalesCart();


    // Reset product selection

    productSelect.value = "";

    quantityInput.value = 1;

}


// ======================================================
// REMOVE FROM CART
// ======================================================

function removeFromSalesCart(productId) {

    salesCart =
        salesCart.filter(
            item => item.productId !== productId
        );


    renderSalesCart();

}


// ======================================================
// CHANGE CART QUANTITY
// ======================================================

function changeCartQuantity(
    productId,
    newQuantity
) {

    newQuantity =
        Number(newQuantity);


    const cartItem =
        salesCart.find(
            item => item.productId === productId
        );


    if (!cartItem) {
        return;
    }


    const products =
        getSalesProducts();


    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) {
        return;
    }


    if (newQuantity <= 0) {

        removeFromSalesCart(productId);

        return;

    }


    if (
        newQuantity >
        Number(product.quantity)
    ) {

        alert(
            `Only ${product.quantity} units available.`
        );


        renderSalesCart();

        return;

    }


    cartItem.quantity =
        newQuantity;


    renderSalesCart();

}


// ======================================================
// CALCULATE SALE
// ======================================================

function calculateSaleTotals() {

    const subtotal =
        salesCart.reduce(
            (total, item) => {

                return total +
                    (
                        Number(item.price) *
                        Number(item.quantity)
                    );

            },
            0
        );


    const discountInput =
        document.getElementById(
            "saleDiscount"
        );


    const vatInput =
        document.getElementById(
            "saleVat"
        );


    const discountPercent =
        discountInput
            ? Number(discountInput.value) || 0
            : 0;


    const vatPercent =
        vatInput
            ? Number(vatInput.value) || 0
            : 0;


    // ================= DISCOUNT =================

    const discountAmount =
        subtotal *
        discountPercent /
        100;


    const amountAfterDiscount =
        subtotal -
        discountAmount;


    // ================= VAT =================

    const vatAmount =
        amountAfterDiscount *
        vatPercent /
        100;


    // ================= GRAND TOTAL =================

    const grandTotal =
        amountAfterDiscount +
        vatAmount;


    return {

        subtotal:
            subtotal,

        discountPercent:
            discountPercent,

        discountAmount:
            discountAmount,

        vatPercent:
            vatPercent,

        vatAmount:
            vatAmount,

        grandTotal:
            grandTotal

    };

}


// ======================================================
// UPDATE SALE SUMMARY
// ======================================================

function updateSaleSummary() {

    const totals =
        calculateSaleTotals();


    const subtotal =
        document.getElementById(
            "saleSubtotal"
        );


    const discountAmount =
        document.getElementById(
            "saleDiscountAmount"
        );


    const vatAmount =
        document.getElementById(
            "saleVatAmount"
        );


    const grandTotal =
        document.getElementById(
            "saleGrandTotal"
        );


    if (subtotal) {

        subtotal.textContent =
            formatSaleMoney(
                totals.subtotal
            );

    }


    if (discountAmount) {

        discountAmount.textContent =
            formatSaleMoney(
                totals.discountAmount
            );

    }


    if (vatAmount) {

        vatAmount.textContent =
            formatSaleMoney(
                totals.vatAmount
            );

    }


    if (grandTotal) {

        grandTotal.textContent =
            formatSaleMoney(
                totals.grandTotal
            );

    }

}


// ======================================================
// RENDER CART
// ======================================================

function renderSalesCart() {

    const cartBody =
        document.getElementById(
            "salesCartBody"
        );


    const itemCount =
        document.getElementById(
            "cartItemCount"
        );


    if (!cartBody) {
        return;
    }


    // ================= EMPTY CART =================

    if (salesCart.length === 0) {

        cartBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    Cart is empty.
                </td>
            </tr>
        `;


        if (itemCount) {

            itemCount.textContent =
                "0 items";

        }


        updateSaleSummary();

        return;

    }


    // ================= ITEM COUNT =================

    const totalItems =
        salesCart.reduce(
            (total, item) =>
                total + Number(item.quantity),
            0
        );


    if (itemCount) {

        itemCount.textContent =
            `${totalItems} items`;

    }


    // ================= TABLE =================

    cartBody.innerHTML =
        salesCart.map(item => {

            const total =
                Number(item.price) *
                Number(item.quantity);


            return `
                <tr>

                    <td>
                        <strong>
                            ${item.name}
                        </strong>
                    </td>

                    <td>
                        ${formatSaleMoney(item.price)}
                    </td>

                    <td>

                        <input
                            type="number"
                            min="1"
                            value="${item.quantity}"
                            class="cart-quantity-input"
                            onchange="
                                changeCartQuantity(
                                    '${item.productId}',
                                    this.value
                                )
                            "
                        >

                    </td>

                    <td>
                        <strong>
                            ${formatSaleMoney(total)}
                        </strong>
                    </td>

                    <td>

                        <button
                            class="delete-button"
                            onclick="
                                removeFromSalesCart(
                                    '${item.productId}'
                                )
                            ">
                            Remove
                        </button>

                    </td>

                </tr>
            `;

        }).join("");


    updateSaleSummary();

}


// ======================================================
// CLEAR CART
// ======================================================

function clearSalesCart() {

    if (salesCart.length === 0) {
        return;
    }


    const confirmClear =
        confirm(
            "Are you sure you want to clear the cart?"
        );


    if (!confirmClear) {
        return;
    }


    salesCart = [];


    renderSalesCart();

}


// ======================================================
// COMPLETE SALE
// ======================================================

function completeSale() {

    // ================= CHECK CART =================

    if (salesCart.length === 0) {

        alert(
            "Cart is empty. Please add products first."
        );

        return;

    }


    // ================= GET CUSTOMER =================

    const customerSelect =
        document.getElementById(
            "saleCustomer"
        );


    const customerId =
        customerSelect
            ? customerSelect.value
            : "";


    const customers =
        getSalesCustomers();


    let customerName =
        "Walk-in Customer";


    if (customerId) {

        const customer =
            customers.find(
                item =>
                    String(
                        item.id ||
                        item.email
                    ) === String(customerId)
            );


        if (customer) {

            customerName =
                customer.name;

        }

    }


    // ================= GET DATE =================

    const dateInput =
        document.getElementById(
            "saleDate"
        );


    const saleDate =
        dateInput && dateInput.value
            ? dateInput.value
            : new Date().toISOString().split("T")[0];


    // ================= PAYMENT =================

    const paymentInput =
        document.getElementById(
            "paymentMethod"
        );


    const paymentMethod =
        paymentInput
            ? paymentInput.value
            : "Cash";


    // ================= TOTALS =================

    const totals =
        calculateSaleTotals();


    // ================= PRODUCTS =================

    const products =
        getSalesProducts();


    // ================= CHECK STOCK AGAIN =================

    for (const cartItem of salesCart) {

        const product =
            products.find(
                item =>
                    item.id === cartItem.productId
            );


        if (!product) {

            alert(
                `Product not found: ${cartItem.name}`
            );

            return;

        }


        if (
            Number(cartItem.quantity) >
            Number(product.quantity)
        ) {

            alert(
                `Not enough stock for ${product.name}.`
            );

            return;

        }

    }


    // ================= UPDATE STOCK =================

    salesCart.forEach(cartItem => {

        const product =
            products.find(
                item =>
                    item.id === cartItem.productId
            );


        product.quantity =
            Number(product.quantity) -
            Number(cartItem.quantity);

    });


    saveSalesProducts(products);


    // ================= CREATE SALE ID =================

    const saleId =
        "SALE" +
        String(Date.now()).slice(-6);


    // ================= CREATE SALE OBJECT =================

    const sale = {

        id:
            saleId,

        date:
            saleDate,

        customerId:
            customerId,

        customerName:
            customerName,

        items:
            salesCart.map(item => ({

                productId:
                    item.productId,

                productName:
                    item.name,

                price:
                    item.price,

                quantity:
                    item.quantity,

                total:
                    item.price *
                    item.quantity

            })),

        subtotal:
            totals.subtotal,

        discountPercent:
            totals.discountPercent,

        discountAmount:
            totals.discountAmount,

        vatPercent:
            totals.vatPercent,

        vatAmount:
            totals.vatAmount,

        grandTotal:
            totals.grandTotal,

        paymentMethod:
            paymentMethod

    };


    // ================= SAVE SALE =================

    const sales =
        getSalesHistory();


    sales.unshift(sale);


    saveSalesHistory(sales);


    // ================= RESET CART =================

    salesCart = [];


    renderSalesCart();

    renderSalesHistory();

    loadSalesProducts();

    updateSaleSummary();


    // ================= SUCCESS =================

    alert(
        `Sale completed successfully!\n\n` +
        `Sale ID: ${saleId}\n` +
        `Customer: ${customerName}\n` +
        `Total: ${formatSaleMoney(totals.grandTotal)}`
    );

}


// ======================================================
// RENDER SALES HISTORY
// ======================================================

function renderSalesHistory() {

    const tableBody =
        document.getElementById(
            "salesHistoryBody"
        );


    if (!tableBody) {
        return;
    }


    const sales =
        getSalesHistory();


    if (sales.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    No sales yet.
                </td>
            </tr>
        `;

        return;

    }


    tableBody.innerHTML =
        sales.slice(0, 20).map(sale => {

            const itemCount =
                sale.items.reduce(
                    (total, item) =>
                        total +
                        Number(item.quantity),
                    0
                );


            return `
                <tr>

                    <td>
                        <strong>
                            ${sale.id}
                        </strong>
                    </td>

                    <td>
                        ${sale.date}
                    </td>

                    <td>
                        ${sale.customerName}
                    </td>

                    <td>
                        ${itemCount}
                    </td>

                    <td>
                        <strong>
                            ${formatSaleMoney(
                                sale.grandTotal
                            )}
                        </strong>
                    </td>

                    <td>
                        ${sale.paymentMethod}
                    </td>

                </tr>
            `;

        }).join("");

}


// ======================================================
// EVENT LISTENERS
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // ================= INITIAL LOAD =================

        loadSalesProducts();

        loadSalesCustomers();

        setSalesDate();

        renderSalesCart();

        renderSalesHistory();


        // ================= ADD TO CART =================

        const addButton =
            document.getElementById(
                "addToCartButton"
            );


        if (addButton) {

            addButton.addEventListener(
                "click",
                addProductToCart
            );

        }


        // ================= CLEAR CART =================

        const clearButton =
            document.getElementById(
                "clearCartButton"
            );


        if (clearButton) {

            clearButton.addEventListener(
                "click",
                clearSalesCart
            );

        }


        // ================= COMPLETE SALE =================

        const completeButton =
            document.getElementById(
                "completeSaleButton"
            );


        if (completeButton) {

            completeButton.addEventListener(
                "click",
                completeSale
            );

        }


        // ================= DISCOUNT =================

        const discountInput =
            document.getElementById(
                "saleDiscount"
            );


        if (discountInput) {

            discountInput.addEventListener(
                "input",
                updateSaleSummary
            );

        }


        // ================= VAT =================

        const vatInput =
            document.getElementById(
                "saleVat"
            );


        if (vatInput) {

            vatInput.addEventListener(
                "input",
                updateSaleSummary
            );

        }

    }
);