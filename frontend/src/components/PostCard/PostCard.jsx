

export function PostCard ({titulo, imagem, conteudo, autor}) {
    return(
        <>
            <p id="titulo">{titulo}</p>
            <img src={imagem} id="img" alt="" />
            <p id="conteudo">{conteudo}</p>
            <div id="containerInfos">
                <span id="autor">Autor: {autor}</span>
                {/* <Link to={'/postagem'}>Ler mais...</Link> */}
            </div>
        </>
    )
}