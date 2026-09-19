// ======================================================
// NEXORA ERP - INVENTORY MANAGEMENT
// ======================================================


// ===================== STORAGE KEYS =====================

const PRODUCT_STORAGE_KEY = "nexoraProducts";
const INVENTORY_HISTORY_KEY = "nexoraInventoryHistory";


// ===================== DEMO PRODUCTS =====================
// Backup products in case Product Management has no data.

const inventoryDemoProducts = [
    {
        id: "PRO001",
        name: "NEXORA ProBook 15",
        category: "Laptop",
        price: 850,
        quantity: 25,
        image: "",
        description: "Professional laptop for business and productivity."
    },

    {
        id: "PRO002",
        name: "NEXORA Ultra Monitor",
        category: "Monitor",
        price: 320,
        quantity: 12,
        image: "",
        description: "High-quality monitor for work and entertainment."
    },

    {
        id: "PRO003",
        name: "NEXORA Mechanical Keyboard",
        category: "Keyboard",
        price: 75,
        quantity: 40,
        image: "",
        description: "Mechanical keyboard with comfortable switches."
    },

    {
        id: "PRO004",
        name: "NEXORA Wireless Mouse",
        category: "Mouse",
        price: 35,
        quantity: 60,
        image: "",
        description: "Wireless mouse with ergonomic design."
    },

    {
        id: "PRO005",
        name: "NEXORA Sound Pro",
        category: "Headphone",
        price: 95,
        quantity: 8,
        image: "",
        description: "Premium wireless headphones."
    },

    {
        id: "PRO006",
        name: "NEXORA Smart X1",
        category: "Smartphone",
        price: 550,
        quantity: 18,
        image: "",
        description: "Smartphone with modern features."
    },

    {
        id: "PRO007",
        name: "NEXORA Laser Printer",
        category: "Printer",
        price: 210,
        quantity: 5,
        image: "",
        description: "Fast laser printer for office use."
    },

    {
        id: "PRO008",
        name: "NEXORA HD Webcam",
        category: "Webcam",
        price: 65,
        quantity: 30,
        image: "",
        description: "HD webcam for meetings and streaming."
    },

    {
        id: "PRO009",
        name: "NEXORA SSD 1TB",
        category: "SSD",
        price: 110,
        quantity: 0,
        image: "",
        description: "1TB high-speed SSD storage."
    },

    {
        id: "PRO010",
        name: "NEXORA USB Hub",
        category: "Accessories",
        price: 25,
        quantity: 45,
        image: "",
        description: "Multi-port USB hub."
    }
];


// ======================================================
// GET PRODUCTS
// ======================================================

function getInventoryProducts() {

    const savedProducts =
        JSON.parse(localStorage.getItem(PRODUCT_STORAGE_KEY));

    if (Array.isArray(savedProducts) && savedProducts.length > 0) {
        return savedProducts;
    }

    localStorage.setItem(
        PRODUCT_STORAGE_KEY,
        JSON.stringify(inventoryDemoProducts)
    );

    return [...inventoryDemoProducts];
}


// ======================================================
// SAVE PRODUCTS
// ======================================================

function saveInventoryProducts(products) {

    localStorage.setItem(
        PRODUCT_STORAGE_KEY,
        JSON.stringify(products)
    );
}


// ======================================================
// STOCK STATUS
// ======================================================

function getInventoryStockStatus(quantity) {

    quantity = Number(quantity);

    if (quantity <= 0) {
        return "Out of Stock";
    }

    if (quantity <= 10) {
        return "Low Stock";
    }

    return "In Stock";
}


// ======================================================
// STOCK STATUS CLASS
// ======================================================

function getInventoryStockClass(status) {

    if (status === "In Stock") {
        return "in-stock";
    }

    if (status === "Low Stock") {
        return "low-stock";
    }

    return "out-of-stock";
}


// ======================================================
// FORMAT PRICE
// ======================================================

function formatInventoryPrice(price) {

    return "$" + Number(price).toFixed(2);
}


// ======================================================
// RENDER INVENTORY
// ======================================================

