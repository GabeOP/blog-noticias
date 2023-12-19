import { useEffect, useState } from "react";
import { PostCard } from "../PostCard/PostCard";

export const PostList = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://fakestoreapi.com/products');

                const result = await response.json();
                setData(result);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            {data.map((item) => (

                <PostCard key={item.id} titulo={item.title} conteudo={item.decription} autor={item.category} imagem={item.image} />

            ))}
        </>
    )
}