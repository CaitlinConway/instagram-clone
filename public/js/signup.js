const form = document.querySelector("#signup-form");
const errorsContainer = document.querySelector("#errors-container");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const userName = formData.get("userName");
  const password = formData.get("password");
  const email = formData.get("email");
  const password2 = formData.get("password2");
  const body = { userName, password, password2, email };
  errorsContainer.innerHTML = "";
  const res = await fetch("/api/users", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-type": "application/json",
    },
  });
  const data = await res.json();
  if (!res.ok) {
    const { message, errors } = data;
    if (errors) {
      for (let error of errors) {
        const errorLi = document.createElement("li");
        errorLi.innerHTML = error;
        errorsContainer.appendChild(errorLi);
      }
    }
    return;
  }

  window.location.href = "/";
});
