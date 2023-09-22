const titulo = document.getElementById("titulo");
const conteudo = document.getElementById("conteudo");
const btnSair = document.getElementById("btnSair");
const btnCriarPost = document.getElementById("btnCriarPost");
const nomeUsuario = document.getElementById("nomeUsuario");

//Representa a tag main do HTML
const container = document.getElementById("container");

if(!sessionStorage.getItem("nome")) {
    window.location.href = "../pages/login.html"
}
nomeUsuario.innerHTML = sessionStorage.getItem("nome");

if(sessionStorage.getItem("nome") !== "adm") {
    btnCriarPost.remove()
}

fetch("http://localhost:8080/post", {
    method: "GET",
    headers: {
        "Authorization": "Bearer " + sessionStorage.getItem("token")
    }
})
.then((x) => {
    if(!x.ok) {
        sessionStorage.clear();
        alert("Sessão expirada.");
        
        window.location.href = "../pages/login.html";
    }
    return x.json();
})
.then(res => {

    res.forEach((item, index) => {
        console.log(item);

        const div = document.createElement("div");
        div.id = "post"

        const titulo = document.createElement("span");
        titulo.innerHTML = item.titulo;
        titulo.id = "titulo";

        const img = document.createElement("img");
        img.id = "img";
        img.src = item.linkImagem;

        const conteudo = document.createElement("span");
        conteudo.id = "conteudo";
        conteudo.innerHTML = item.conteudo;

        const autor = document.createElement("span");
        autor.id = "autor";
        autor.innerHTML = "Autor: " + item.autor.nome;

        container.appendChild(div);
        div.appendChild(titulo);
        div.appendChild(img);
        div.appendChild(conteudo);
        div.appendChild(autor);
    });
});

btnSair.addEventListener("click", () => {
    sessionStorage.clear();
})