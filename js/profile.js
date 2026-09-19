/* =========================================================
   NEXORA ERP - MY PROFILE
========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const profileAvatar =
        document.getElementById("profileAvatar");

    const profileHeroName =
        document.getElementById("profileHeroName");

    const profileHeroEmail =
        document.getElementById("profileHeroEmail");

    const profileHeroRole =
        document.getElementById("profileHeroRole");


    const profileName =
        document.getElementById("profileName");

    const profileEmail =
        document.getElementById("profileEmail");

    const profilePhone =
        document.getElementById("profilePhone");

    const profileRole =
        document.getElementById("profileRole");


    const profileAccountRole =
        document.getElementById("profileAccountRole");


    const editProfileButton =
        document.getElementById("editProfileButton");

    const profileEditCard =
        document.getElementById("profileEditCard");

    const profileForm =
        document.getElementById("profileForm");

    const cancelProfileButton =
        document.getElementById("cancelProfileButton");


    const editProfileName =
        document.getElementById("editProfileName");

    const editProfileEmail =
        document.getElementById("editProfileEmail");

    const editProfilePhone =
        document.getElementById("editProfilePhone");


    /* =====================================================
       GET CURRENT USER
    ===================================================== */

    function getCurrentProfile() {

        try {

            const user =
                JSON.parse(
                    localStorage.getItem("nexoraUser")
                );

            return user || null;

        } catch (error) {

            console.error(
                "Unable to load profile:",
                error
            );

            return null;

        }

    }


    /* =====================================================
       GET FIRST LETTER
    ===================================================== */

    function getInitial(name) {

        if (!name) {

            return "U";

        }

        return name
            .trim()
            .charAt(0)
            .toUpperCase();

    }


    /* =====================================================
       DISPLAY PROFILE
    ===================================================== */

    function displayProfile() {

        const user =
            getCurrentProfile();


        if (!user) {

            return;

        }


        const name =
            user.name || "User";

        const email =
            user.email || "-";

        const phone =
            user.phone || "Not provided";

        const role =
            user.role || "Employee";


        /* -----------------------------------------------
           AVATAR
        ------------------------------------------------ */

        if (profileAvatar) {

            profileAvatar.textContent =
                getInitial(name);

        }


        /* -----------------------------------------------
           HERO
        ------------------------------------------------ */

        if (profileHeroName) {

            profileHeroName.textContent =
                name;

        }


        if (profileHeroEmail) {

            profileHeroEmail.textContent =
                email;

        }


        if (profileHeroRole) {

            profileHeroRole.textContent =
                role;

        }


        /* -----------------------------------------------
           PERSONAL INFORMATION
        ------------------------------------------------ */

        if (profileName) {

            profileName.textContent =
                name;

        }


        if (profileEmail) {

            profileEmail.textContent =
                email;

        }


        if (profilePhone) {

            profilePhone.textContent =
                phone;

        }


        if (profileRole) {

            profileRole.textContent =
                role;

        }


        /* -----------------------------------------------
           ACCOUNT INFORMATION
        ------------------------------------------------ */

        if (profileAccountRole) {

            profileAccountRole.textContent =
                role;

        }


        /* -----------------------------------------------
           EDIT FORM
        ------------------------------------------------ */

        if (editProfileName) {

            editProfileName.value =
                name;

        }


        if (editProfileEmail) {

            editProfileEmail.value =
                email;

        }


        if (editProfilePhone) {

            editProfilePhone.value =
                user.phone || "";

        }

    }


    /* =====================================================
       OPEN EDIT PROFILE
    ===================================================== */

    if (editProfileButton) {

        editProfileButton.addEventListener(
            "click",
            function () {

                if (!profileEditCard) {

                    return;

                }


                profileEditCard.classList.add(
                    "profile-edit-visible"
                );


                profileEditCard.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }
        );

    }


    /* =====================================================
       CANCEL EDIT
    ===================================================== */

    if (cancelProfileButton) {

        cancelProfileButton.addEventListener(
            "click",
            function () {

                if (profileEditCard) {

                    profileEditCard.classList.remove(
                        "profile-edit-visible"
                    );

                }


                displayProfile();

            }
        );

    }


    /* =====================================================
       SAVE PROFILE
    ===================================================== */

    if (profileForm) {

        profileForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const user =
                    getCurrentProfile();


                if (!user) {

                    alert(
                        "User profile not found."
                    );

                    return;

                }


                const name =
                    editProfileName
                        ? editProfileName.value.trim()
                        : "";


                const email =
                    editProfileEmail
                        ? editProfileEmail.value.trim()
                        : "";


                const phone =
                    editProfilePhone
                        ? editProfilePhone.value.trim()
                        : "";


                /* -----------------------------------------
                   VALIDATION
                ----------------------------------------- */

                if (!name) {

                    alert(
                        "Please enter your full name."
                    );

                    return;

                }


                if (!email) {

                    alert(
                        "Please enter your email address."
                    );

                    return;

                }


                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (
                    !emailPattern.test(email)
                ) {

                    alert(
                        "Please enter a valid email address."
                    );

                    return;

                }


                /* -----------------------------------------
                   UPDATE USER
                ----------------------------------------- */

                user.name =
                    name;

                user.email =
                    email;

                user.phone =
                    phone;


                /* -----------------------------------------
                   SAVE LOCAL STORAGE
                ----------------------------------------- */

                localStorage.setItem(
                    "nexoraUser",
                    JSON.stringify(user)
                );


                /* -----------------------------------------
                   UPDATE REMEMBERED EMAIL
                ----------------------------------------- */

                const rememberedEmail =
                    localStorage.getItem(
                        "nexoraRememberedEmail"
                    );


                if (rememberedEmail) {

                    localStorage.setItem(
                        "nexoraRememberedEmail",
                        email
                    );

                }


                /* -----------------------------------------
                   REFRESH PROFILE
                ----------------------------------------- */

                displayProfile();


                if (profileEditCard) {

                    profileEditCard.classList.remove(
                        "profile-edit-visible"
                    );

                }


                alert(
                    "Profile updated successfully."
                );

            }
        );

    }


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    displayProfile();

});