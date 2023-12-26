import React, { useState } from 'react';
import API from '../../axios/config';
import "./CriarPost.css"

export function CriarPost() {

    const [titulo, setTitulo] = useState({})
    const [imagem, setImagem] = useState({})
    const [conteudo, setConteudo] = useState({})

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dados = {
            autor: {
                id: sessionStorage.getItem("id")
            },
            titulo: titulo,
            linkImagem: imagem,
            conteudo: conteudo
        }

        const config = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
            },
          };

        try {
            const response = await API.post("/post", dados, config);
            alert(response.data)
        } catch (error) {
            alert("Sessão expirada.")
            window.location.href = "/login"
        }
    };

    return (
        <form id='form-criar-post' onSubmit={handleSubmit}>
            <h1>Criar nova postagem</h1>
            <div id='titulo-criar-post'>
                <label htmlFor="titulo">Título:</label>
                <input
                    type="text"
                    name="titulo"
                    placeholder='Digite o título'
                    onChange={(e) => setTitulo(e.target.value)}
                />
            </div>
            <div id='imagem-criar-post'>
                <label htmlFor="imagem">Imagem:</label>
                <input
                    type="text"
                    name="linkImagem"
                    placeholder='Cole a URL da imagem'
                    onChange={(e) => setImagem(e.target.value)}
                />
            </div>
            <div id='conteudo-criar-post'>
                <label htmlFor="conteudo">Conteúdo:</label>
                <textarea
                    type="textarea"
                    name="conteudo"
                    placeholder='Digite o conteúdo da postagem'
                    onChange={(e) => setConteudo(e.target.value)}
                />
            </div>
            <button type="submit">Criar post</button>
        </form>
    )
}