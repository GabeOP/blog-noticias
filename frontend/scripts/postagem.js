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
const wrapPost = document.getElementById("wrapPost");

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
    
    const divTitulo = document.createElement("div");
    divTitulo.id = "divTitulo";

    const divMain = document.createElement("div");
    divMain.id = "divMain";

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

    //Parte da div que cria a área dos comentários
    const divComentario = document.createElement("div");
    divComentario.id = "divListaComentario";

    res.comentarioList.forEach((item, index) => {
        console.log(item);
    })

    const autorComentario = document.createElement("p");
    autorComentario.id = "autorComentario";

    const textoComentario = document.createElement("p");
    textoComentario.id = "textoComentario";

    const dataComentario = document.createElement("p");
    dataComentario.id = "dataComentario";

    container.appendChild(divTitulo);
    container.appendChild(divMain);
    container.appendChild(divComentario);

    divTitulo.appendChild(titulo);
    divTitulo.appendChild(autor);

    divMain.appendChild(img);
    divMain.appendChild(conteudo);

    wrapPost.appendChild(divTitulo);
    wrapPost.appendChild(divMain);
    
    divComentario.appendChild(autorComentario);
    divComentario.appendChild(textoComentario);
    divComentario.appendChild(dataComentario);
})