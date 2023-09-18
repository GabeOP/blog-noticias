const inputTitulo = document.getElementById("titulo");
const inputImagem = document.getElementById("imagem");
const inputConteudo = document.getElementById("conteudo");
const btnCriarPost = document.getElementById("btnCriarPost");

btnCriarPost.addEventListener("click", (e) => {
    e.preventDefault();

    const data = {
        autor: {
            id: localStorage.getItem("id")
        },
        titulo: inputTitulo.value,
        linkImagem: inputImagem.value,
        conteudo: inputConteudo.value
    }

    fetch("http://localhost:8080/post", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
})

