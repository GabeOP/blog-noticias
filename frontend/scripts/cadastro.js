const nomeUsuario = document.getElementById("nomeUsuario");
const senhaUsuario = document.getElementById("senhaUsuario");
const btnRegistrar = document.getElementById("btnRegistrar");


btnRegistrar.addEventListener("click", (e) => {
    e.preventDefault();

    const data = {
        nome: nomeUsuario.value,
        senha: senhaUsuario.value
    }
    fetch("http://localhost:8080/usuario", {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(res => {
        if(!res.ok) {
            alert("Preencha todos os campos.")
            return;
        }

        alert("Usuário criado.");
        window.location.replace("../pages/login.html")

    })
})
