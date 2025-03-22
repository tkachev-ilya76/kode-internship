import { useEffect, useState } from "react";
import { fetchUsers } from "../services/api";
import { User } from '../types';
import styled from "styled-components";


const Container = styled.div`
  width: auto;
  margin-left: 20px;
  margin-right: 20px;
  text-align: left;
  font-family: 'Arial Black', sans-serif;
  color: black;
  
`;
const FilterContainer = styled.div`
  width: 100%;
  
  display: flex;
  flex-flow: row;
  border-bottom: 1px solid rgba(148, 148, 148, 0.55);
  
`;
const FilterButton = styled.button<{ active: boolean }>`
    margin: 0 0px;
    background-color: white;
    color: ${(props) => (props.active ? "black" : "gray")};
    border-radius: 2%;
    border-bottom: ${(props) => (props.active ? "3px solid #6534FF" : "3px solid transparent")};
    border-top: 0;
    border-left: 0;
    border-right: 0;
    font-weight: ${(props) => (props.active ? "bold" : "normal")};
    transition: border-color 0.3s, font-weight 0.3s;
    &:hover {
        border-top: 0;
        border-left: 0;
        border-right: 0;
        border-bottom: 3px solid #6534FF;
    }
    &:focus {
        outline: none;
    }
`;
const SearchInput = styled.input`
    width: 100%;
    box-sizing:border-box;
    
    padding: 10px;
    border-radius: 8px;
    border: 0px solid #ddd;
    background: #f5f5f5;
    outline: none;
    font-size: 1em;
    font-family: 'Arial Black', sans-serif;
    margin-bottom: 10px;
`;
const Header = styled.h1`
  font-weight: 500;
  
  margin-bottom: 10px;
  font-size: 2em;
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

const departmentMap: Record<string, string> = {
    all: "Все",
    android: "Android",
    ios: "iOS",
    design: "Дизайн",
    management: "Менеджмент",
    qa: "QA",
    back_office: "Бэк-офис",
    frontend: "Frontend",
    hr: "HR",
    pr: "PR",
    backend: "Backend",
    support: "Техподдержка",
    analytics: "Аналитика",
  };

function Home () {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [department, setDepartment] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

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

    const filteredByDepartment = (department === "all"
    ? users
    : users.filter(user => user.department === department));

    const filteredUsers = filteredByDepartment.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.userTag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return (
    
    //api.lorem.space из ссылки на аватар заменен на robohash, т.к. api.lorem.space не отвечает на запросы. 
    
    <Container>  
               
        <Header>Поиск</Header>
        <SearchInput
        type="text"
        placeholder="Поиск по имени, фамилии или никнейму"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FilterContainer>
            {Object.entries(departmentMap).map(([key, name]) => (
            <FilterButton
                key={key}
                active={department === key}
                onClick={() => setDepartment(key)}
            >
                {name}
            </FilterButton>
            ))}
        </FilterContainer>
        <UserList>
            {filteredUsers.map((user) => (
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