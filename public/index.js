window.addEventListener("DOMContentLoaded", event => {
  document.querySelectorAll(".user-name").forEach(elm => {
    elm.addEventListener("click", event => {
      alert(event.target.innerHTML);
    });
  });

  document.querySelector(".send-button").addEventListener("click", async event => {
    const newElement = document.createElement("li");
    const text = document.querySelector(".input-text").value;

    await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: text })
    });

    newElement.innerHTML = text;
    document.querySelector(".user-list").appendChild(newElement);
  });
});