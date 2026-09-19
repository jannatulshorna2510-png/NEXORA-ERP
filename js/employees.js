// ========================================
// NEXORA ERP - Employee Management
// ========================================


// ========================================
// DEMO EMPLOYEE DATA
// ========================================

let employees = [

    {
        id: "EMP001",
        name: "Rahim Ahmed",
        email: "rahim@nexora.com",
        phone: "01710000001",
        department: "IT",
        position: "Software Engineer",
        salary: 45000,
        status: "Active"
    },

    {
        id: "EMP002",
        name: "Karim Hasan",
        email: "karim@nexora.com",
        phone: "01710000002",
        department: "Sales",
        position: "Sales Executive",
        salary: 35000,
        status: "Active"
    },

    {
        id: "EMP003",
        name: "Nusrat Jahan",
        email: "nusrat@nexora.com",
        phone: "01710000003",
        department: "HR",
        position: "HR Manager",
        salary: 55000,
        status: "Active"
    },

    {
        id: "EMP004",
        name: "Sakib Khan",
        email: "sakib@nexora.com",
        phone: "01710000004",
        department: "Finance",
        position: "Accountant",
        salary: 40000,
        status: "Inactive"
    },

    {
        id: "EMP005",
        name: "Mim Akter",
        email: "mim@nexora.com",
        phone: "01710000005",
        department: "Marketing",
        position: "Marketing Executive",
        salary: 38000,
        status: "Active"
    }

];


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener("DOMContentLoaded", function () {


    // ========================================
    // LOAD FROM LOCAL STORAGE
    // ========================================

    const savedEmployees =
        localStorage.getItem("nexoraEmployees");

    if (savedEmployees) {

        try {

            employees = JSON.parse(savedEmployees);

        } catch (error) {

            console.log(
                "Could not load saved employees."
            );

        }

    }


    // ========================================
    // HTML ELEMENTS
    // ========================================

    const employeeTableBody =
        document.getElementById(
            "employeeTableBody"
        );

    const employeeSearch =
        document.getElementById(
            "employeeSearch"
        );

    const departmentFilter =
        document.getElementById(
            "departmentFilter"
        );

    const statusFilter =
        document.getElementById(
            "statusFilter"
        );

    const totalEmployees =
        document.getElementById(
            "totalEmployees"
        );

    const activeEmployees =
        document.getElementById(
            "activeEmployees"
        );

    const inactiveEmployees =
        document.getElementById(
            "inactiveEmployees"
        );


    // ========================================
    // MODAL ELEMENTS
    // ========================================

    const employeeModal =
        document.getElementById(
            "employeeModal"
        );

    const employeeModalTitle =
        document.getElementById(
            "employeeModalTitle"
        );

    const addEmployeeButton =
        document.getElementById(
            "addEmployeeButton"
        );

    const closeEmployeeModal =
        document.getElementById(
            "closeEmployeeModal"
        );

    const cancelEmployeeButton =
        document.getElementById(
            "cancelEmployeeButton"
        );

    const employeeForm =
        document.getElementById(
            "employeeForm"
        );

    const employeeSubmitButton =
        document.getElementById(
            "employeeSubmitButton"
        );


    // ========================================
    // CURRENT EDITING EMPLOYEE
    // ========================================

    let editingEmployeeId = null;


    // ========================================
    // SAVE EMPLOYEES
    // ========================================

    function saveEmployees() {

        localStorage.setItem(
            "nexoraEmployees",
            JSON.stringify(employees)
        );

    }


    // ========================================
    // DISPLAY EMPLOYEES
    // ========================================

    function displayEmployees(employeeList) {

        employeeTableBody.innerHTML = "";


        if (employeeList.length === 0) {

            employeeTableBody.innerHTML = `
                <tr>
                    <td colspan="9"
                        style="text-align:center;">
                        No employees found.
                    </td>
                </tr>
            `;

            return;

        }


        employeeList.forEach(function (employee) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    <strong>
                        ${employee.id}
                    </strong>
                </td>

                <td>
                    ${employee.name}
                </td>

                <td>
                    ${employee.email}
                </td>

                <td>
                    ${employee.phone}
                </td>

                <td>
                    ${employee.department}
                </td>

                <td>
                    ${employee.position}
                </td>

                <td>
                    $${Number(
                        employee.salary
                    ).toLocaleString()}
                </td>

                <td>

                    <span
                        class="employee-status ${employee.status.toLowerCase()}">

                        ${employee.status}

                    </span>

                </td>

                <td>

                    <div class="employee-action-buttons">

                        <button
                            type="button"
                            class="edit-button"
                            onclick="editEmployee('${employee.id}')">

                            ✎ Edit

                        </button>

                        <button
                            type="button"
                            class="delete-button"
                            onclick="deleteEmployee('${employee.id}')">

                            🗑 Delete

                        </button>

                    </div>

                </td>

            `;


            employeeTableBody.appendChild(row);

        });

    }


    // ========================================
    // UPDATE SUMMARY
    // ========================================

    function updateEmployeeSummary() {

        const total =
            employees.length;


        const active =
            employees.filter(function (employee) {

                return employee.status === "Active";

            }).length;


        const inactive =
            employees.filter(function (employee) {

                return employee.status === "Inactive";

            }).length;


        totalEmployees.textContent =
            total;

        activeEmployees.textContent =
            active;

        inactiveEmployees.textContent =
            inactive;

    }


    // ========================================
    // FILTER EMPLOYEES
    // ========================================

    function filterEmployees() {

        const searchText =
            employeeSearch.value
                .toLowerCase()
                .trim();


        const selectedDepartment =
            departmentFilter.value;


        const selectedStatus =
            statusFilter.value;


        const filteredEmployees =
            employees.filter(function (employee) {


                const matchesSearch =

                    employee.name
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    employee.email
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    employee.id
                        .toLowerCase()
                        .includes(searchText);


                const matchesDepartment =

                    selectedDepartment === "all"

                    ||

                    employee.department ===
                    selectedDepartment;


                const matchesStatus =

                    selectedStatus === "all"

                    ||

                    employee.status ===
                    selectedStatus;


                return (
                    matchesSearch &&
                    matchesDepartment &&
                    matchesStatus
                );

            });


        displayEmployees(
            filteredEmployees
        );

    }


    // ========================================
    // OPEN ADD MODAL
    // ========================================

    function openAddModal() {

        editingEmployeeId = null;

        employeeForm.reset();

        employeeModalTitle.textContent =
            "Add New Employee";

        employeeSubmitButton.textContent =
            "Add Employee";

        employeeModal.classList.add("show");

        employeeModal.style.display =
            "flex";

    }


    // ========================================
    // OPEN EDIT MODAL
    // ========================================

    window.editEmployee =
        function (employeeId) {


            const employee =
                employees.find(function (item) {

                    return item.id === employeeId;

                });


            if (!employee) {

                alert(
                    "Employee not found."
                );

                return;

            }


            editingEmployeeId =
                employeeId;


            // Fill existing information

            document.getElementById(
                "employeeName"
            ).value =
                employee.name;


            document.getElementById(
                "employeeEmail"
            ).value =
                employee.email;


            document.getElementById(
                "employeePhone"
            ).value =
                employee.phone;


            document.getElementById(
                "employeeDepartment"
            ).value =
                employee.department;


            document.getElementById(
                "employeePosition"
            ).value =
                employee.position;


            document.getElementById(
                "employeeSalary"
            ).value =
                employee.salary;


            document.getElementById(
                "employeeStatus"
            ).value =
                employee.status;


            employeeModalTitle.textContent =
                "Edit Employee";


            employeeSubmitButton.textContent =
                "Save Changes";


            employeeModal.classList.add(
                "show"
            );

            employeeModal.style.display =
                "flex";

        };


    // ========================================
    // CLOSE MODAL
    // ========================================

    function closeModal() {

        employeeModal.classList.remove(
            "show"
        );

        employeeModal.style.display =
            "none";

        employeeForm.reset();

        editingEmployeeId = null;

        employeeModalTitle.textContent =
            "Add New Employee";

        employeeSubmitButton.textContent =
            "Add Employee";

    }


    // ========================================
    // ADD BUTTON
    // ========================================

    addEmployeeButton.addEventListener(
        "click",
        openAddModal
    );


    // ========================================
    // CLOSE X
    // ========================================

    closeEmployeeModal.addEventListener(
        "click",
        closeModal
    );


    // ========================================
    // CANCEL BUTTON
    // ========================================

    cancelEmployeeButton.addEventListener(
        "click",
        closeModal
    );


    // ========================================
    // CLICK OUTSIDE
    // ========================================

    employeeModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                employeeModal
            ) {

                closeModal();

            }

        }
    );


    // ========================================
    // ESC KEY
    // ========================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                employeeModal.classList.contains(
                    "show"
                )
            ) {

                closeModal();

            }

        }
    );


    // ========================================
    // FORM SUBMIT
    // ========================================

    employeeForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            // Get values

            const name =
                document.getElementById(
                    "employeeName"
                ).value.trim();


            const email =
                document.getElementById(
                    "employeeEmail"
                ).value.trim();


            const phone =
                document.getElementById(
                    "employeePhone"
                ).value.trim();


            const department =
                document.getElementById(
                    "employeeDepartment"
                ).value;


            const position =
                document.getElementById(
                    "employeePosition"
                ).value.trim();


            const salary =
                Number(
                    document.getElementById(
                        "employeeSalary"
                    ).value
                );


            const status =
                document.getElementById(
                    "employeeStatus"
                ).value;


            // ========================================
            // VALIDATION
            // ========================================

            if (
                !name ||
                !email ||
                !phone ||
                !department ||
                !position ||
                salary <= 0
            ) {

                alert(
                    "Please fill in all fields correctly."
                );

                return;

            }


            // ========================================
            // CHECK DUPLICATE EMAIL
            // ========================================

            const emailExists =
                employees.some(
                    function (employee) {

                        return (
                            employee.email
                                .toLowerCase() ===
                            email.toLowerCase() &&

                            employee.id !==
                            editingEmployeeId
                        );

                    }
                );


            if (emailExists) {

                alert(
                    "An employee with this email already exists."
                );

                return;

            }


            // ========================================
            // EDIT EXISTING EMPLOYEE
            // ========================================

            if (editingEmployeeId) {


                const employee =
                    employees.find(
                        function (item) {

                            return (
                                item.id ===
                                editingEmployeeId
                            );

                        }
                    );


                if (employee) {

                    employee.name =
                        name;

                    employee.email =
                        email;

                    employee.phone =
                        phone;

                    employee.department =
                        department;

                    employee.position =
                        position;

                    employee.salary =
                        salary;

                    employee.status =
                        status;


                    saveEmployees();

                    displayEmployees(
                        employees
                    );

                    updateEmployeeSummary();

                    closeModal();


                    alert(
                        "Employee updated successfully!"
                    );

                }

                return;

            }


            // ========================================
            // ADD NEW EMPLOYEE
            // ========================================

            const newId =
                "EMP" +
                String(
                    Date.now()
                ).slice(-6);


            const newEmployee = {

                id: newId,

                name: name,

                email: email,

                phone: phone,

                department: department,

                position: position,

                salary: salary,

                status: status

            };


            employees.push(
                newEmployee
            );


            saveEmployees();


            displayEmployees(
                employees
            );

            updateEmployeeSummary();


            closeModal();


            alert(
                "Employee added successfully!"
            );

        }
    );


    // ========================================
    // DELETE EMPLOYEE
    // ========================================

    window.deleteEmployee =
        function (employeeId) {


            const employee =
                employees.find(
                    function (item) {

                        return (
                            item.id ===
                            employeeId
                        );

                    }
                );


            if (!employee) {

                alert(
                    "Employee not found."
                );

                return;

            }


            const confirmDelete =
                confirm(
                    `Are you sure you want to delete ${employee.name}?`
                );


            if (!confirmDelete) {

                return;

            }


            employees =
                employees.filter(
                    function (item) {

                        return (
                            item.id !==
                            employeeId
                        );

                    }
                );


            saveEmployees();


            filterEmployees();

            updateEmployeeSummary();


            alert(
                "Employee deleted successfully!"
            );

        };


    // ========================================
    // SEARCH
    // ========================================

    employeeSearch.addEventListener(
        "input",
        filterEmployees
    );


    // ========================================
    // DEPARTMENT FILTER
    // ========================================

    departmentFilter.addEventListener(
        "change",
        filterEmployees
    );


    // ========================================
    // STATUS FILTER
    // ========================================

    statusFilter.addEventListener(
        "change",
        filterEmployees
    );


    // ========================================
    // INITIAL STATE
    // ========================================

    employeeModal.classList.remove(
        "show"
    );

    employeeModal.style.display =
        "none";


    displayEmployees(
        employees
    );

    updateEmployeeSummary();

});