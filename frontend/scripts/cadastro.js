const nomeUsuario = document.getElementById("nomeUsuario");
const senhaUsuario = document.getElementById("senhaUsuario");
const btnRegistrar = document.getElementById("btnRegistrar");

if(sessionStorage.getItem("token")) {
    window.location.href =  "../../index.html"
}
    
btnRegistrar.addEventListener("click", async(e) => {
    e.preventDefault();

    const data = {
        nome: nomeUsuario.value,
        senha: senhaUsuario.value
    }
    await fetch("https://api-blog-xn32.onrender.com/usuario", {
        method: "POST",
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
