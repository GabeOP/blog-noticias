const nomeUsuario = document.getElementById("nomeUsuario");
if(!sessionStorage.getItem("nome")) {
    window.location.href = "../pages/cadastro.html"
}
fetch("http://localhost:8080/usuario")
.then(x => x.json())
.then(res => {


    sessionStorage.setItem("nome", res[0].nome);

    nomeUsuario.innerHTML = sessionStorage.getItem("nome");
})