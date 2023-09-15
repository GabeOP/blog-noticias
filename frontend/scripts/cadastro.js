//const formCadastro = document.getElementById("form");
const nomeUsuario = document.getElementById("nomeUsuario");
const senhaUsuario = document.getElementById("senhaUsuario");
const btnRegistrar = document.getElementById("btnRegistrar");


btnRegistrar.addEventListener("click", async(e) => {
    e.preventDefault();

    const data = {
        nome: nomeUsuario.value,
        senha: senhaUsuario.value
    }

    console.log(nomeUsuario.value)
    console.log(data)
    await fetch("http://localhost:8080/usuario", {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
})
