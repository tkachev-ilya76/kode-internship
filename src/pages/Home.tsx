import { useEffect } from "react";
import { fetchUsers } from "../services/api";

function Home () {
    useEffect(() => {
        const loadUsers = async () => {
          try {
            const users = await fetchUsers();
            console.log("Список пользователей:", users);
            
          } catch (error) {
            console.error("Ошибка загрузки данных");
          }
        };
    
        loadUsers();
    }, []);
    
    return (
        <h1>Главная</h1>
    )
}

export default Home;