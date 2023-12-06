const nomeUsuario = document.getElementById("nomeUsuario");

// Obtém a string de consulta da URL
const queryString = window.location.search;

// Cria um objeto URLSearchParams a partir da string de consulta
const params = new URLSearchParams(queryString);

// Obtém o valor do parâmetro 'id'
const id = params.get('id');

//Você está conectado como: 
nomeUsuario.innerHTML = sessionStorage.getItem("nome");

const container = document.getElementById("container");

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
    
    const div = document.createElement("div");
    div.id = "post";

    const divTitulo = document.createElement("div");
    div.id = "divTitulo";

    const divMain = document.createElement("div");
    div.id = "divMain";

    const titulo = document.createElement("h1");
    titulo.innerHTML = res.titulo;
    titulo.id = "titulo";

    const autor = document.createElement("p");
    autor.innerHTML = `Por ${res.autor.nome}`;
    autor.id = "autor";

    const img = document.createElement("img");
    img.id = "img";
    img.src = res.linkImagem;

    const conteudo = document.createElement("p");
    conteudo.id = "conteudo";
    conteudo.innerHTML = res.conteudo;

    container.appendChild(divTitulo);
    container.appendChild(divMain);

    divTitulo.appendChild(titulo);
    divTitulo.appendChild(autor);

    divMain.appendChild(img);
    divMain.appendChild(conteudo);

})