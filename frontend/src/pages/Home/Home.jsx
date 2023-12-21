import { useEffect, useState } from "react";
import { PostCard } from "../../components/PostCard/PostCard";
import API from "../../axios/config";
import "./Home.css"

export function Home() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {

            const config = {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
                },
              };

            try {
                const response = await API.get("/post", config);
                setData(response.data);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchData();
    }, []);

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
            </div>

            <div id="container-home-infos">
                
            </div>
        </div>
    );
};
