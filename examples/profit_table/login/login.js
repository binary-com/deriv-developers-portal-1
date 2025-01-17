const url = new URL(window.location.href);
const bc = new BroadcastChannel("auth");
const login_token = url.searchParams.get("token1");
const login_button = document.querySelector("#loginButton");
const authorized_message = document.querySelector("#authorized");
const unauthorized_message = document.querySelector("#unauthorized");
const profit_table = document.querySelector("#profit_table");

const updateElementStyles = () => {
  login_button.style.display = "none";
  authorized_message.style.display = "inline-block";
  unauthorized_message.style.display = "none";
  profit_table.style.opacity = "1";
  profit_table.style.pointerEvents = "auto";
  profit_table.style.cursor = "pointer";
};

const buttonResponse = () => {
  window.open(
    "https://oauth.deriv.com/oauth2/authorize?app_id=32449&l=EN&brand=deriv",
    "newwindow",
    "width=320,height=800"
  );
};

login_button.addEventListener("click", buttonResponse);

window.onload = () => {
  const localstore_token = localStorage.getItem("login_token");
  if (localstore_token.length >= 0) {
    updateElementStyles();
  }
};

bc.onmessage = function (event) {
  if (event.data.login_token) {
    bc.postMessage("close");
    localStorage.setItem("login_token", event.data.login_token);
  }
  if (event.data === "close") {
    bc.postMessage("login_success");
    window.close();
  }
  if (event.data === "login_success") {
    updateElementStyles();
  }
};

if (login_token) {
  bc.postMessage({ login_token });
}
