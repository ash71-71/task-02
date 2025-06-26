document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  const nameInput = document.getElementById("Name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const ageInput = document.getElementById("age");
  const showPasswordCheckbox = document.getElementById("showPassword");
  const terms = document.getElementById("terms");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const male=document.getElementById("male");
  const femle = this.document.getElementById("female");

  const gender ="";
  if(male.checked){
    gender="male";
  }
  else{
    gender ="female"
  }
  showPasswordCheckbox.addEventListener("click", function () {
    togglePassword();
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!terms.checked) {
      showError("You must agree to the terms and conditions.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    loadingSpinner.style.display = "block";

    try {
      const payload = {
        user: {
          personal_info: {
            full_name: nameInput.value.trim(),
            email: emailInput.value.trim().toLowerCase(),
            age: parseInt(ageInput.value),
            gender : gender,
          },
          account_details: {
            password: passwordInput.value,
          },
        },
        meta: {
          terms_accepted: true,
          accepted_at: new Date().toISOString(),
          source: "web_form",
        },
      };

      console.log("Form Payload:", payload);

      const apiUrl = "https://jsonplaceholder.typicode.com/posts";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      loadingSpinner.style.display = "none";

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to submit form");
      }

      console.log("API Response:", responseData);
      showSuccess(responseData.message || "Registration successful!");
      form.reset();
    } catch (error) {
      loadingSpinner.style.display = "none";
      console.error("Submission Error:", error);
      showError(error.message || "An error occurred. Please try again.");
    }
  });

  function validateForm() {
    let isValid = true;

    if (!nameInput.value.trim()) {
      setFieldError(nameInput, "name-error", "Name is required");
      isValid = false;
    }

    const email = emailInput.value.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      setFieldError(emailInput, "email-error", "Invalid email format");
      isValid = false;
    }

    if (passwordInput.value.length < 8) {
      setFieldError(
        passwordInput,
        "password-error",
        "Password must be at least 8 characters"
      );
      isValid = false;
    }

    const ageValue = parseInt(ageInput.value);
    if (isNaN(ageValue) || ageValue < 18 || ageValue > 100) {
      setFieldError(ageInput, "age-error", "Age must be between 18-100");
      isValid = false;
    }

    return isValid;
  }

  function setFieldError(inputElement, errorElementId, message) {
    inputElement.classList.add("input-error");
    const errorElement = document.getElementById(errorElementId);
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }

  function clearFieldError(inputElement, errorElementId) {
    inputElement.classList.remove("input-error");
    document.getElementById(errorElementId).style.display = "none";
  }

  function togglePassword() {
    passwordInput.type = showPasswordCheckbox.checked ? "text" : "password";
  }

  function showSuccess(message) {
    alert(message);
  }

  function showError(message) {
    alert(message);
  }

  [nameInput, emailInput, passwordInput, ageInput].forEach((input) => {
    input.addEventListener("input", () => {
      clearFieldError(input, `${input.id}-error`);
    });
  });
});
