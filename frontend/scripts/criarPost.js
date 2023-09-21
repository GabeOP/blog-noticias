const inputTitulo = document.getElementById("titulo");
const inputImagem = document.getElementById("imagem");
const inputConteudo = document.getElementById("conteudo");
const btnCriarPost = document.getElementById("btnCriarPost");
const nomeUsuario = document.getElementById("nomeUsuario");

if(!localStorage.getItem("nome")) {
    window.location.href = "../pages/login.html"
}
nomeUsuario.innerHTML = localStorage.getItem("nome");

  async function verificarToken() {
    const response = await fetch("http://localhost:8080/usuario/auth", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(localStorage.getItem("token"))
    })
    .then(x => {
        console.log(x)
        if(!x.ok) {
            console.error('Acesso não autorizado.');
            window.location.href = '../pages/index.html';
            return;
        }
        console.log("Acesso permitido")
    })

  }

  window.onload = verificarToken;


btnCriarPost.addEventListener("click", (e) => {
    e.preventDefault();

    const data = {
        autor: {
            //id: localStorage.getItem("id")
            id: "609a00c7-29e9-445a-96d7-bfddf8f4ba5d"
        },
        titulo: inputTitulo.value,
        linkImagem: inputImagem.value,
        conteudo: inputConteudo.value
    }

    fetch("http://localhost:8080/post", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(data)
    })
    .then(x => x.text())
    .then(y => alert(y))
})

