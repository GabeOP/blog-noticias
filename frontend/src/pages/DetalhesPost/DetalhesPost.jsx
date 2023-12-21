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

    function refreshPage() {
        window.location.reload();
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
        },
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await API.get(`/post/${postagem_id}`, config);
                setData(response.data);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchData();
    }, []);

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

        try {
            await API.post("/comentario", postData, config)
            setComentario('');
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
        }
    };

    return (
        <div id='container-detalhes-post'>

            {console.log(data)}
            <div id='wrap-detalhes-post'>
                <div id="divTitulo-detalhes-post">
                    <h1 id='titulo-detalhes-post'>{data.titulo}</h1>
                    <p id='autor-detalhes-post'>Por <b>{data.autor && data.autor.nome}</b></p>
                </div>
                <div id="divMain-detalhes-post">
                    <img id='imagem-detalhes-post' src={data.imagem} alt="" />
                    <p id='conteudo-detalhes-post'>{data.conteudo}</p>
                </div>
            </div>

            <div id="wrap-comentarios">

                <form onSubmit={handleComentSubmit}>
                    <textarea id='boxComentario' placeholder='Escreva o seu comentário...' onChange={(e) => setComentario(e.target.value)}></textarea>
                    <button type="submit" onClick={refreshPage} id='btnComentar'>Comentar</button>
                </form>

                <h2>Comentários</h2>
                {data.comentarioList && data.comentarioList.length > 0 && (
                    <div id="listaComentario">
                        {
                            data.comentarioList.map((item, index) => (
                                <div key={index} id='wrapComentario'>
                                    <p id="autorComentario">{item.autorComentario.nome}</p>
                                    <p id="textoComentario">{item.comentario}</p>
                                </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}