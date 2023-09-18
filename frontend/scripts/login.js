const nomeUsuario = document.getElementById("nomeUsuario");
const btnEntrar = document.getElementById("btnEntrar");

btnEntrar.addEventListener("click", (e) => {
    e.preventDefault()
 
    fetch("http://localhost:8080/usuario", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(x => {
        console.log(x[0].nome);


        if(x[0].nome !== nomeUsuario.value) {
            alert("Usuário inexistente");
            return;
        }
    
        localStorage.setItem("nome", x[0].nome);
        localStorage.setItem("id", x[0].id);

        window.location.href = "index.html";
    })
})

