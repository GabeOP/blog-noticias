const nomeUsuario = document.getElementById("nomeUsuario");

// Obtém a string de consulta da URL
const queryString = window.location.search;

// Cria um objeto URLSearchParams a partir da string de consulta
const params = new URLSearchParams(queryString);

// Obtém o valor do parâmetro 'id'
const id = params.get('id');

//Você está conectado como: 
nomeUsuario.innerHTML = sessionStorage.getItem("nome");

//const container = document.getElementById("container");

fetch("http://localhost:8080/post/" + id, {
    method: "GET",
    headers: {
        "Authorization": "Bearer " + sessionStorage.getItem("token")
    }
})
.then(res => res.json())
.then(res => {
    document.title = res.titulo;
    console.log(res)
})