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
 
    fetch("https://api-blog-xn32.onrender.com/usuario/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(y => y.json())
    .then(x => {
        if(x == ""){
            alert("Falha no login.")
            return;
        }

        sessionStorage.setItem("id", x.id);
        sessionStorage.setItem("nome", x.nome);
        sessionStorage.setItem("cargo", x.cargo);
        sessionStorage.setItem("token", x.token)

        window.location.href = "../pages/index.html"
    })
})


