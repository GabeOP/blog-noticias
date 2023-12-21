import "./PostCard.css"
import { Link, BrowserRouter as Router } from 'react-router-dom'

export function PostCard ({id, titulo, imagem, conteudo, autor}) {
    return(

        <div id="post">
            <div id="post-imagem">
                <img src={imagem} alt="" />
            </div>
            <div id="containerInfos">
                <p id="titulo">{titulo}</p>
                <p id="conteudo">{conteudo}</p>
                <span id="autor">Autor: {autor}</span>
                <Link to={"/post?id="+id}>Ler mais...</Link>
            </div>
        </div>
    )
}