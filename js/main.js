document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       DARK / LIGHT MODE
       ===================================================== */

    const themeButton = document.getElementById("themeButton");

    function applyTheme() {

        const savedTheme = localStorage.getItem("nexoraTheme");

        if (savedTheme === "dark") {

            document.body.classList.add("dark-mode");

            if (themeButton) {
                themeButton.textContent = "☀️ Light Mode";
            }

        } else {

            document.body.classList.remove("dark-mode");

            if (themeButton) {
                themeButton.textContent = "🌙 Dark Mode";
            }
        }
    }

    applyTheme();


    if (themeButton) {

        themeButton.addEventListener("click", function () {

            document.body.classList.toggle("dark-mode");

            if (document.body.classList.contains("dark-mode")) {

                localStorage.setItem("nexoraTheme", "dark");

                themeButton.textContent = "☀️ Light Mode";

            } else {

                localStorage.setItem("nexoraTheme", "light");

                themeButton.textContent = "🌙 Dark Mode";
            }
        });
    }


    /* =====================================================
       DEMO USERS
       ===================================================== */

    const demoUsers = [

        {
            name: "Jannatul Fardous Shorna",
            email: "admin@nexora.com",
            password: "123456",
            role: "Admin"
        },

        {
            name: "NEXORA Manager",
            email: "manager@nexora.com",
            password: "123456",
            role: "Manager"
        },

        {
            name: "NEXORA Employee",
            email: "employee@nexora.com",
            password: "123456",
            role: "Employee"
        }

    ];


    /* =====================================================
       LOGIN PAGE
       ===================================================== */

    const loginForm = document.getElementById("loginForm");


    if (loginForm) {

        const emailInput = document.getElementById("email");

        const passwordInput =
            document.getElementById("password");

        const rememberMe =
            document.getElementById("rememberMe");

        const togglePassword =
            document.getElementById("togglePassword");

        const selectedRole =
            document.getElementById("selectedRole");

        const selectedRoleInput =
            document.getElementById("selectedRoleInput");

        const loginError =
            document.getElementById("loginError");

        const loginSubmitButton =
            document.getElementById("loginSubmitButton");


        /* =================================================
           REMEMBERED EMAIL
           ================================================= */

        const rememberedEmail =
            localStorage.getItem("nexoraRememberedEmail");


        if (rememberedEmail && emailInput) {

            emailInput.value = rememberedEmail;

            if (rememberMe) {
                rememberMe.checked = true;
            }
        }


        /* =================================================
           ROLE SELECTION
           ================================================= */

        const roleButtons =
            document.querySelectorAll(".role-button");


        roleButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                roleButtons.forEach(function (item) {

                    item.classList.remove("active");

                });


                button.classList.add("active");


                const role =
                    button.getAttribute("data-role");


                if (selectedRole) {

                    selectedRole.textContent = role;

                }


                if (selectedRoleInput) {

                    selectedRoleInput.value = role;

                }


                /* -----------------------------------------
                   AUTO FILL DEMO ACCOUNT
                   ----------------------------------------- */

                if (role === "Admin") {

                    if (emailInput) {
                        emailInput.value =
                            "admin@nexora.com";
                    }

                } else if (role === "Manager") {

                    if (emailInput) {
                        emailInput.value =
                            "manager@nexora.com";
                    }

                } else if (role === "Employee") {

                    if (emailInput) {
                        emailInput.value =
                            "employee@nexora.com";
                    }
                }


                if (passwordInput) {

                    passwordInput.value = "123456";

                }


                hideLoginError();

            });

        });


        /* =================================================
           PASSWORD SHOW / HIDE
           ================================================= */

        if (togglePassword) {

            togglePassword.addEventListener("click", function () {

                if (!passwordInput) {
                    return;
                }


                if (passwordInput.type === "password") {

                    passwordInput.type = "text";

                    togglePassword.textContent = "🙈";

                } else {

                    passwordInput.type = "password";

                    togglePassword.textContent = "👁️";

                }

            });

        }


        /* =================================================
           DEMO ACCOUNT BUTTONS
           ================================================= */

        const demoButtons =
            document.querySelectorAll(".demo-account");


        demoButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                const role =
                    button.getAttribute("data-demo-role");


                roleButtons.forEach(function (roleButton) {

                    if (
                        roleButton.getAttribute("data-role")
                        === role
                    ) {

                        roleButton.click();

                    }

                });

            });

        });


        /* =================================================
           LOGIN ERROR
           ================================================= */

        function showLoginError(message) {

            if (!loginError) {
                return;
            }


            loginError.textContent = message;

            loginError.style.display = "block";

        }


        function hideLoginError() {

            if (!loginError) {
                return;
            }


            loginError.textContent = "";

            loginError.style.display = "none";

        }


        /* =================================================
           LOGIN SUBMIT
           ================================================= */

        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();


            hideLoginError();


            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";


            const password =
                passwordInput
                    ? passwordInput.value.trim()
                    : "";


            const selectedRoleValue =
                selectedRoleInput
                    ? selectedRoleInput.value
                    : "";


            /* ---------------------------------------------
               EMPTY FIELD VALIDATION
               --------------------------------------------- */

            if (!email || !password) {

                showLoginError(
                    "Please enter your email and password."
                );

                return;

            }


            /* ---------------------------------------------
               ROLE VALIDATION
               --------------------------------------------- */

            if (!selectedRoleValue) {

                showLoginError(
                    "Please select an account type."
                );

                return;

            }


            let foundUser = null;


            /* =================================================
               CHECK DEMO USERS
               ================================================= */

            demoUsers.forEach(function (user) {

                if (
                    user.email === email &&
                    user.password === password &&
                    user.role === selectedRoleValue
                ) {

                    foundUser = user;

                }

            });


            /* =================================================
               CHECK REGISTERED USER
               ================================================= */

            if (!foundUser) {

                try {

                    const registeredUser =
                        JSON.parse(
                            localStorage.getItem("nexoraUser")
                        );


                    if (
                        registeredUser &&
                        registeredUser.email === email &&
                        registeredUser.password === password &&
                        registeredUser.role === selectedRoleValue
                    ) {

                        foundUser = registeredUser;

                    }

                } catch (error) {

                    console.log(
                        "Registered user data error:",
                        error
                    );

                }

            }


            /* =================================================
               INVALID LOGIN
               ================================================= */

            if (!foundUser) {

                showLoginError(
                    "Invalid email, password or account type."
                );

                return;

            }


            /* =================================================
               LOGIN SUCCESS
               ================================================= */

            localStorage.setItem(
                "nexoraLoggedIn",
                "true"
            );


            localStorage.setItem(
                "nexoraUserRole",
                foundUser.role
            );


            localStorage.setItem(
                "nexoraUser",
                JSON.stringify(foundUser)
            );


            /* =================================================
               REMEMBER ME
               ================================================= */

            if (
                rememberMe &&
                rememberMe.checked
            ) {

                localStorage.setItem(
                    "nexoraRememberedEmail",
                    email
                );

            } else {

                localStorage.removeItem(
                    "nexoraRememberedEmail"
                );

            }


            /* =================================================
               LOGIN BUTTON LOADING
               ================================================= */

            if (loginSubmitButton) {

                loginSubmitButton.innerHTML =
                    "<span>Signing In...</span><span>✓</span>";

                loginSubmitButton.disabled = true;

            }


            /* =================================================
               GO TO DASHBOARD
               ================================================= */

            setTimeout(function () {

                window.location.href =
                    "dashboard.html";

            }, 500);

        });

    }


    /* =====================================================
       CURRENT USER
       ===================================================== */

    function getCurrentUser() {

        try {

            const user =
                JSON.parse(
                    localStorage.getItem("nexoraUser")
                );


            return user || null;

        } catch (error) {

            return null;

        }

    }


    window.getCurrentUser = getCurrentUser;


    const currentUser =
        getCurrentUser();


    /* =====================================================
       PAGE NAME
       ===================================================== */

    function getCurrentPage() {

        let currentPage =
            window.location.pathname
                .split("/")
                .pop()
                .toLowerCase();


        /*
         If URL is empty or ends with /
         */

        if (!currentPage) {

            currentPage = "index.html";

        }


        /*
         Remove .html
         */

        currentPage =
            currentPage.replace(".html", "");


        return currentPage;

    }


    /* =====================================================
       PUBLIC PAGES
       ===================================================== */

    const publicPages = [

        "login",
        "signup",
        "forgot-password",
        "reset-password",
        "index"

    ];


    /* =====================================================
       LOGIN CHECK
       ===================================================== */

    function checkLogin() {

        const isLoggedIn =
            localStorage.getItem("nexoraLoggedIn");


        const currentPage =
            getCurrentPage();


        /*
         Public pages can always open
         */

        if (
            publicPages.includes(currentPage)
        ) {

            return true;

        }


        /*
         Protected page but user is not logged in
         */

        if (!isLoggedIn) {

            window.location.href =
                "login.html";

            return false;

        }


        return true;

    }


    window.checkLogin = checkLogin;


    /* =====================================================
       RUN LOGIN CHECK
       ===================================================== */

    const loginAllowed =
        checkLogin();


    /*
     If login is not allowed,
     stop executing protected-page code.
     */

    if (!loginAllowed) {

        return;

    }


    /* =====================================================
       SHOW USER NAME / ROLE
       ===================================================== */

    if (currentUser) {

        document
            .querySelectorAll(".user-name")
            .forEach(function (element) {

                element.textContent =
                    currentUser.name;

            });


        document
            .querySelectorAll(".user-role")
            .forEach(function (element) {

                element.textContent =
                    currentUser.role;

            });

    }


    /* =====================================================
       LOGOUT
       ===================================================== */

    const logoutButton =
        document.getElementById("logoutButton");


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                localStorage.removeItem(
                    "nexoraLoggedIn"
                );


                localStorage.removeItem(
                    "nexoraUserRole"
                );


                localStorage.removeItem(
                    "nexoraUser"
                );


                /*
                 Remembered email is NOT removed.
                 So Remember Me can still work.
                 */


                window.location.href =
                    "login.html";

            }
        );

    }


    /* =====================================================
       ROLE PERMISSIONS
       ===================================================== */

    const rolePermissions = {

        Admin: [

            "dashboard",
            "employees",
            "customers",
            "products",
            "inventory",
            "sales",
            "invoices",
            "finance",
            "reports",
            "profile"

        ],


        Manager: [

            "dashboard",
            "customers",
            "products",
            "inventory",
            "sales",
            "invoices",
            "reports",
            "profile"

        ],


        Employee: [

            "dashboard",
            "products",
            "inventory",
            "sales",
            "profile"

        ]

    };


    /* =====================================================
       SIDEBAR ROLE CONTROL
       ===================================================== */

    if (currentUser) {

        const userRole =
            currentUser.role;


        const allowedPages =
            rolePermissions[userRole]
            || rolePermissions.Employee;


        const sidebarLinks =
            document.querySelectorAll(
                ".sidebar-nav a"
            );


        sidebarLinks.forEach(function (link) {

            const href =
                link.getAttribute("href");


            /*
             No href = ignore
             */

            if (!href) {

                return;

            }


            /*
             Logout is outside sidebar-nav anyway,
             but this protection keeps it safe.
             */

            if (link.id === "logoutButton") {

                return;

            }


            let pageName =
                href
                    .split("/")
                    .pop()
                    .toLowerCase();


            pageName =
                pageName.replace(".html", "");


            /*
             My Profile
             */

            if (pageName === "profile") {

                link.style.display =
                    allowedPages.includes("profile")
                        ? ""
                        : "none";

                return;

            }


            /*
             Show / hide according to role
             */

            if (
                allowedPages.includes(pageName)
            ) {

                link.style.display = "";

            } else {

                link.style.display = "none";

            }

        });


        /* =================================================
           PREVENT UNAUTHORIZED PAGE ACCESS
           ================================================= */

        const currentPage =
            getCurrentPage();


        /*
         If current page is protected
         */

        if (
            !publicPages.includes(currentPage) &&
            currentPage !== ""
        ) {

            /*
             If page is not allowed for this role
             */

            if (
                !allowedPages.includes(currentPage)
            ) {

                alert(
                    "You do not have permission to access this page."
                );


                window.location.href =
                    "dashboard.html";


                return;

            }

        }

    }


    /* =====================================================
       ACTIVE SIDEBAR NAVIGATION
       ===================================================== */

    const currentPage =
        getCurrentPage();


    const sidebarNavigationLinks =
        document.querySelectorAll(
            ".sidebar-nav a"
        );


    sidebarNavigationLinks.forEach(function (link) {

        const href =
            link.getAttribute("href");


        if (!href) {

            return;

        }


        let linkPage =
            href
                .split("/")
                .pop()
                .toLowerCase();


        linkPage =
            linkPage.replace(".html", "");


        /*
         Remove old active class
         */

        link.classList.remove("active");


        /*
         Add active class to current page
         */

        if (
            linkPage === currentPage
        ) {

            link.classList.add("active");

        }

    });


});


