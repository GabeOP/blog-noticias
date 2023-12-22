import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PostCard } from "../../components/PostCard/PostCard";
import API from "../../axios/config";
import "./Home.css";

export function Home() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const { pageNumber } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
        },
      };

      try {
        const response = await API.get(`/post?page=${pageNumber || 0}&size=5`, config);
        setData(response.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [pageNumber]);

  const handleShowMore = () => {
    const nextPage = parseInt(pageNumber || 0) + 1;
    navigate(`/page/${nextPage}`);
  };

  return (
    <div id="wrap-home">
      <div id="container-lista-post">
        {data.map((item) => (
          <PostCard
            key={item.id}
            id={item.id}
            titulo={item.titulo}
            conteudo={item.conteudo}
            autor={item.autor.nome}
            imagem={item.linkImagem}
          />
        ))}

        {data.length > 4 && (
          <button id="btnProxPag" onClick={handleShowMore}>Próxima página</button>
        )}
      </div>

      <div id="container-home-infos"></div>
    </div>
  );
}
