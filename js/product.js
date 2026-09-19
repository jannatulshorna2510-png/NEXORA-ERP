/* =========================================================
   NEXORA ERP
   PRODUCT MANAGEMENT
========================================================= */


/* =========================================================
   1. DEMO PRODUCTS
========================================================= */

const demoProducts = [

    {
        id: "PRO001",
        name: "NEXORA ProBook 15",
        category: "Laptop",
        price: 850,
        quantity: 25,
        image: "",
        description: "High-performance laptop for business and professional use."
    },

    {
        id: "PRO002",
        name: "NEXORA Ultra Monitor",
        category: "Monitor",
        price: 320,
        quantity: 12,
        image: "",
        description: "27-inch Full HD monitor with excellent display quality."
    },

    {
        id: "PRO003",
        name: "NEXORA Mechanical Keyboard",
        category: "Keyboard",
        price: 75,
        quantity: 40,
        image: "",
        description: "RGB mechanical keyboard designed for gaming and productivity."
    },

    {
        id: "PRO004",
        name: "NEXORA Wireless Mouse",
        category: "Mouse",
        price: 35,
        quantity: 60,
        image: "",
        description: "Comfortable wireless mouse with long battery life."
    },

    {
        id: "PRO005",
        name: "NEXORA Sound Pro",
        category: "Headphone",
        price: 95,
        quantity: 8,
        image: "",
        description: "Wireless noise-cancelling headphones with premium sound."
    },

    {
        id: "PRO006",
        name: "NEXORA Smart X1",
        category: "Smartphone",
        price: 550,
        quantity: 18,
        image: "",
        description: "Modern smartphone with powerful performance and camera."
    },

    {
        id: "PRO007",
        name: "NEXORA Laser Printer",
        category: "Printer",
        price: 210,
        quantity: 5,
        image: "",
        description: "Fast laser printer for office and business environments."
    },

    {
        id: "PRO008",
        name: "NEXORA HD Webcam",
        category: "Webcam",
        price: 65,
        quantity: 30,
        image: "",
        description: "Full HD webcam for meetings, classes and video calls."
    },

    {
        id: "PRO009",
        name: "NEXORA SSD 1TB",
        category: "SSD",
        price: 110,
        quantity: 0,
        image: "",
        description: "1TB high-speed SSD for fast storage and improved performance."
    },

    {
        id: "PRO010",
        name: "NEXORA USB Hub",
        category: "Accessories",
        price: 25,
        quantity: 45,
        image: "",
        description: "Multi-port USB hub for connecting multiple devices."
    }

];


/* =========================================================
   2. LOCAL STORAGE KEY
========================================================= */

const PRODUCT_STORAGE_KEY = "nexoraProducts";


/* =========================================================
   3. GET PRODUCTS
========================================================= */

function getProducts() {

    const savedProducts =
        localStorage.getItem(PRODUCT_STORAGE_KEY);


    if (savedProducts) {

        try {

            const products =
                JSON.parse(savedProducts);


            if (
                Array.isArray(products) &&
                products.length > 0
            ) {

                return products;

            }

        } catch (error) {

            console.error(
                "Error reading products:",
                error
            );

        }

    }


    localStorage.setItem(
        PRODUCT_STORAGE_KEY,
        JSON.stringify(demoProducts)
    );


    return [...demoProducts];

}


/* =========================================================
   4. SAVE PRODUCTS
========================================================= */

function saveProducts(products) {

    localStorage.setItem(
        PRODUCT_STORAGE_KEY,
        JSON.stringify(products)
    );

}


/* =========================================================
   5. STOCK STATUS
========================================================= */

function getStockStatus(quantity) {

    quantity = Number(quantity);


    if (quantity <= 0) {

        return "Out of Stock";

    }


    if (quantity <= 10) {

        return "Low Stock";

    }


    return "In Stock";

}


/* =========================================================
   6. ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   7. RENDER PRODUCTS
========================================================= */

