import { useEffect, useState } from "react";
import { fetchUsers } from "../services/api";
import { User } from '../types';


function Home () {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const loadUsers = async () => {
          try {
            const users = await fetchUsers();
            
            setUsers(users.items);
            console.log("Список пользователей:", users);
            
          } catch (error) {
            console.error("Ошибка загрузки данных");
            setError(true);
          }
          finally{
            setLoading(false);
          }
        };
    
        loadUsers();
    }, []);
    
    if (loading) return (<h1>Загрузка...</h1>);
    if (error) return (<h1>Ошибка загрузки</h1>);

    return (
    
    //api.lorem.space из ссылки на аватар заменен на robohash, т.к. api.lorem.space не отвечает на запросы. 
    
    <div>  
        <h1>Главная</h1>
        
        <h1>Список пользователей</h1>
        <ul>
            {users.map((user) => (
            <li key={user.id}>
                <img src={`https://robohash.org/${user.firstName}`} alt={user.firstName} width={50} />
                
                <p>{user.firstName}</p>
                <p>{user.department}</p>
            </li>
            ))}
        </ul>
    </div>
    )
}

export default Home;