function renderInventory() {

    const products = getInventoryProducts();

    const searchInput =
        document.getElementById("inventorySearch");

    const categoryFilter =
        document.getElementById("inventoryCategoryFilter");

    const stockFilter =
        document.getElementById("inventoryStockFilter");

    const tableBody =
        document.getElementById("inventoryTableBody");


    if (!tableBody) {
        return;
    }


    const searchValue =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

    const categoryValue =
        categoryFilter
            ? categoryFilter.value
            : "all";

    const stockValue =
        stockFilter
            ? stockFilter.value
            : "all";


    // ================= FILTER =================

    let filteredProducts = products.filter(product => {

        const productName =
            String(product.name || "").toLowerCase();

        const productId =
            String(product.id || "").toLowerCase();

        const category =
            String(product.category || "");

        const status =
            getInventoryStockStatus(product.quantity);


        const matchesSearch =
            productName.includes(searchValue) ||
            productId.includes(searchValue);


        const matchesCategory =
            categoryValue === "all" ||
            category === categoryValue;


        const matchesStock =
            stockValue === "all" ||
            status === stockValue;


        return (
            matchesSearch &&
            matchesCategory &&
            matchesStock
        );

    });


    // ================= COUNT =================

    const countElement =
        document.getElementById("inventoryCount");

    if (countElement) {

        countElement.textContent =
            `${filteredProducts.length} products`;

    }


    // ================= EMPTY STATE =================

    if (filteredProducts.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    No products found.
                </td>
            </tr>
        `;

        return;
    }


    // ================= TABLE =================

    tableBody.innerHTML =
        filteredProducts.map(product => {

            const status =
                getInventoryStockStatus(product.quantity);

            const statusClass =
                getInventoryStockClass(status);


            return `
                <tr>

                    <td>
                        <strong>${product.id}</strong>
                    </td>

                    <td>
                        ${product.name}
                    </td>

                    <td>
                        ${product.category}
                    </td>

                    <td>
                        ${formatInventoryPrice(product.price)}
                    </td>

                    <td>
                        <strong>${product.quantity}</strong>
                    </td>

                    <td>
                        <span class="product-stock ${statusClass}">
                            ${status}
                        </span>
                    </td>

                    <td>

                        <button
                            class="view-button"
                            onclick="viewInventoryProduct('${product.id}')">
                            View
                        </button>

                        <button
                            class="edit-button"
                            onclick="openStockMovement('${product.id}')">
                            Update
                        </button>

                    </td>

                </tr>
            `;

        }).join("");
}


// ======================================================
// UPDATE SUMMARY CARDS
// ======================================================

function updateInventorySummary() {

    const products = getInventoryProducts();


    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;


    products.forEach(product => {

        const status =
            getInventoryStockStatus(product.quantity);


        if (status === "In Stock") {
            inStock++;
        }

        else if (status === "Low Stock") {
            lowStock++;
        }

        else {
            outOfStock++;
        }

    });


    const totalProducts =
        document.getElementById("inventoryTotalProducts");

    const inStockElement =
        document.getElementById("inventoryInStock");

    const lowStockElement =
        document.getElementById("inventoryLowStock");

    const outOfStockElement =
        document.getElementById("inventoryOutOfStock");


    if (totalProducts) {
        totalProducts.textContent = products.length;
    }

    if (inStockElement) {
        inStockElement.textContent = inStock;
    }

    if (lowStockElement) {
        lowStockElement.textContent = lowStock;
    }

    if (outOfStockElement) {
        outOfStockElement.textContent = outOfStock;
    }
}


// ======================================================
// GET HISTORY
// ======================================================

function getInventoryHistory() {

    const history =
        JSON.parse(
            localStorage.getItem(INVENTORY_HISTORY_KEY)
        );


    if (Array.isArray(history)) {
        return history;
    }


    return [];
}


// ======================================================
// SAVE HISTORY
// ======================================================

function saveInventoryHistory(history) {

    localStorage.setItem(
        INVENTORY_HISTORY_KEY,
        JSON.stringify(history)
    );
}


// ======================================================
// RENDER HISTORY
// ======================================================

function renderInventoryHistory() {

    const tableBody =
        document.getElementById(
            "stockHistoryTableBody"
        );


    if (!tableBody) {
        return;
    }


    const history =
        getInventoryHistory();


    if (history.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    No stock movement history yet.
                </td>
            </tr>
        `;

        return;
    }


    tableBody.innerHTML =
        history.slice(0, 20).map(item => {

            const movementClass =
                item.type === "Stock In"
                    ? "in-stock"
                    : "out-of-stock";


            return `
                <tr>

                    <td>
                        ${item.date}
                    </td>

                    <td>
                        ${item.productName}
                    </td>

                    <td>
                        <span class="product-stock ${movementClass}">
                            ${item.type}
                        </span>
                    </td>

                    <td>
                        <strong>${item.quantity}</strong>
                    </td>

                    <td>
                        ${item.previousStock}
                    </td>

                    <td>
                        ${item.newStock}
                    </td>

                </tr>
            `;

        }).join("");
}


