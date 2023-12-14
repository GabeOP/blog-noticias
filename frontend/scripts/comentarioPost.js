const btnComentar = document.getElementById("btnComentar");
const boxComentario = document.getElementById("boxComentario");

btnComentar.addEventListener("click", (e) => {
    e.preventDefault();

    const data = {
        postagem_id: {
            id: postagem_id
        },
        autorComentario: {
            id: sessionStorage.getItem("id")
        },
        comentario: boxComentario.value,
    }

    fetch("http://localhost:8080/comentario", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        body: JSON.stringify(data)
    })
    .then(res => res.text())
    .then(res => {
        alert(res);
        location.reload();
    })

});

fetch("http://localhost:8080/comentario", {
    method: "GET",
    headers: {
        "Authorization": "Bearer " + sessionStorage.getItem("token")
    }
})
.then(res => res.json())