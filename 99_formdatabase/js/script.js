const scriptURL =
  "https://script.google.com/macros/s/AKfycbz_kZvyKc9vRNrzWRw0EF-U0kUfsiCA0Bn8axqlNDqI5tXOob51BIUnrIdJWN3XSf0eNw/exec";

const form = document.forms["submit-to-google-sheet"];
const msg = document.getElementById("msg");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  msg.innerHTML = "전송 중...";

  const formData = new FormData(form);

  console.log("Name:", formData.get("Name"));
  console.log("Email:", formData.get("Email"));
  console.log("Message:", formData.get("Message"));

  fetch(scriptURL, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      console.log("응답 상태:", response.status);

      return response.text();
    })
    .then((data) => {
      console.log("Apps Script 응답:", data);

      msg.innerHTML = "Message sent successfully";

      form.reset();

      setTimeout(function () {
        msg.innerHTML = "";
      }, 5000);
    })
    .catch((error) => {
      console.error("전송 오류:", error);
      msg.innerHTML = "전송에 실패했습니다.";
    });
});