// ======================================================
// OPEN STOCK MOVEMENT MODAL
// ======================================================

function openStockMovement(productId = "") {

    const modal =
        document.getElementById(
            "stockMovementModal"
        );

    const productSelect =
        document.getElementById(
            "movementProduct"
        );


    if (!modal || !productSelect) {
        return;
    }


    loadProductOptions(productId);


    modal.style.display = "flex";
}


// ======================================================
// LOAD PRODUCT OPTIONS
// ======================================================

function loadProductOptions(selectedProductId = "") {

    const products = getInventoryProducts();


    const select =
        document.getElementById(
            "movementProduct"
        );


    if (!select) {
        return;
    }


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
            `${product.name} — Stock: ${product.quantity}`;


        if (product.id === selectedProductId) {
            option.selected = true;
        }


        select.appendChild(option);

    });
}


// ======================================================
// CLOSE STOCK MOVEMENT MODAL
// ======================================================

function closeStockMovementModal() {

    const modal =
        document.getElementById(
            "stockMovementModal"
        );


    const form =
        document.getElementById(
            "stockMovementForm"
        );


    if (modal) {
        modal.style.display = "none";
    }


    if (form) {
        form.reset();
    }
}


// ======================================================
// HANDLE STOCK MOVEMENT
// ======================================================

function handleStockMovement(event) {

    event.preventDefault();


    const productId =
        document.getElementById(
            "movementProduct"
        ).value;


    const movementType =
        document.getElementById(
            "movementType"
        ).value;


    const quantity =
        Number(
            document.getElementById(
                "movementQuantity"
            ).value
        );


    const note =
        document.getElementById(
            "movementNote"
        ).value.trim();


    // ================= VALIDATION =================

    if (!productId) {

        alert("Please select a product.");

        return;
    }


    if (!movementType) {

        alert("Please select stock movement type.");

        return;
    }


    if (!quantity || quantity <= 0) {

        alert("Please enter a valid quantity.");

        return;
    }


    // ================= PRODUCTS =================

    const products =
        getInventoryProducts();


    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) {

        alert("Product not found.");

        return;
    }


    const previousStock =
        Number(product.quantity);


    let newStock;


    // ================= STOCK IN =================

    if (movementType === "Stock In") {

        newStock =
            previousStock + quantity;

    }


    // ================= STOCK OUT =================

    else {

        if (quantity > previousStock) {

            alert(
                `Stock Out failed!\n\nAvailable stock: ${previousStock}`
            );

            return;
        }


        newStock =
            previousStock - quantity;

    }


    // ================= UPDATE PRODUCT =================

    product.quantity = newStock;


    saveInventoryProducts(products);


    // ================= SAVE HISTORY =================

    const history =
        getInventoryHistory();


    const now =
        new Date();


    const date =
        now.toLocaleString();


    history.unshift({

        id:
            "MOV" +
            Date.now(),

        date:
            date,

        productId:
            product.id,

        productName:
            product.name,

        type:
            movementType,

        quantity:
            quantity,

        previousStock:
            previousStock,

        newStock:
            newStock,

        note:
            note

    });


    saveInventoryHistory(history);


    // ================= UPDATE UI =================

    renderInventory();

    updateInventorySummary();

    renderInventoryHistory();


    closeStockMovementModal();


    alert(
        `${movementType} successful!\n\n` +
        `Product: ${product.name}\n` +
        `Previous Stock: ${previousStock}\n` +
        `New Stock: ${newStock}`
    );
}


