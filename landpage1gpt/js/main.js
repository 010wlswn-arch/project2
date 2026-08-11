document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("leadModal");
  const openButtons = document.querySelectorAll(".js-open-modal");
  const closeButton = document.getElementById("modalClose");
  const successClose = document.getElementById("successClose");

  const leadForm = document.getElementById("leadForm");
  const formState = document.getElementById("formState");
  const successState = document.getElementById("successState");

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const privacyInput = document.getElementById("privacy");
  const privacyError = document.getElementById("privacyError");

  const openModal = () => {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    setTimeout(() => {
      nameInput.focus();
    }, 250);
  };

  const closeModal = () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    setTimeout(() => {
      resetModal();
    }, 250);
  };

  const resetModal = () => {
    leadForm.reset();
    clearErrors();

    formState.style.display = "block";
    successState.classList.remove("active");
  };

  openButtons.forEach((button) => {
    button.addEventListener("click", openModal);
  });

  closeButton.addEventListener("click", closeModal);
  successClose.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  const setError = (input, message) => {
    const field = input.closest(".form-field");
    field.classList.add("error");
    field.querySelector(".field-error").textContent = message;
  };

  const clearInputError = (input) => {
    const field = input.closest(".form-field");
    if (!field) return;

    field.classList.remove("error");
    field.querySelector(".field-error").textContent = "";
  };

  const clearErrors = () => {
    [nameInput, emailInput, phoneInput].forEach(clearInputError);
    privacyError.textContent = "";
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone) => {
    const numbers = phone.replace(/\D/g, "");
    return /^01[016789]\d{7,8}$/.test(numbers);
  };

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);

    if (numbers.length <= 3) {
      return numbers;
    }

    if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    }

    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  };

  phoneInput.addEventListener("input", (event) => {
    event.target.value = formatPhoneNumber(event.target.value);
    clearInputError(phoneInput);
  });

  nameInput.addEventListener("input", () => clearInputError(nameInput));
  emailInput.addEventListener("input", () => clearInputError(emailInput));

  privacyInput.addEventListener("change", () => {
    if (privacyInput.checked) {
      privacyError.textContent = "";
    }
  });

  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();

    clearErrors();

    let isValid = true;

    if (!nameInput.value.trim()) {
      setError(nameInput, "이름을 입력해주세요.");
      isValid = false;
    }

    if (!emailInput.value.trim()) {
      setError(emailInput, "이메일 주소를 입력해주세요.");
      isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      setError(emailInput, "올바른 이메일 주소를 입력해주세요.");
      isValid = false;
    }

    if (!phoneInput.value.trim()) {
      setError(phoneInput, "전화번호를 입력해주세요.");
      isValid = false;
    } else if (!isValidPhone(phoneInput.value.trim())) {
      setError(phoneInput, "올바른 전화번호를 입력해주세요.");
      isValid = false;
    }

    if (!privacyInput.checked) {
      privacyError.textContent = "개인정보 수집 및 이용에 동의해주세요.";
      isValid = false;
    }

    if (!isValid) return;

    // 실제 서버/API 전송을 연결하려면 이 위치에 fetch 코드를 추가하세요.
    // 예:
    // fetch("/api/leads", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     name: nameInput.value.trim(),
    //     email: emailInput.value.trim(),
    //     phone: phoneInput.value.trim()
    //   })
    // });

    formState.style.display = "none";
    successState.classList.add("active");
  });

  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min((index % 5) * 60, 240)}ms`;
    revealObserver.observe(element);
  });

  const header = document.querySelector(".header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 30) {
      header.style.boxShadow = "0 8px 30px rgba(17, 24, 39, 0.06)";
    } else {
      header.style.boxShadow = "none";
    }
  });
});
