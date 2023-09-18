const titulo = document.getElementById("titulo");
const conteudo = document.getElementById("conteudo");

//Representa a tag main do HTML
const container = document.getElementById("container");

fetch("http://localhost:8080/post")
.then(x => x.json())
.then(res => {
    res.forEach((item, index) => {
        console.log(item);

        const div = document.createElement("div");

        const titulo = document.createElement("span");
        titulo.innerHTML = item.titulo;
        titulo.id = "titulo";

        const img = document.createElement("img");
        img.id = "img";
        img.src = item.linkImagem;

        const conteudo = document.createElement("span");
        conteudo.id = "conteudo";
        conteudo.innerHTML = item.conteudo;

        const autor = document.createElement("span");
        autor.id = "autor";
        autor.innerHTML = "Autor: " + item.autor.nome;

        container.appendChild(div);
        div.appendChild(titulo);
        div.appendChild(img);
        div.appendChild(conteudo);
        div.appendChild(autor);

        // Adiciona a tag span dentro da div
        // div.appendChild(span);

        // Adiciona a div ao contêiner
        //container.appendChild(div);
    });
    // titulo.innerHTML = res[0].titulo
    // conteudo.innerHTML = res[0].conteudo
})

