window.addEventListener("DOMContentLoaded", event => {
  document.querySelectorAll(".user-name").forEach(elm => {
    elm.addEventListener("click", event => {
      alert(event.target.innerHTML);
    });
  });

  document.querySelector(".send-button").addEventListener("click", event => {
    const newElement = document.createElement("li");
    const text = document.querySelector(".input-text").value;
    newElement.innerHTML = text;
    document.querySelector(".user-list").appendChild(newElement);
  });
});