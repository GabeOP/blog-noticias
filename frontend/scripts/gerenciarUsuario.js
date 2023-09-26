const container = document.getElementById("continer");
const wrap = document.getElementById("wrap");
const btnConfirmar = document.getElementById("btnConfirmar");

if(!sessionStorage.getItem("token")) {
    window.location.href = "../pages/login.html"
}
//Você está conectado como: 
nomeUsuario.innerHTML = sessionStorage.getItem("nome");

function listaUsuarios() {

 fetch("http://localhost:8080/usuario", {
    method: "GET",
    headers: {
        "Authorization": "Bearer " + sessionStorage.getItem("token")
    }
})
.then(x => x.json())
.then(res => {
    res.forEach(element => {
        
        if(element.nome === "adm" || element.nome === sessionStorage.getItem("nome")) {
            return;
        }

        const div = document.createElement("div");
        div.id = "usuario"

        const infosUsuario = document.createElement("div");
        infosUsuario.id = "infosUsuario";

        const botoes = document.createElement("div");
        botoes.id = "botoes";

        const wrapNome = document.createElement("div");
        wrapNome.id = "wrapNome";

        const wrapCargo = document.createElement("div");
        wrapCargo.id = "wrapCargo";

        const pNome = document.createElement("p");
        pNome.innerHTML = "Nome:";

        const pCargo = document.createElement("p");
        pCargo.innerHTML = "Cargo:";

        const nomeUsuarioInput = document.createElement("input");
        nomeUsuarioInput.type = "text";
        nomeUsuarioInput.value = element.nome;
        nomeUsuarioInput.readOnly = true;
        nomeUsuarioInput.id = "nomeUsuarioInput";

        const cargoUsuario = document.createElement("p");
        cargoUsuario.innerHTML = element.cargo;

        const btnEditarCargo = document.createElement("button");
        btnEditarCargo.innerHTML = "Alterar cargo";
        btnEditarCargo.id = "btnEditarCargo";

        const btnExcluirUsuario = document.createElement("button");
        btnExcluirUsuario.innerHTML = "Excluir";
        btnExcluirUsuario.id = "btnExcluirUsuario";

        wrap.appendChild(div);

        wrapNome.appendChild(pNome);
        wrapNome.appendChild(nomeUsuarioInput);

        wrapCargo.appendChild(pCargo);
        wrapCargo.appendChild(cargoUsuario);

        infosUsuario.appendChild(wrapNome);
        infosUsuario.appendChild(wrapCargo);

        botoes.appendChild(btnEditarCargo);
        botoes.appendChild(btnExcluirUsuario);

        div.appendChild(infosUsuario);
        div.appendChild(botoes);

    });
})
}

window.onload = listaUsuarios;

btnConfirmar.addEventListener("click", (e) => {
    e.preventDefault();

    const data = {
        nome: inputNomeUsuario.value,
        cargo: cargoUsuario.value 
    }

    console.log(data);

    fetch("http://localhost:8080/usuario", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")    
        },
        body: JSON.stringify(data)
    })
})