// ======================================================
// VIEW PRODUCT DETAILS
// ======================================================

function viewInventoryProduct(productId) {

    const products =
        getInventoryProducts();


    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) {
        return;
    }


    const modal =
        document.getElementById(
            "inventoryProductModal"
        );


    if (!modal) {
        return;
    }


    document.getElementById(
        "inventoryProfileId"
    ).textContent = product.id;


    document.getElementById(
        "inventoryProfileName"
    ).textContent = product.name;


    document.getElementById(
        "inventoryProfileCategory"
    ).textContent = product.category;


    document.getElementById(
        "inventoryProfilePrice"
    ).textContent =
        formatInventoryPrice(product.price);


    document.getElementById(
        "inventoryProfileQuantity"
    ).textContent = product.quantity;


    document.getElementById(
        "inventoryProfileStock"
    ).textContent =
        getInventoryStockStatus(
            product.quantity
        );


    modal.style.display = "flex";
}


// ======================================================
// CLOSE PRODUCT DETAILS
// ======================================================

function closeInventoryProductModal() {

    const modal =
        document.getElementById(
            "inventoryProductModal"
        );


    if (modal) {
        modal.style.display = "none";
    }
}


// ======================================================
// EVENT LISTENERS
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // ================= INITIAL LOAD =================

        renderInventory();

        updateInventorySummary();

        renderInventoryHistory();


        // ================= SEARCH =================

        const search =
            document.getElementById(
                "inventorySearch"
            );


        if (search) {

            search.addEventListener(
                "input",
                renderInventory
            );

        }


        // ================= CATEGORY FILTER =================

        const categoryFilter =
            document.getElementById(
                "inventoryCategoryFilter"
            );


        if (categoryFilter) {

            categoryFilter.addEventListener(
                "change",
                renderInventory
            );

        }


        // ================= STOCK FILTER =================

        const stockFilter =
            document.getElementById(
                "inventoryStockFilter"
            );


        if (stockFilter) {

            stockFilter.addEventListener(
                "change",
                renderInventory
            );

        }


        // ================= OPEN MOVEMENT =================

        const movementButton =
            document.getElementById(
                "stockMovementButton"
            );


        if (movementButton) {

            movementButton.addEventListener(
                "click",
                () => openStockMovement()
            );

        }


        // ================= CLOSE MOVEMENT =================

        const closeMovement =
            document.getElementById(
                "closeStockMovementModal"
            );


        if (closeMovement) {

            closeMovement.addEventListener(
                "click",
                closeStockMovementModal
            );

        }


        // ================= CANCEL MOVEMENT =================

        const cancelMovement =
            document.getElementById(
                "cancelStockMovementButton"
            );


        if (cancelMovement) {

            cancelMovement.addEventListener(
                "click",
                closeStockMovementModal
            );

        }


        // ================= FORM SUBMIT =================

        const movementForm =
            document.getElementById(
                "stockMovementForm"
            );


        if (movementForm) {

            movementForm.addEventListener(
                "submit",
                handleStockMovement
            );

        }


        // ================= CLOSE PRODUCT MODAL =================

        const closeProduct =
            document.getElementById(
                "closeInventoryProductModal"
            );


        if (closeProduct) {

            closeProduct.addEventListener(
                "click",
                closeInventoryProductModal
            );

        }


        // ================= PROFILE CLOSE BUTTON =================

        const profileClose =
            document.getElementById(
                "inventoryProfileCloseButton"
            );


        if (profileClose) {

            profileClose.addEventListener(
                "click",
                closeInventoryProductModal
            );

        }


        // ================= CLICK OUTSIDE MODAL =================

        window.addEventListener(
            "click",
            function (event) {

                const movementModal =
                    document.getElementById(
                        "stockMovementModal"
                    );


                const productModal =
                    document.getElementById(
                        "inventoryProductModal"
                    );


                if (
                    event.target === movementModal
                ) {

                    closeStockMovementModal();

                }


                if (
                    event.target === productModal
                ) {

                    closeInventoryProductModal();

                }

            }
        );

    }
);