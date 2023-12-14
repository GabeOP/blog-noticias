const nomeUsuario = document.getElementById("nomeUsuario");

// Obtém a string de consulta da URL
const queryString = window.location.search;

// Cria um objeto URLSearchParams a partir da string de consulta
const params = new URLSearchParams(queryString);

// Obtém o valor do parâmetro 'id'
const postagem_id = params.get('id');

//Você está conectado como: 
nomeUsuario.innerHTML = sessionStorage.getItem("nome");

const container = document.getElementById("container");
const wrapPost = document.getElementById("wrapPost");

fetch("https://api-blog-xn32.onrender.com/post/" + postagem_id, {
    method: "GET",
    headers: {
        "Authorization": "Bearer " + sessionStorage.getItem("token")
    }
})
.then(res => res.json())
.then(res => {
    document.title = res.titulo;
    
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

    const listaComentario = document.getElementById("listaComentario");
    
    //Parte da div que cria a área dos comentários
    res.comentarioList.forEach((item, index) => {

        const wrapComentario = document.createElement("div");
        wrapComentario.id = "wrapComentario";
    
        const autorComentario = document.createElement("p");
        autorComentario.id = "autorComentario";
        autorComentario.innerHTML = item.autorComentario.nome;

        const textoComentario = document.createElement("p");
        textoComentario.id = "textoComentario";
        textoComentario.innerHTML = item.comentario;
    
        const dataComentario = document.createElement("p");
        dataComentario.id = "dataComentario";
        dataComentario.innerHTML = item.dataComentario;

            
        wrapComentario.appendChild(autorComentario);
        wrapComentario.appendChild(textoComentario);
        wrapComentario.appendChild(dataComentario);
            
        listaComentario.appendChild(wrapComentario);
        container.appendChild(divComentario);
    })

    container.appendChild(divTitulo);
    container.appendChild(divMain);


    divTitulo.appendChild(titulo);
    divTitulo.appendChild(autor);

    divMain.appendChild(img);
    divMain.appendChild(conteudo);

    wrapPost.appendChild(divTitulo);
    wrapPost.appendChild(divMain);

});