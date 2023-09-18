const nomeUsuario = document.getElementById("nomeUsuario");
if(!localStorage.getItem("nome")) {
    window.location.href = "../pages/cadastro.html"
}
fetch("http://localhost:8080/usuario")
.then(x => x.json())
.then(res => {


    localStorage.setItem("nome", res[0].nome);

    nomeUsuario.innerHTML = localStorage.getItem("nome");
})