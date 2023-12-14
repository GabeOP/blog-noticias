export async function verificarToken() {
    await fetch("https://api-blog-xn32.onrender.com/usuario/auth", {
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

