/* =========================================================
   NEXORA ERP - FINANCE MANAGEMENT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const financeTotalIncome =
        document.getElementById("financeTotalIncome");

    const financeTotalExpense =
        document.getElementById("financeTotalExpense");

    const financeNetProfit =
        document.getElementById("financeNetProfit");

    const financeTransactions =
        document.getElementById("financeTransactions");

    const financeChart =
        document.getElementById("financeChart");

    const profitChart =
        document.getElementById("profitChart");

    const expenseSearch =
        document.getElementById("expenseSearch");

    const expenseCategoryFilter =
        document.getElementById("expenseCategoryFilter");

    const expenseTableBody =
        document.getElementById("expenseTableBody");


    /* =====================================================
       EXPENSE MODAL ELEMENTS
    ===================================================== */

    const expenseModal =
        document.getElementById("expenseModal");

    const addExpenseButton =
        document.getElementById("addExpenseButton");

    const closeExpenseModal =
        document.getElementById("closeExpenseModal");

    const cancelExpenseButton =
        document.getElementById("cancelExpenseButton");

    const expenseForm =
        document.getElementById("expenseForm");

    const expenseTitle =
        document.getElementById("expenseTitle");

    const expenseDate =
        document.getElementById("expenseDate");

    const expenseCategory =
        document.getElementById("expenseCategory");

    const expenseAmount =
        document.getElementById("expenseAmount");

    const expenseNote =
        document.getElementById("expenseNote");


    /* =====================================================
       SUMMARY ELEMENTS
    ===================================================== */

    const summaryIncome =
        document.getElementById("summaryIncome");

    const summaryExpense =
        document.getElementById("summaryExpense");

    const summaryProfit =
        document.getElementById("summaryProfit");


    /* =====================================================
       IMPORTANT
       HIDE EXPENSE MODAL WHEN PAGE LOADS
    ===================================================== */

    if (expenseModal) {

        expenseModal.style.display = "none";

        expenseModal.classList.remove("show");

    }


    /* =====================================================
       LOAD SALES
    ===================================================== */

    let sales = [];

    try {

        sales =
            JSON.parse(
                localStorage.getItem("nexoraSales")
            ) || [];

    } catch (error) {

        console.error(
            "Error loading sales:",
            error
        );

        sales = [];

    }


    /* =====================================================
       LOAD EXPENSES
    ===================================================== */

    let expenses = [];

    try {

        expenses =
            JSON.parse(
                localStorage.getItem("nexoraExpenses")
            ) || [];

    } catch (error) {

        console.error(
            "Error loading expenses:",
            error
        );

        expenses = [];

    }


    /* =====================================================
       DEMO EXPENSE DATA
       ONLY USED IF NO EXPENSE EXISTS
    ===================================================== */

    if (expenses.length === 0) {

        expenses = [

            {
                id: "EXP001",
                title: "Office Rent",
                date: "2026-09-01",
                category: "Office",
                amount: 2500,
                note: "Monthly office rent"
            },

            {
                id: "EXP002",
                title: "Employee Salary",
                date: "2026-09-02",
                category: "Salary",
                amount: 8500,
                note: "Monthly employee salary"
            },

            {
                id: "EXP003",
                title: "Facebook Marketing",
                date: "2026-09-04",
                category: "Marketing",
                amount: 1200,
                note: "Social media advertising"
            },

            {
                id: "EXP004",
                title: "Internet Bill",
                date: "2026-09-06",
                category: "Utilities",
                amount: 300,
                note: "Monthly internet bill"
            },

            {
                id: "EXP005",
                title: "Transport Cost",
                date: "2026-09-08",
                category: "Transport",
                amount: 450,
                note: "Business transportation"
            }

        ];


        localStorage.setItem(
            "nexoraExpenses",
            JSON.stringify(expenses)
        );

    }


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


        const date =
            new Date(dateValue);


        if (isNaN(date.getTime())) {

            return dateValue;

        }


        return date.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    }


    /* =====================================================
       GET TOTAL INCOME
    ===================================================== */

    function getTotalIncome() {

        return sales.reduce(
            function (total, sale) {

                return total +
                    (Number(sale.grandTotal) || 0);

            },
            0
        );

    }


    /* =====================================================
       GET TOTAL EXPENSE
    ===================================================== */

    function getTotalExpense() {

        return expenses.reduce(
            function (total, expense) {

                return total +
                    (Number(expense.amount) || 0);

            },
            0
        );

    }


    /* =====================================================
       UPDATE FINANCE SUMMARY
    ===================================================== */

    function updateFinanceSummary() {

        const totalIncome =
            getTotalIncome();


        const totalExpense =
            getTotalExpense();


        const netProfit =
            totalIncome - totalExpense;


        const totalTransactions =
            sales.length + expenses.length;


        /* -----------------------------------------------
           TOP SUMMARY CARDS
        ------------------------------------------------ */

        if (financeTotalIncome) {

            financeTotalIncome.textContent =
                formatCurrency(totalIncome);

        }


        if (financeTotalExpense) {

            financeTotalExpense.textContent =
                formatCurrency(totalExpense);

        }


        if (financeNetProfit) {

            financeNetProfit.textContent =
                formatCurrency(netProfit);

        }


        if (financeTransactions) {

            financeTransactions.textContent =
                totalTransactions;

        }


        /* -----------------------------------------------
           EXPENSE SUMMARY
        ------------------------------------------------ */

        if (summaryIncome) {

            summaryIncome.textContent =
                formatCurrency(totalIncome);

        }


        if (summaryExpense) {

            summaryExpense.textContent =
                formatCurrency(totalExpense);

        }


        if (summaryProfit) {

            summaryProfit.textContent =
                formatCurrency(netProfit);

        }

    }


    /* =====================================================
       RENDER EXPENSE TABLE
    ===================================================== */

    function renderExpenses() {

        if (!expenseTableBody) {

            return;

        }


        const searchText =
            expenseSearch
                ? expenseSearch.value
                    .trim()
                    .toLowerCase()
                : "";


        const categoryFilter =
            expenseCategoryFilter
                ? expenseCategoryFilter.value
                : "all";


        const filteredExpenses =
            expenses.filter(
                function (expense) {


                    const title =
                        String(
                            expense.title || ""
                        ).toLowerCase();


                    const category =
                        String(
                            expense.category || ""
                        ).toLowerCase();


                    const note =
                        String(
                            expense.note || ""
                        ).toLowerCase();


                    const matchesSearch =
                        title.includes(searchText) ||
                        category.includes(searchText) ||
                        note.includes(searchText);


                    const matchesCategory =
                        categoryFilter === "all" ||
                        expense.category ===
                        categoryFilter;


                    return (
                        matchesSearch &&
                        matchesCategory
                    );

                }
            );


        /* -----------------------------------------------
           NO EXPENSE
        ------------------------------------------------ */

        if (filteredExpenses.length === 0) {

            expenseTableBody.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        style="
                            text-align:center;
                            padding:30px;
                        "
                    >

                        No expenses found.

                    </td>

                </tr>

            `;

            return;

        }


        /* -----------------------------------------------
           TABLE ROWS
        ------------------------------------------------ */

        expenseTableBody.innerHTML =
            filteredExpenses.map(
                function (expense) {

                    return `

                        <tr>

                            <td>
                                <strong>
                                    ${expense.id}
                                </strong>
                            </td>

                            <td>
                                ${expense.title || "-"}
                            </td>

                            <td>
                                ${formatDate(
                                    expense.date
                                )}
                            </td>

                            <td>
                                ${expense.category || "-"}
                            </td>

                            <td>
                                <strong>
                                    ${formatCurrency(
                                        expense.amount
                                    )}
                                </strong>
                            </td>

                            <td>
                                ${expense.note || "-"}
                            </td>

                            <td>

                                <button
                                    type="button"
                                    class="delete-button"
                                    onclick="deleteExpense('${expense.id}')"
                                >
                                    🗑 Delete
                                </button>

                            </td>

                        </tr>

                    `;

                }
            ).join("");

    }


    /* =====================================================
       OPEN EXPENSE MODAL
    ===================================================== */

    function openExpenseModal() {

        if (!expenseModal) {

            return;

        }


        /* Reset form */

        if (expenseForm) {

            expenseForm.reset();

        }


        /* Set today's date */

        if (expenseDate) {

            const today =
                new Date()
                    .toISOString()
                    .split("T")[0];

            expenseDate.value = today;

        }


        /* Remove previous edit ID */

        if (expenseForm) {

            expenseForm.removeAttribute(
                "data-edit-id"
            );

        }


        /* Open modal */

        expenseModal.style.display = "flex";

        expenseModal.classList.add("show");

    }


    /* =====================================================
       CLOSE EXPENSE MODAL
    ===================================================== */

    function closeExpenseModalFunction() {

        if (!expenseModal) {

            return;

        }


        expenseModal.classList.remove("show");

        expenseModal.style.display = "none";


        if (expenseForm) {

            expenseForm.reset();

            expenseForm.removeAttribute(
                "data-edit-id"
            );

        }

    }


    /* =====================================================
       ADD EXPENSE BUTTON
    ===================================================== */

    if (addExpenseButton) {

        addExpenseButton.addEventListener(
            "click",
            function () {

                openExpenseModal();

            }
        );

    }


    /* =====================================================
       CLOSE X BUTTON
    ===================================================== */

    if (closeExpenseModal) {

        closeExpenseModal.addEventListener(
            "click",
            closeExpenseModalFunction
        );

    }


    /* =====================================================
       CANCEL BUTTON
    ===================================================== */

    if (cancelExpenseButton) {

        cancelExpenseButton.addEventListener(
            "click",
            closeExpenseModalFunction
        );

    }


    /* =====================================================
       CLICK OUTSIDE MODAL
    ===================================================== */

    if (expenseModal) {

        expenseModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    expenseModal
                ) {

                    closeExpenseModalFunction();

                }

            }
        );

    }


    /* =====================================================
       ESC KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                if (
                    expenseModal &&
                    expenseModal.style.display !==
                    "none"
                ) {

                    closeExpenseModalFunction();

                }

            }

        }
    );


    /* =====================================================
       ADD EXPENSE FORM SUBMIT
    ===================================================== */

    if (expenseForm) {

        expenseForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                /* -----------------------------------------
                   GET VALUES
                ----------------------------------------- */

                const title =
                    expenseTitle
                        ? expenseTitle.value.trim()
                        : "";


                const date =
                    expenseDate
                        ? expenseDate.value
                        : "";


                const category =
                    expenseCategory
                        ? expenseCategory.value
                        : "";


                const amount =
                    expenseAmount
                        ? Number(
                            expenseAmount.value
                        )
                        : 0;


                const note =
                    expenseNote
                        ? expenseNote.value.trim()
                        : "";


                /* -----------------------------------------
                   VALIDATION
                ----------------------------------------- */

                if (!title) {

                    alert(
                        "Please enter expense title."
                    );

                    return;

                }


                if (!date) {

                    alert(
                        "Please select expense date."
                    );

                    return;

                }


                if (!category) {

                    alert(
                        "Please select expense category."
                    );

                    return;

                }


                if (!amount || amount <= 0) {

                    alert(
                        "Please enter a valid expense amount."
                    );

                    return;

                }


                /* -----------------------------------------
                   CHECK EDIT MODE
                ----------------------------------------- */

                const editId =
                    expenseForm.getAttribute(
                        "data-edit-id"
                    );


                if (editId) {


                    const expenseIndex =
                        expenses.findIndex(
                            function (expense) {

                                return (
                                    expense.id ===
                                    editId
                                );

                            }
                        );


                    if (
                        expenseIndex !== -1
                    ) {

                        expenses[
                            expenseIndex
                        ].title = title;

                        expenses[
                            expenseIndex
                        ].date = date;

                        expenses[
                            expenseIndex
                        ].category = category;

                        expenses[
                            expenseIndex
                        ].amount = amount;

                        expenses[
                            expenseIndex
                        ].note = note;

                    }


                } else {


                    /* -------------------------------------
                       ADD NEW EXPENSE
                    ------------------------------------- */

                    const newExpense = {

                        id:
                            "EXP" +
                            String(
                                Date.now()
                            ).slice(-6),

                        title: title,

                        date: date,

                        category: category,

                        amount: amount,

                        note: note

                    };


                    expenses.push(
                        newExpense
                    );

                }


                /* -----------------------------------------
                   SAVE
                ----------------------------------------- */

                localStorage.setItem(
                    "nexoraExpenses",
                    JSON.stringify(expenses)
                );


                /* -----------------------------------------
                   UPDATE UI
                ----------------------------------------- */

                updateFinanceSummary();

                renderExpenses();

                createFinanceCharts();


                /* -----------------------------------------
                   CLOSE MODAL
                ----------------------------------------- */

                closeExpenseModalFunction();


                alert(
                    editId
                        ? "Expense updated successfully."
                        : "Expense added successfully."
                );

            }
        );

    }


    /* =====================================================
       DELETE EXPENSE
    ===================================================== */

    window.deleteExpense =
        function (expenseId) {


            const expense =
                expenses.find(
                    function (item) {

                        return (
                            item.id ===
                            expenseId
                        );

                    }
                );


            if (!expense) {

                return;

            }


            const confirmDelete =
                confirm(
                    "Are you sure you want to delete this expense?"
                );


            if (!confirmDelete) {

                return;

            }


            expenses =
                expenses.filter(
                    function (item) {

                        return (
                            item.id !==
                            expenseId
                        );

                    }
                );


            localStorage.setItem(
                "nexoraExpenses",
                JSON.stringify(expenses)
            );


            updateFinanceSummary();

            renderExpenses();

            createFinanceCharts();

        };


    /* =====================================================
       SEARCH EXPENSES
    ===================================================== */

    if (expenseSearch) {

        expenseSearch.addEventListener(
            "input",
            renderExpenses
        );

    }


    /* =====================================================
       CATEGORY FILTER
    ===================================================== */

    if (expenseCategoryFilter) {

        expenseCategoryFilter.addEventListener(
            "change",
            renderExpenses
        );

    }


    /* =====================================================
       FINANCE CHARTS
    ===================================================== */

    let incomeExpenseChart = null;

    let profitOverviewChart = null;


    function createFinanceCharts() {


        /* -----------------------------------------------
           DESTROY OLD CHARTS
        ------------------------------------------------ */

        if (incomeExpenseChart) {

            incomeExpenseChart.destroy();

            incomeExpenseChart = null;

        }


        if (profitOverviewChart) {

            profitOverviewChart.destroy();

            profitOverviewChart = null;

        }


        /* -----------------------------------------------
           INCOME / EXPENSE DATA
        ------------------------------------------------ */

        const totalIncome =
            getTotalIncome();


        const totalExpense =
            getTotalExpense();


        const totalProfit =
            totalIncome - totalExpense;


        /* -----------------------------------------------
           INCOME / EXPENSE CHART
        ------------------------------------------------ */

        if (
            financeChart &&
            typeof Chart !== "undefined"
        ) {

            incomeExpenseChart =
                new Chart(
                    financeChart,
                    {
                        type: "bar",

                        data: {

                            labels: [
                                "Income",
                                "Expense"
                            ],

                            datasets: [

                                {
                                    label:
                                        "Amount",

                                    data: [
                                        totalIncome,
                                        totalExpense
                                    ],

                                    borderWidth: 1
                                }

                            ]

                        },

                        options: {

                            responsive: true,

                            maintainAspectRatio:
                                false,

                            plugins: {

                                legend: {
                                    display: true
                                }

                            },

                            scales: {

                                y: {

                                    beginAtZero:
                                        true

                                }

                            }

                        }

                    }
                );

        }


        /* -----------------------------------------------
           PROFIT CHART
        ------------------------------------------------ */

        if (
            profitChart &&
            typeof Chart !== "undefined"
        ) {

            profitOverviewChart =
                new Chart(
                    profitChart,
                    {
                        type: "doughnut",

                        data: {

                            labels: [
                                "Income",
                                "Expense",
                                "Profit"
                            ],

                            datasets: [

                                {
                                    label:
                                        "Finance Overview",

                                    data: [
                                        totalIncome,
                                        totalExpense,
                                        Math.max(
                                            totalProfit,
                                            0
                                        )
                                    ],

                                    borderWidth: 1

                                }

                            ]

                        },

                        options: {

                            responsive: true,

                            maintainAspectRatio:
                                false,

                            plugins: {

                                legend: {

                                    position:
                                        "bottom"

                                }

                            }

                        }

                    }
                );

        }

    }


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    updateFinanceSummary();

    renderExpenses();

    createFinanceCharts();


});