/* =========================================================
   SIGN UP PASSWORD TOGGLE
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const signupPassword =
        document.getElementById("signupPassword");

    const confirmPassword =
        document.getElementById("confirmPassword");

    const toggleSignupPassword =
        document.getElementById("toggleSignupPassword");

    const toggleConfirmPassword =
        document.getElementById("toggleConfirmPassword");


    if (toggleSignupPassword && signupPassword) {

        toggleSignupPassword.addEventListener(
            "click",
            function () {

                if (signupPassword.type === "password") {

                    signupPassword.type = "text";

                    toggleSignupPassword.textContent = "🙈";

                } else {

                    signupPassword.type = "password";

                    toggleSignupPassword.textContent = "👁";
                }
            }
        );
    }


    if (toggleConfirmPassword && confirmPassword) {

        toggleConfirmPassword.addEventListener(
            "click",
            function () {

                if (confirmPassword.type === "password") {

                    confirmPassword.type = "text";

                    toggleConfirmPassword.textContent = "🙈";

                } else {

                    confirmPassword.type = "password";

                    toggleConfirmPassword.textContent = "👁";
                }
            }
        );
    }


    /* =====================================================
       PASSWORD STRENGTH
       ===================================================== */

    const passwordStrength =
        document.getElementById("passwordStrength");


    if (signupPassword && passwordStrength) {

        signupPassword.addEventListener(
            "input",
            function () {

                const password = signupPassword.value;

                passwordStrength.className =
                    "password-strength";


                if (password.length === 0) {

                    passwordStrength.textContent =
                        "Password strength";

                    return;
                }


                if (password.length < 6) {

                    passwordStrength.textContent =
                        "Weak password";

                    passwordStrength.classList.add("weak");

                } else if (password.length < 10) {

                    passwordStrength.textContent =
                        "Medium password";

                    passwordStrength.classList.add("medium");

                } else {

                    passwordStrength.textContent =
                        "Strong password";

                    passwordStrength.classList.add("strong");
                }
            }
        );
    }

});
