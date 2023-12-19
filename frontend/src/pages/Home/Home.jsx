import { useEffect, useState } from "react";
import { PostCard } from "../../components/PostCard/PostCard";
import API from "../../axios/config";

export function Home() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await API.get("/products");
                setData(response.data);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchData();
    }, []);

    return (
        <div id="container">
            {data.map((item) => (
                <PostCard
                    key={item.id}
                    titulo={item.title}
                    conteudo={item.description}
                    autor={item.category}
                    imagem={item.image}
                />
            ))}
        </div>
    );
};
