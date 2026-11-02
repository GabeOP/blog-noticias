import API from '../../axios/config';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './DetalhesPost.css';

export function DetalhesPost() {
  const { user, hasPermission } = useAuth();

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [comentario, setComentario] = useState('');

  // Obtém a string de consulta da URL
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const postagem_id = params.get('id');

  const fetchPost = async () => {
    try {
      const response = await API.get(`/post/${postagem_id}`);
      setData(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postagem_id]);

  const handleComentSubmit = async (e) => {
    e.preventDefault();
    if (!comentario.trim()) return;

    const postData = {
      postagem_id: {
        id: postagem_id,
      },
      autorComentario: {
        id: user?.id,
      },
      comentario: comentario,
    };

    try {
      await API.post("/comentario", postData);
      setComentario('');
      fetchPost();
    } catch (err) {
      alert("Erro ao enviar comentário ou sessão expirada.");
    }
  };

  const deletarComentario = async (comentarioId) => {
    try {
      const res = await API.delete(`/comentario/${comentarioId}`);
      alert(res.data);
      fetchPost();
    } catch (err) {
      console.error('Erro ao deletar comentário', err);
      alert("Você não tem permissão para excluir este comentário.");
    }
  };

  const dataHora = (data.dataPostagem || "").split("T");
  const dataSplit = (dataHora[0] || "").split("-");
  const horaSplit = (dataHora[1] || "").split(".")[0];
  const horario = (horaSplit || "").split(":")[0];
  const minuto = (horaSplit || "").split(":")[1];

  return (
    <div id='container-detalhes-post'>
      <div id='wrap-detalhes-post'>
        <div id="divTitulo-detalhes-post">
          <h1 id='titulo-detalhes-post'>{data.titulo}</h1>
          <div id='infos-detalhes-post'>
            <p id='autor-detalhes-post'>Por <span>{data.autor && data.autor.nome}</span></p>
            <p>{dataSplit[2]}/{dataSplit[1]}/{dataSplit[0]} {horario}h{minuto}</p>
          </div>
        </div>
        <div id="divMain-detalhes-post">
          <img id='imagem-detalhes-post' src={data.linkImagem} alt="" />
          <p id='conteudo-detalhes-post'>{data.conteudo}</p>
        </div>
      </div>

      <div id="wrap-comentarios">
        <form onSubmit={handleComentSubmit}>
          <textarea
            id='boxComentario'
            placeholder='Escreva o seu comentário...'
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
          <button type="submit" id='btnComentar'>Comentar</button>
        </form>

        <h2>Comentários</h2>
        {data.comentarioList && data.comentarioList.length > 0 && (
          <div id="listaComentario">
            {data.comentarioList.map((item, index) => {
              const cDataHora = (item.dataComentario || "").split("T");
              const cDataSplit = (cDataHora[0] || "").split("-");
              const cHoraSplit = (cDataHora[1] || "").split(".")[0];
              const cHorario = (cHoraSplit || "").split(":")[0];
              const cMinuto = (cHoraSplit || "").split(":")[1];

              const podeExcluir =
                user && (item.autorComentario?.id === user?.id || hasPermission('COMMENT_DELETE'));

              return (
                <div key={item.id || index} id='wrapComentario'>
                  <div id='infosComentario'>
                    <p id="autorComentario">{item.autorComentario?.nome}</p>
                    <div id='dataComentario'>
                      <p>{cDataSplit[2]}/{cDataSplit[1]}/{cDataSplit[0]}</p>
                      <p>{cHorario}h{cMinuto}</p>
                    </div>
                  </div>
                  <p id="textoComentario">{item.comentario}</p>
                  <div id='wrapOpcoesComentario'>
                    {podeExcluir && (
                      <button id='btnDeletarComentario' onClick={() => deletarComentario(item.id)}>
                        Deletar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
