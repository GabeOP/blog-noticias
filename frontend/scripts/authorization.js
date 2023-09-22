export async function verificarToken() {
    await fetch("http://localhost:8080/usuario/auth", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + sessionStorage.getItem("token")
            }
        })
        .then(x => {
            if(!x.ok) {
                window.location.href = '../pages/index.html';
                return;
            }
        })
}

