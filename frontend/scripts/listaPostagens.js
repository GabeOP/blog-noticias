export async function listaPostagens() {
        await fetch("http://localhost:8080/post", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        }
    })
    .then((x) => {
        if(!x.ok) {
            sessionStorage.clear();
            alert("Sessão expirada.");
            
            window.location.href = "../pages/login.html";
        }
        return x.json();
    })
    .then(res => {

        res.forEach((item, index) => {
            console.log(item);

            const div = document.createElement("div");
            div.id = "post"

            const titulo = document.createElement("span");
            titulo.innerHTML = item.titulo;
            titulo.id = "titulo";

            const img = document.createElement("img");
            img.id = "img";
            img.src = item.linkImagem;

            const conteudo = document.createElement("span");
            conteudo.id = "conteudo";
            conteudo.innerHTML = item.conteudo;

            const containerInfos = document.createElement("div");
            containerInfos.id = "containerInfos";

            const autor = document.createElement("span");
            autor.id = "autor";
            autor.innerHTML = "Autor: " + item.autor.nome;

            if(sessionStorage.getItem("cargo") === "ADM") {
                const botaoGerenciarPost = document.createElement("button");
                botaoGerenciarPost.id = "botaoGerenciarPost";
                botaoGerenciarPost.innerHTML = "Gerenciar";
                containerInfos.appendChild(botaoGerenciarPost);
            }

            container.appendChild(div);
            div.appendChild(titulo);
            div.appendChild(img);
            div.appendChild(conteudo);

            containerInfos.appendChild(autor);
            div.appendChild(containerInfos);
        });
    })
}