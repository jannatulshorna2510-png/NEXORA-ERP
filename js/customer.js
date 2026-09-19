document.addEventListener("DOMContentLoaded", function () {

    const customerTableBody = document.getElementById("customerTableBody");
    const customerSearch = document.getElementById("customerSearch");
    const customerStatusFilter = document.getElementById("customerStatusFilter");
    const customerSort = document.getElementById("customerSort");
    const customerCount = document.getElementById("customerCount");

    const addCustomerButton = document.getElementById("addCustomerButton");

    const customerModal = document.getElementById("customerModal");
    const customerModalTitle = document.getElementById("customerModalTitle");
    const closeCustomerModal = document.getElementById("closeCustomerModal");
    const cancelCustomerButton = document.getElementById("cancelCustomerButton");

    const customerForm = document.getElementById("customerForm");
    const customerSubmitButton = document.getElementById("customerSubmitButton");

    const customerName = document.getElementById("customerName");
    const customerEmail = document.getElementById("customerEmail");
    const customerPhone = document.getElementById("customerPhone");
    const customerCompany = document.getElementById("customerCompany");
    const customerStatus = document.getElementById("customerStatus");
    const customerAddress = document.getElementById("customerAddress");

    const customerProfileModal =
        document.getElementById("customerProfileModal");

    const closeCustomerProfileModal =
        document.getElementById("closeCustomerProfileModal");

    const profileCustomerId =
        document.getElementById("profileCustomerId");

    const profileCustomerName =
        document.getElementById("profileCustomerName");

    const profileCustomerEmail =
        document.getElementById("profileCustomerEmail");

    const profileCustomerPhone =
        document.getElementById("profileCustomerPhone");

    const profileCustomerCompany =
        document.getElementById("profileCustomerCompany");

    const profileCustomerAddress =
        document.getElementById("profileCustomerAddress");

    const profileCustomerStatus =
        document.getElementById("profileCustomerStatus");


    /* =========================================
       DEMO CUSTOMERS
    ========================================= */

    const demoCustomers = [
        {
            id: "CUS001",
            name: "Rahim Ahmed",
            email: "rahim@gmail.com",
            phone: "01711111111",
            company: "Tech World",
            status: "Active",
            address: "Dhaka, Bangladesh"
        },
        {
            id: "CUS002",
            name: "Karim Hasan",
            email: "karim@gmail.com",
            phone: "01722222222",
            company: "Smart Solutions",
            status: "Active",
            address: "Chittagong, Bangladesh"
        },
        {
            id: "CUS003",
            name: "Nusrat Jahan",
            email: "nusrat@gmail.com",
            phone: "01733333333",
            company: "Digital Point",
            status: "Inactive",
            address: "Comilla, Bangladesh"
        },
        {
            id: "CUS004",
            name: "Sadia Islam",
            email: "sadia@gmail.com",
            phone: "01744444444",
            company: "Next Gen IT",
            status: "Active",
            address: "Dhaka, Bangladesh"
        },
        {
            id: "CUS005",
            name: "Tanvir Hossain",
            email: "tanvir@gmail.com",
            phone: "01755555555",
            company: "Computer Zone",
            status: "Active",
            address: "Sylhet, Bangladesh"
        }
    ];


    /* =========================================
       LOAD CUSTOMERS
    ========================================= */

    let customers;

    try {
        const savedCustomers =
            JSON.parse(localStorage.getItem("nexoraCustomers"));

        if (Array.isArray(savedCustomers) && savedCustomers.length > 0) {
            customers = savedCustomers;
        } else {
            customers = demoCustomers;
            localStorage.setItem(
                "nexoraCustomers",
                JSON.stringify(customers)
            );
        }

    } catch (error) {
        customers = demoCustomers;

        localStorage.setItem(
            "nexoraCustomers",
            JSON.stringify(customers)
        );
    }


    let editingCustomerId = null;


    /* =========================================
       SAVE TO LOCAL STORAGE
    ========================================= */

    function saveCustomers() {
        localStorage.setItem(
            "nexoraCustomers",
            JSON.stringify(customers)
        );
    }


    /* =========================================
       RENDER CUSTOMERS
    ========================================= */

    function renderCustomers() {

        const searchText =
            customerSearch ?
            customerSearch.value.toLowerCase().trim() :
            "";

        const statusValue =
            customerStatusFilter ?
            customerStatusFilter.value :
            "all";

        const sortValue =
            customerSort ?
            customerSort.value :
            "default";


        let filteredCustomers = customers.filter(function (customer) {

            const matchesSearch =
                customer.id.toLowerCase().includes(searchText) ||
                customer.name.toLowerCase().includes(searchText) ||
                customer.email.toLowerCase().includes(searchText) ||
                customer.phone.toLowerCase().includes(searchText) ||
                customer.company.toLowerCase().includes(searchText);

            const matchesStatus =
                statusValue === "all" ||
                customer.status === statusValue;

            return matchesSearch && matchesStatus;
        });


        /* Sorting */

        if (sortValue === "nameAsc") {
            filteredCustomers.sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });
        }

        if (sortValue === "nameDesc") {
            filteredCustomers.sort(function (a, b) {
                return b.name.localeCompare(a.name);
            });
        }

        if (sortValue === "newest") {
            filteredCustomers.reverse();
        }


        /* Count */

        if (customerCount) {
            customerCount.textContent =
                filteredCustomers.length;
        }


        /* Table */

        if (!customerTableBody) return;

        customerTableBody.innerHTML = "";


        if (filteredCustomers.length === 0) {

            customerTableBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align:center;">
                        No customers found.
                    </td>
                </tr>
            `;

            return;
        }


        filteredCustomers.forEach(function (customer) {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${customer.id}</td>

                <td>
                    <strong>${customer.name}</strong>
                </td>

                <td>${customer.email}</td>

                <td>${customer.phone}</td>

                <td>${customer.company}</td>

                <td>
                    <span class="employee-status ${customer.status.toLowerCase()}">
                        ${customer.status}
                    </span>
                </td>

                <td>
                    ${customer.address}
                </td>

                <td>
                    <div class="customer-action-buttons">

                        <button
                            type="button"
                            class="view-customer-button"
                            onclick="viewCustomer('${customer.id}')">
                            👁 View
                        </button>

                        <button
                            type="button"
                            class="edit-customer-button"
                            onclick="editCustomer('${customer.id}')">
                            ✎ Edit
                        </button>

                        <button
                            type="button"
                            class="delete-customer-button"
                            onclick="deleteCustomer('${customer.id}')">
                            🗑 Delete
                        </button>

                    </div>
                </td>
            `;

            customerTableBody.appendChild(row);
        });
    }


    /* =========================================
       OPEN ADD CUSTOMER MODAL
    ========================================= */

    function openAddCustomerModal() {

        editingCustomerId = null;

        customerForm.reset();

        customerModalTitle.textContent =
            "Add New Customer";

        customerSubmitButton.textContent =
            "Add Customer";

        customerModal.classList.add("show");
        customerModal.style.display = "flex";
    }


    /* =========================================
       EDIT CUSTOMER
    ========================================= */

    window.editCustomer = function (customerId) {

        const customer = customers.find(function (item) {
            return item.id === customerId;
        });

        if (!customer) {
            alert("Customer not found.");
            return;
        }


        editingCustomerId = customerId;


        customerName.value = customer.name;
        customerEmail.value = customer.email;
        customerPhone.value = customer.phone;
        customerCompany.value = customer.company;
        customerStatus.value = customer.status;
        customerAddress.value = customer.address;


        customerModalTitle.textContent =
            "Edit Customer";

        customerSubmitButton.textContent =
            "Save Changes";


        customerModal.classList.add("show");
        customerModal.style.display = "flex";
    };


    /* =========================================
       DELETE CUSTOMER
    ========================================= */

    window.deleteCustomer = function (customerId) {

        const customer = customers.find(function (item) {
            return item.id === customerId;
        });

        if (!customer) return;


        const confirmed = confirm(
            `Are you sure you want to delete ${customer.name}?`
        );

        if (!confirmed) return;


        customers = customers.filter(function (item) {
            return item.id !== customerId;
        });


        saveCustomers();
        renderCustomers();
    };


    /* =========================================
       VIEW CUSTOMER PROFILE
    ========================================= */

    window.viewCustomer = function (customerId) {

        const customer = customers.find(function (item) {
            return item.id === customerId;
        });

        if (!customer) return;


        profileCustomerId.textContent = customer.id;
        profileCustomerName.textContent = customer.name;
        profileCustomerEmail.textContent = customer.email;
        profileCustomerPhone.textContent = customer.phone;
        profileCustomerCompany.textContent = customer.company;
        profileCustomerAddress.textContent = customer.address;
        profileCustomerStatus.textContent = customer.status;


        customerProfileModal.classList.add("show");
        customerProfileModal.style.display = "flex";
    };


    /* =========================================
       CLOSE CUSTOMER MODAL
    ========================================= */

    function closeModal() {

        editingCustomerId = null;

        customerForm.reset();

        customerModal.classList.remove("show");
        customerModal.style.display = "none";
    }


    /* =========================================
       CLOSE PROFILE MODAL
    ========================================= */

    function closeProfileModal() {

        customerProfileModal.classList.remove("show");
        customerProfileModal.style.display = "none";
    }


    /* =========================================
       FORM SUBMIT
    ========================================= */

    customerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                customerName.value.trim();

            const email =
                customerEmail.value.trim();

            const phone =
                customerPhone.value.trim();

            const company =
                customerCompany.value.trim();

            const status =
                customerStatus.value;

            const address =
                customerAddress.value.trim();


            if (!name || !email || !phone || !company) {
                alert("Please fill in all required fields.");
                return;
            }


            /* Duplicate email check */

            const duplicateEmail =
                customers.some(function (customer) {

                    return (
                        customer.email.toLowerCase() ===
                        email.toLowerCase() &&
                        customer.id !== editingCustomerId
                    );

                });


            if (duplicateEmail) {
                alert("This email is already used by another customer.");
                return;
            }


            /* EDIT */

            if (editingCustomerId) {

                const customerIndex =
                    customers.findIndex(function (customer) {
                        return customer.id === editingCustomerId;
                    });


                if (customerIndex !== -1) {

                    customers[customerIndex].name = name;
                    customers[customerIndex].email = email;
                    customers[customerIndex].phone = phone;
                    customers[customerIndex].company = company;
                    customers[customerIndex].status = status;
                    customers[customerIndex].address = address;


                    saveCustomers();
                    renderCustomers();

                    alert("Customer updated successfully!");

                    closeModal();

                    return;
                }
            }


            /* ADD */

            const newId =
                "CUS" +
                String(customers.length + 1).padStart(3, "0");


            const newCustomer = {

                id: newId,
                name: name,
                email: email,
                phone: phone,
                company: company,
                status: status,
                address: address

            };


            customers.push(newCustomer);

            saveCustomers();
            renderCustomers();

            alert("Customer added successfully!");

            closeModal();
        }
    );


    /* =========================================
       BUTTON EVENTS
    ========================================= */

    if (addCustomerButton) {
        addCustomerButton.addEventListener(
            "click",
            openAddCustomerModal
        );
    }


    if (closeCustomerModal) {
        closeCustomerModal.addEventListener(
            "click",
            closeModal
        );
    }


    if (cancelCustomerButton) {
        cancelCustomerButton.addEventListener(
            "click",
            closeModal
        );
    }


    if (closeCustomerProfileModal) {
        closeCustomerProfileModal.addEventListener(
            "click",
            closeProfileModal
        );
    }


    /* =========================================
       OUTSIDE CLICK
    ========================================= */

    if (customerModal) {

        customerModal.addEventListener(
            "click",
            function (event) {

                if (event.target === customerModal) {
                    closeModal();
                }

            }
        );
    }


    if (customerProfileModal) {

        customerProfileModal.addEventListener(
            "click",
            function (event) {

                if (event.target === customerProfileModal) {
                    closeProfileModal();
                }

            }
        );
    }


    /* =========================================
       ESC KEY
    ========================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {
                closeModal();
                closeProfileModal();
            }

        }
    );


    /* =========================================
       SEARCH / FILTER / SORT
    ========================================= */

    if (customerSearch) {
        customerSearch.addEventListener(
            "input",
            renderCustomers
        );
    }


    if (customerStatusFilter) {
        customerStatusFilter.addEventListener(
            "change",
            renderCustomers
        );
    }


    if (customerSort) {
        customerSort.addEventListener(
            "change",
            renderCustomers
        );
    }


    /* =========================================
       INITIAL LOAD
    ========================================= */

    renderCustomers();

});