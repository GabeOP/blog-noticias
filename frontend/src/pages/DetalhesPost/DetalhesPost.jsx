import API from '../../axios/config';
import { useEffect, useState } from 'react';
import './DetalhesPost.css'

export function DetalhesPost() {

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    // Obtém a string de consulta da URL
    const queryString = window.location.search;

    // Cria um objeto URLSearchParams a partir da string de consulta
    const params = new URLSearchParams(queryString);

    // Obtém o valor do parâmetro 'id'
    const postagem_id = params.get('id');

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
                <textarea name='comentario' id='boxComentario' placeholder='Escreva o seu comentário...'></textarea>
                <input type="button" value="Comentar" id='btnComentar' />
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