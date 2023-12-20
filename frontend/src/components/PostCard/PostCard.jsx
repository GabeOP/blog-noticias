import "./PostCard.css"
import { Link, BrowserRouter as Router } from 'react-router-dom'

export function PostCard ({id, titulo, imagem, conteudo, autor}) {
    return(

        <div id="post">
            <p id="titulo">{titulo}</p>
            <img src={imagem} id="img" alt="" />
            <p id="conteudo">{conteudo}</p>
            <div id="containerInfos">
                <span id="autor">Autor: {autor}</span>
                <Link to={"/post?id="+id}>Ler mais...</Link>
            </div>
        </div>
    )
}