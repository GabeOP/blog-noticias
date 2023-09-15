const nomeUsuario = document.getElementById("nomeUsuario");

fetch("http://localhost:8080/usuario")
.then(x => x.json())
.then(res => {

    console.log(res)
    sessionStorage.setItem("nome", res[0].nome);

    nomeUsuario.innerHTML = sessionStorage.getItem("nome");
})