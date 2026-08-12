document.addEventListener("DOMContentLoaded", function () {

  const scriptURL =
    "https://script.google.com/macros/s/AKfycbz_kZvyKc9vRNrzWRw0EF-U0kUfsiCA0Bn8axqlNDqI5tXOob51BIUnrIdJWN3XSf0eNw/exec";

  const form = document.querySelector('form[name="submit-to-google-sheet"]');
  const msg = document.getElementById("msg");

  if (!form) {
    console.error("폼을 찾을 수 없습니다.");
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    msg.innerHTML = "전송 중...";

    const formData = new FormData(form);

    fetch(scriptURL, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        msg.innerHTML = "Message sent successfully";

        form.reset();

        setTimeout(function () {
          msg.innerHTML = "";
        }, 5000);
      })
      .catch((error) => {
        console.error("Error!", error);
        msg.innerHTML = "전송에 실패했습니다.";
      });
  });

});