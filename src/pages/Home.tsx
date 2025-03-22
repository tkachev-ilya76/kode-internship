import { useEffect, useState } from "react";
import { fetchUsers } from "../services/api";
import { User } from '../types';
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  margin-left: 20px;
  text-align: left;
  font-family: 'Arial Black', sans-serif;
  color: black;
`;
const Header = styled.h1`
  font-weight: 500;
  margin-left: 20px;

`;


const UserList = styled.ul`
    display: block;
    width: 100%;
    list-style: none;
    padding: 0;

`;

const UserItem = styled.li`
    width: 100%;  
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    
  
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
`;

const UserInfo = styled.div`
  text-align: left;
`;

const ErrorMessage = styled.p`
  color: red;
  font-weight: bold;
`;

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
    if (error) return (<ErrorMessage>Ошибка загрузки</ErrorMessage>);

    return (
    
    //api.lorem.space из ссылки на аватар заменен на robohash, т.к. api.lorem.space не отвечает на запросы. 
    
    <Container>  
               
        <Header>Поиск</Header>
        <UserList>
            {users.map((user) => (
            <UserItem key={user.id}>
                <Avatar src={`https://robohash.org/${user.firstName}`} alt={user.firstName} width={50} />
                <UserInfo>
                    <p>{user.firstName} {user.lastName}</p>
                    <p style={{color: 'gray'}}>{user.position}</p>
                </UserInfo>
                
            </UserItem>
            ))}
        </UserList>
    </Container>
    )
}

export default Home;