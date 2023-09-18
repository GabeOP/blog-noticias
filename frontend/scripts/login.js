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

        x.forEach(element => {

            console.log(element.nome);
            if(element.nome == nomeUsuario.value) {
                alert("Login realizado com sucesso.");

                localStorage.setItem("nome", element.nome);
                localStorage.setItem("id", element.id);

                window.location.href = "../pages/index.html"
            }else {
                alert("Usuário inexistente.")
            }

        });

        
    })
})

