import "./PostCard.css"
import { Link, BrowserRouter as Router } from 'react-router-dom'

export function PostCard ({titulo, imagem, conteudo, autor}) {
    return(

        <div id="post">
            <p id="titulo">{titulo}</p>
            <img src={imagem} id="img" alt="" />
            <p id="conteudo">{conteudo}</p>
            <div id="containerInfos">
                <span id="autor">Autor: {autor}</span>
                <Router><Link to="./frontend/pages/login.html">Ler mais...</Link></Router>
            </div>
        </div>
    )
}