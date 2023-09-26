const inputTitulo = document.getElementById("titulo");
const inputImagem = document.getElementById("imagem");
const inputConteudo = document.getElementById("conteudo");
const btnCriarPost = document.getElementById("btnCriarPost");
const nomeUsuario = document.getElementById("nomeUsuario");

if(!sessionStorage.getItem("nome")) {
    window.location.href = "../pages/login.html"
}
//Você está conectado como: 
nomeUsuario.innerHTML = sessionStorage.getItem("nome");

//Faz a verificação de autorização para acessar a página 'criarPost'
import { verificarToken } from './authorization.js';
window.onload = verificarToken;

btnCriarPost.addEventListener("click", (e) => {
    e.preventDefault();

    const data = {
        autor: {
            id: sessionStorage.getItem("id")
        },
        titulo: inputTitulo.value,
        linkImagem: inputImagem.value,
        conteudo: inputConteudo.value
    }

    fetch("http://localhost:8080/post", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        body: JSON.stringify(data)
    })
    .then(x => x.text())
    .then(y => alert(y))
})

