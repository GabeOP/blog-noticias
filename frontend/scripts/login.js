const nomeUsuario = document.getElementById("nomeUsuario");
const senhaUsuario = document.getElementById("senhaUsuario");
const btnEntrar = document.getElementById("btnEntrar");

if(sessionStorage.getItem("token")) {
    window.location.href = "../pages/index.html"
}

btnEntrar.addEventListener("click", (e) => {
    e.preventDefault()

    const data = {
        nome: nomeUsuario.value,
        senha: senhaUsuario.value
    }
 
    fetch("http://localhost:8080/usuario/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(y => y.text())
    .then(x => {
        if(x == ""){
            alert("Falha no login.")
            return;
        }

        console.log(x)
        sessionStorage.setItem("nome", data.nome);
        sessionStorage.setItem("token", x)

        window.location.href = "../pages/index.html"
    })
})


