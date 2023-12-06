const btnSair = document.getElementById("btnSair");
const btnCriarPost = document.getElementById("btnCriarPost");
const btnGerenciar = document.getElementById("btnGerenciar");
const nomeUsuario = document.getElementById("nomeUsuario");


if(!sessionStorage.getItem("nome")) {
    window.location.href = "../pages/login.html"
}
nomeUsuario.innerHTML = sessionStorage.getItem("nome");

if(sessionStorage.getItem("cargo") !== "ADM") {
    btnCriarPost.remove();
    btnGerenciar.remove();
}

import { listaPostagens } from "./listaPostagens.js";
window.onload = listaPostagens;

btnSair.addEventListener("click", () => {
    sessionStorage.clear();
})