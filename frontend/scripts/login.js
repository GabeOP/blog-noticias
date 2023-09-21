const nomeUsuario = document.getElementById("nomeUsuario");
const senhaUsuario = document.getElementById("senhaUsuario");
const btnEntrar = document.getElementById("btnEntrar");

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
        localStorage.setItem("nome", data.nome);
        localStorage.setItem("token", x)

        window.location.href = "../pages/index.html"
    })
})