function renderProducts() {

    const tableBody =
        document.getElementById(
            "productTableBody"
        );


    const productCount =
        document.getElementById(
            "productCount"
        );


    if (!tableBody) {

        return;

    }


    let products =
        getProducts();


    /* =====================================================
       SEARCH
    ===================================================== */

    const searchInput =
        document.getElementById(
            "productSearch"
        );


    const searchText =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    /* =====================================================
       CATEGORY FILTER
    ===================================================== */

    const categoryFilter =
        document.getElementById(
            "productCategoryFilter"
        );


    const selectedCategory =
        categoryFilter
            ? categoryFilter.value
            : "all";


    /* =====================================================
       STOCK FILTER
    ===================================================== */

    const stockFilter =
        document.getElementById(
            "productStockFilter"
        );


    const selectedStock =
        stockFilter
            ? stockFilter.value
            : "all";


    /* =====================================================
       APPLY SEARCH + FILTER
    ===================================================== */

    products =
        products.filter(function (product) {


            const productName =
                String(product.name || "")
                    .toLowerCase();


            const productId =
                String(product.id || "")
                    .toLowerCase();


            const productCategory =
                String(product.category || "")
                    .toLowerCase();


            const matchesSearch =

                productName.includes(
                    searchText
                )

                ||

                productId.includes(
                    searchText
                )

                ||

                productCategory.includes(
                    searchText
                );


            const matchesCategory =

                selectedCategory === "all"

                ||

                product.category ===
                selectedCategory;


            const stockStatus =
                getStockStatus(
                    product.quantity
                );


            const matchesStock =

                selectedStock === "all"

                ||

                stockStatus ===
                selectedStock;


            return (
                matchesSearch &&
                matchesCategory &&
                matchesStock
            );

        });


    /* =====================================================
       PRODUCT COUNT
    ===================================================== */

    if (productCount) {

        productCount.textContent =
            products.length;

    }


    /* =====================================================
       EMPTY RESULT
    ===================================================== */

    if (products.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >

                    No products found.

                </td>

            </tr>

        `;

        return;

    }


    /* =====================================================
       RENDER TABLE
    ===================================================== */

    tableBody.innerHTML =

        products.map(function (product) {


            const stockStatus =
                getStockStatus(
                    product.quantity
                );


            let stockClass = "";


            if (stockStatus === "In Stock") {

                stockClass = "in-stock";

            }

            else if (
                stockStatus === "Low Stock"
            ) {

                stockClass = "low-stock";

            }

            else {

                stockClass =
                    "out-of-stock";

            }


            return `

                <tr>

                    <!-- Product ID -->

                    <td>

                        ${escapeHTML(
                            product.id
                        )}

                    </td>


                    <!-- Product -->

                    <td>

                        <div class="product-name">

                            ${escapeHTML(
                                product.name
                            )}

                        </div>

                    </td>


                    <!-- Category -->

                    <td>

                        ${escapeHTML(
                            product.category
                        )}

                    </td>


                    <!-- Price -->

                    <td>

                        $${Number(
                            product.price
                        ).toFixed(2)}

                    </td>


                    <!-- Quantity -->

                    <td>

                        ${Number(
                            product.quantity
                        )}

                    </td>


                    <!-- Stock Status -->

                    <td>

                        <span
                            class="
                                product-stock
                                ${stockClass}
                            "
                        >

                            ${stockStatus}

                        </span>

                    </td>


                    <!-- Actions -->

                    <td>

                        <div class="table-actions">


                            <!-- VIEW -->

                            <button
                                type="button"
                                class="
                                    action-button
                                    view-button
                                "
                                onclick="
                                    viewProduct(
                                        '${product.id}'
                                    )
                                "
                            >

                                View

                            </button>


                            <!-- EDIT -->

                            <button
                                type="button"
                                class="
                                    action-button
                                    edit-button
                                "
                                onclick="
                                    editProduct(
                                        '${product.id}'
                                    )
                                "
                            >

                                Edit

                            </button>


                            <!-- DELETE -->

                            <button
                                type="button"
                                class="
                                    action-button
                                    delete-button
                                "
                                onclick="
                                    deleteProduct(
                                        '${product.id}'
                                    )
                                "
                            >

                                Delete

                            </button>


                        </div>

                    </td>

                </tr>

            `;

        }).join("");

}


/* =========================================================
   8. VIEW PRODUCT
========================================================= */

function viewProduct(id) {

    const products =
        getProducts();


    const product =
        products.find(function (item) {

            return item.id === id;

        });


    if (!product) {

        alert("Product not found.");

        return;

    }


    /* =====================================================
       PROFILE DATA
    ===================================================== */

    const profileId =
        document.getElementById(
            "profileProductId"
        );


    const profileName =
        document.getElementById(
            "profileProductName"
        );


    const profileCategory =
        document.getElementById(
            "profileProductCategory"
        );


    const profilePrice =
        document.getElementById(
            "profileProductPrice"
        );


    const profileQuantity =
        document.getElementById(
            "profileProductQuantity"
        );


    const profileStock =
        document.getElementById(
            "profileProductStock"
        );


    const profileDescription =
        document.getElementById(
            "profileProductDescription"
        );


    if (profileId) {

        profileId.textContent =
            product.id;

    }


    if (profileName) {

        profileName.textContent =
            product.name;

    }


    if (profileCategory) {

        profileCategory.textContent =
            product.category;

    }


    if (profilePrice) {

        profilePrice.textContent =
            Number(
                product.price
            ).toFixed(2);

    }


    if (profileQuantity) {

        profileQuantity.textContent =
            Number(
                product.quantity
            );

    }


    if (profileStock) {

        const stockStatus =
            getStockStatus(
                product.quantity
            );


        profileStock.textContent =
            stockStatus;


        profileStock.className =
            "product-stock";


        if (
            stockStatus === "In Stock"
        ) {

            profileStock.classList.add(
                "in-stock"
            );

        }

        else if (
            stockStatus === "Low Stock"
        ) {

            profileStock.classList.add(
                "low-stock"
            );

        }

        else {

            profileStock.classList.add(
                "out-of-stock"
            );

        }

    }


    if (profileDescription) {

        profileDescription.textContent =
            product.description ||
            "No description available.";

    }


    /* =====================================================
       OPEN PROFILE MODAL
    ===================================================== */

    const profileModal =
        document.getElementById(
            "productProfileModal"
        );


    if (profileModal) {

        profileModal.style.display =
            "flex";

        profileModal.classList.add(
            "show"
        );

    }

}


/* =========================================================
   9. EDIT PRODUCT
========================================================= */

function editProduct(id) {

    const products =
        getProducts();


    const product =
        products.find(function (item) {

            return item.id === id;

        });


    if (!product) {

        alert("Product not found.");

        return;

    }


    /* =====================================================
       MODAL TITLE
    ===================================================== */

    const modalTitle =
        document.getElementById(
            "productModalTitle"
        );


    if (modalTitle) {

        modalTitle.textContent =
            "Edit Product";

    }


    /* =====================================================
       FORM
    ===================================================== */

    const productName =
        document.getElementById(
            "productName"
        );


    const productCategory =
        document.getElementById(
            "productCategory"
        );


    const productPrice =
        document.getElementById(
            "productPrice"
        );


    const productQuantity =
        document.getElementById(
            "productQuantity"
        );


    const productImage =
        document.getElementById(
            "productImage"
        );


    const productDescription =
        document.getElementById(
            "productDescription"
        );


    if (productName) {

        productName.value =
            product.name;

    }


    if (productCategory) {

        productCategory.value =
            product.category;

    }


    if (productPrice) {

        productPrice.value =
            product.price;

    }


    if (productQuantity) {

        productQuantity.value =
            product.quantity;

    }


    if (productImage) {

        productImage.value =
            product.image || "";

    }


    if (productDescription) {

        productDescription.value =
            product.description || "";

    }


    /* =====================================================
       STORE EDITING ID
    ===================================================== */

    const form =
        document.getElementById(
            "productForm"
        );


    if (form) {

        form.dataset.editingId =
            product.id;

    }


    /* =====================================================
       OPEN EDIT MODAL
    ===================================================== */

    const modal =
        document.getElementById(
            "productModal"
        );


    if (modal) {

        modal.style.display =
            "flex";

        modal.classList.add(
            "show"
        );

    }

}


/* =========================================================
   10. DELETE PRODUCT
========================================================= */

function deleteProduct(id) {

    const products =
        getProducts();


    const product =
        products.find(function (item) {

            return item.id === id;

        });


    if (!product) {

        alert("Product not found.");

        return;

    }


    const confirmed =
        confirm(
            `Are you sure you want to delete "${product.name}"?`
        );


    if (!confirmed) {

        return;

    }


    const updatedProducts =
        products.filter(function (item) {

            return item.id !== id;

        });


    saveProducts(
        updatedProducts
    );


    renderProducts();


    alert(
        "Product deleted successfully."
    );

}


/* =========================================================
   11. OPEN ADD PRODUCT MODAL
========================================================= */

function openAddProductModal() {

    const modal =
        document.getElementById(
            "productModal"
        );


    const form =
        document.getElementById(
            "productForm"
        );


    const title =
        document.getElementById(
            "productModalTitle"
        );


    /* =====================================================
       TITLE
    ===================================================== */

    if (title) {

        title.textContent =
            "Add Product";

    }


    /* =====================================================
       RESET FORM
    ===================================================== */

    if (form) {

        form.reset();

        delete form.dataset.editingId;

    }


    /* =====================================================
       OPEN MODAL
    ===================================================== */

    if (modal) {

        modal.style.display =
            "flex";

        modal.classList.add(
            "show"
        );

    }

}


/* =========================================================
   12. CLOSE PRODUCT MODAL
========================================================= */

function closeProductModal() {

    const modal =
        document.getElementById(
            "productModal"
        );


    const form =
        document.getElementById(
            "productForm"
        );


    if (form) {

        form.reset();

        delete form.dataset.editingId;

    }


    if (modal) {

        modal.classList.remove(
            "show"
        );

        modal.style.display =
            "none";

    }

}


/* =========================================================
   13. CLOSE PROFILE MODAL
========================================================= */

function closeProductProfileModal() {

    const profileModal =
        document.getElementById(
            "productProfileModal"
        );


    if (profileModal) {

        profileModal.classList.remove(
            "show"
        );

        profileModal.style.display =
            "none";

    }

}


/* =========================================================
   14. HANDLE FORM SUBMIT
========================================================= */

function handleProductSubmit(event) {

    event.preventDefault();


    const form =
        document.getElementById(
            "productForm"
        );


    if (!form) {

        return;

    }


    /* =====================================================
       GET VALUES
    ===================================================== */

    const name =
        document.getElementById(
            "productName"
        ).value.trim();


    const category =
        document.getElementById(
            "productCategory"
        ).value;


    const price =
        Number(
            document.getElementById(
                "productPrice"
            ).value
        );


    const quantity =
        Number(
            document.getElementById(
                "productQuantity"
            ).value
        );


    const image =
        document.getElementById(
            "productImage"
        ).value.trim();


    const description =
        document.getElementById(
            "productDescription"
        ).value.trim();


    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!name) {

        alert(
            "Please enter product name."
        );

        return;

    }


    if (!category) {

        alert(
            "Please select a category."
        );

        return;

    }


    if (
        Number.isNaN(price) ||
        price < 0
    ) {

        alert(
            "Please enter a valid price."
        );

        return;

    }


    if (
        Number.isNaN(quantity) ||
        quantity < 0
    ) {

        alert(
            "Please enter a valid quantity."
        );

        return;

    }


    let products =
        getProducts();


    /* =====================================================
       CHECK EDIT MODE
    ===================================================== */

    const editingId =
        form.dataset.editingId;


    if (editingId) {


        products =
            products.map(
                function (product) {


                    if (
                        product.id ===
                        editingId
                    ) {

                        return {

                            ...product,

                            name: name,

                            category: category,

                            price: price,

                            quantity: quantity,

                            image: image,

                            description:
                                description

                        };

                    }


                    return product;

                }
            );


        saveProducts(
            products
        );


        closeProductModal();


        renderProducts();


        alert(
            "Product updated successfully."
        );


        return;

    }


    /* =====================================================
       ADD NEW PRODUCT
    ===================================================== */

    const newId =

        "PRO" +

        String(
            Date.now()
        ).slice(-6);


    const newProduct = {

        id: newId,

        name: name,

        category: category,

        price: price,

        quantity: quantity,

        image: image,

        description: description

    };


    products.push(
        newProduct
    );


    saveProducts(
        products
    );


    closeProductModal();


    renderProducts();


    alert(
        "Product added successfully."
    );

}


/* =========================================================
   15. INITIALIZE PRODUCT PAGE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =================================================
           GET MODALS
        ================================================= */

        const productModal =
            document.getElementById(
                "productModal"
            );


        const profileModal =
            document.getElementById(
                "productProfileModal"
            );


        /* =================================================
           FORCE MODALS HIDDEN ON PAGE LOAD
           
           This is the main correction.
        ================================================= */

        if (productModal) {

            productModal.classList.remove(
                "show"
            );

            productModal.style.display =
                "none";

        }


        if (profileModal) {

            profileModal.classList.remove(
                "show"
            );

            profileModal.style.display =
                "none";

        }


        /* =================================================
           INITIAL PRODUCT RENDER
        ================================================= */

        renderProducts();


        /* =================================================
           ADD PRODUCT BUTTON
        ================================================= */

        const addButton =
            document.getElementById(
                "addProductButton"
            );


        if (addButton) {

            addButton.addEventListener(
                "click",
                openAddProductModal
            );

        }


        /* =================================================
           PRODUCT FORM
        ================================================= */

        const productForm =
            document.getElementById(
                "productForm"
            );


        if (productForm) {

            productForm.addEventListener(
                "submit",
                handleProductSubmit
            );

        }


        /* =================================================
           CLOSE PRODUCT MODAL
        ================================================= */

        const closeButton =
            document.getElementById(
                "closeProductModal"
            );


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                closeProductModal
            );

        }


        /* =================================================
           CANCEL PRODUCT MODAL
        ================================================= */

        const cancelButton =
            document.getElementById(
                "cancelProductButton"
            );


        if (cancelButton) {

            cancelButton.addEventListener(
                "click",
                closeProductModal
            );

        }


        /* =================================================
           CLOSE PROFILE MODAL - X
        ================================================= */

        const closeProfileButton =
            document.getElementById(
                "closeProductProfileModal"
            );


        if (closeProfileButton) {

            closeProfileButton.addEventListener(
                "click",
                closeProductProfileModal
            );

        }


        /* =================================================
           CLOSE PROFILE MODAL - CLOSE BUTTON
        ================================================= */

        const profileCloseButton =
            document.getElementById(
                "profileCloseButton"
            );


        if (profileCloseButton) {

            profileCloseButton.addEventListener(
                "click",
                closeProductProfileModal
            );

        }


        /* =================================================
           SEARCH
        ================================================= */

        const searchInput =
            document.getElementById(
                "productSearch"
            );


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                renderProducts
            );

        }


        /* =================================================
           CATEGORY FILTER
        ================================================= */

        const categoryFilter =
            document.getElementById(
                "productCategoryFilter"
            );


        if (categoryFilter) {

            categoryFilter.addEventListener(
                "change",
                renderProducts
            );

        }


        /* =================================================
           STOCK FILTER
        ================================================= */

        const stockFilter =
            document.getElementById(
                "productStockFilter"
            );


        if (stockFilter) {

            stockFilter.addEventListener(
                "change",
                renderProducts
            );

        }


        /* =================================================
           CLICK OUTSIDE MODAL
        ================================================= */

        window.addEventListener(
            "click",
            function (event) {


                if (
                    event.target ===
                    productModal
                ) {

                    closeProductModal();

                }


                if (
                    event.target ===
                    profileModal
                ) {

                    closeProductProfileModal();

                }

            }
        );


        /* =================================================
           ESCAPE KEY
        ================================================= */

        document.addEventListener(
            "keydown",
            function (event) {


                if (
                    event.key === "Escape"
                ) {

                    closeProductModal();

                    closeProductProfileModal();

                }

            }
        );


    }
);