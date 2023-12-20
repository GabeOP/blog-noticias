import API from '../../axios/config';
import { useEffect, useState } from 'react';
import './DetalhesPost.css'

export function DetalhesPost() {

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [comentario, setComentario] = useState('');

    // Obtém a string de consulta da URL
    const queryString = window.location.search;

    // Cria um objeto URLSearchParams a partir da string de consulta
    const params = new URLSearchParams(queryString);

    // Obtém o valor do parâmetro 'id'
    const postagem_id = params.get('id');

    const handleComentSubmit = async (e) => {
        e.preventDefault();
    
        const postData = {
            postagem_id: {
                id: postagem_id
            },
            autorComentario: {
                id: sessionStorage.getItem("id")
            },
            comentario: comentario
        }

        const config = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
            },
          };

        try {
            await API.post("/comentario", postData, config)
          setComentario('');
        } catch (error) {
          console.error('Erro ao enviar formulário:', error);
        }
      };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await API.get("/products/" + postagem_id);
                setData(response.data);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchData();
    }, []);

    return (
        <div id='container-detalhes-post'>

            <div id='wrap-detalhes-post'>
                <div id="divTitulo-detalhes-post">
                    <h1 id='titulo-detalhes-post'>{data.title}</h1>
                    <p id='autor-detalhes-post'>Por <b>{data.category}</b></p>
                </div>
                <div id="divMain-detalhes-post">
                    <img id='imagem-detalhes-post' src={data.image} alt="" />
                    <p id='conteudo-detalhes-post'>{data.description}</p>
                </div>
            </div>

            <div id="wrap-comentarios">

                <form onSubmit={handleComentSubmit}>
                    <textarea id='boxComentario' placeholder='Escreva o seu comentário...' onChange={(e) => setComentario(e.target.value)}></textarea>
                    <button type="submit" id='btnComentar'>Comentar</button>
                </form>

                <h2>Comentários</h2>
                <div id="listaComentario">
                    <div id='wrapComentario'>
                        <p id="autorComentario">autor aqui</p>
                        <p id="textoComentario">
                            Lorem ipsum, dolor sit amet consectetur 
                            adipisicing elit. Dolore labore doloribus saepe repudiandae perspiciatis
                            id dicta atque autem fuga amet natus voluptatibus hic at porro ipsa sunt, facilis harum quia!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}