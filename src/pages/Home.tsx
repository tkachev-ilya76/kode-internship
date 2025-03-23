import { useEffect, useState } from "react";
import { fetchUsers } from "../services/api";
import { User, UserWithNextBirthday } from '../types';
import styled, { ThemeProvider } from "styled-components";
import searchIcon from '../assets/search.svg';
import sortIcon from '../assets/sort.svg';
import radioOff from '../assets/radio_button_unchecked.svg';
import radioOn from '../assets/radio_button_checked.svg';
import close from '../assets/cancel.svg';
import goose from '../assets/goose.svg';

import { useNavigate } from "react-router-dom";
import { getCachedUsers } from "../services/api";
import { setCachedUsers } from "../services/api";


const Container = styled.div`
  width: auto;
  margin-left: 20px;
  margin-right: 20px;
  text-align: left;
  font-family: 'Arial Black', sans-serif;
  color: black;
  overflow-x: hidden;
  overscroll-behavior-x: contain;
`;
const FilterContainer = styled.div`
  width: 100%;
  
  display: flex;
  flex-flow: row;
  border-bottom: 1px solid rgba(148, 148, 148, 0.55);
  overflow-x: auto;
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
    font-size: 0.9em;
    padding-right: 10px;
    padding-left: 10px;
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
const SearchContainer = styled.div`
    width: auto;
    border-radius: 10px;
    border: 0px solid #ddd;
    background: #f5f5f5;
    display: flex;
    flex-flow: row;
    align-items: center;
    padding: 10px;
    
`;
const OfflineContainer = styled.div`
    transform: translate(0px,0);
    background-color: #ff4141;
    margin: 0;
    padding: 20px;
    width: 100vw;
`;
const ReloadingContainer = styled.div`
    transform: translate(0px,0);
    background-color: #6534FF;
    margin: 0;
    padding: 20px;
    width: 100vw;
`;
const SearchInput = styled.input`
        
    flex-grow: 8;  
    padding: 0px;
    outline: none;
    font-size: 1em;
    font-family: 'Arial Black', sans-serif;
    background: #f5f5f5;
    outline: none;
    border: 0px solid #ddd;
`;
const SearchIcon = styled.img`
    width: 30px;
    height: 30px;
    margin-right:10px`
;
const SortIcon = styled.img`
    width: 30px;
    height: 30px;
    justify-self: right;`
;
const PopupWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 5px 30px;
  border-radius: 25px;
  z-index: 1001; 
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5); 
  z-index: 1000; 
`;
const SortOptionContainer = styled.div`
    display: flex;
    flex-flow: row;
    cursor: pointer;
`;
const Header = styled.h1`
  font-weight: 500;
  
  margin-bottom: 15px;
  font-size: 2em;
  
`;
const HeaderOffline = styled.h1`
  font-weight: 500;
  color:white;
  margin-bottom: 15px;
  margin-right:20px;
  font-size: 2em;
  font-family: 'Arial Black', sans-serif;
`;
const YearHeader = styled.h2`
  margin-top: 20px;
  font-size: 18px;
  color: #007bff;
  border-bottom: 2px solid #ddd;
  padding-bottom: 5px;
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
    border-radius: 20px;
    &:hover{
        background-color: #e2daf8;
    }
    transition: background-color 0.3s;
  
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
`;
const EmptyAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  color: gray;
  background-color: gray;
  margin-right: 20px;
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
    const [users, setUsers] = useState<UserWithNextBirthday[]>([]);
    const [loading, setLoading] = useState(true);
    const [reloading, setReloading] = useState(false);
    const [error, setError] = useState(false);
    const [department, setDepartment] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [popUp, setPopUp] = useState(false);
    const [sortType, setSortType] = useState('alphabet');
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const navigate = useNavigate();

    const calculateNextBirthday = (user: User): UserWithNextBirthday => {
        const today = new Date();
        const birthDate = new Date(user.birthday);
        let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
      
        
        if (nextBirthday < today) {
          nextBirthday.setFullYear(today.getFullYear() + 1);
        }
      
        return { ...user, nextBirthday };
    };


    useEffect(() => {
        

        const loadUsers = async () => {
            if (!reloading)
            {
                const cachedUsers = getCachedUsers();                

                if (cachedUsers) {
                    
                    const usersWithNextBirthDay = cachedUsers.map(calculateNextBirthday);
                    setUsers(usersWithNextBirthDay);
                    setLoading(false);
                    console.log(reloading);
                    console.log('cached');
                    return;
                }       
            }
                
            
            try {
                const users = await fetchUsers();
                console.log('запрос...');
                setCachedUsers(users.items);
                const usersWithNextBirthDay = users.items.map(calculateNextBirthday);
                setUsers(usersWithNextBirthDay);
                
                console.log("Список пользователей:", users);
                
            } catch (error) {
                console.error("Ошибка загрузки данных");
                setError(true);
            }
            finally{
                setLoading(false);
                setReloading(false);
            }
        };
        const handleOnline = () => {console.log('online');setIsOnline(true); loadUsers(); setReloading(true);};
        const handleOffline = () => {console.log('offline');setIsOnline(false)};

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        
        const checkConnection = () => setIsOnline(navigator.onLine);

        const interval = setInterval(checkConnection, 3000);

        loadUsers();
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
            clearInterval(interval);
        };
    }, [reloading]);
    
    if (loading) return (
        <Container>  
           
        <div>
            <Header className={isOnline?'':'offline'}>Поиск</Header>
            <SearchContainer className={isOnline?'':'offline'}>
                <SearchIcon src={searchIcon} alt=""/>
                <SearchInput
                type="text"
                placeholder="Поиск по имени, фамилии или никнейму"
                value={searchQuery}
                
                />
                <SortIcon   src={sortIcon} 
                            alt=""
                            onClick={()=>{setPopUp(true); console.log('click')}}
                        />
            </SearchContainer>
        </div>                       
        
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
        <div style={{display: 'flex', flexFlow: 'row', marginTop: 20}}>
                    <EmptyAvatar/>
                    <div>
                        <div style={{borderRadius: '15px', backgroundColor: 'gray', width: 200, height: 30, marginBottom: 5}}></div>
                        <div style={{borderRadius: '15px', backgroundColor: 'gray', width: 100, height: 30}}></div>
                    </div>
                    
        </div>
        <div style={{display: 'flex', flexFlow: 'row', marginTop: 20}}>
                    <EmptyAvatar/>
                    <div>
                        <div style={{borderRadius: '15px', backgroundColor: 'gray', width: 200, height: 30, marginBottom: 5}}></div>
                        <div style={{borderRadius: '15px', backgroundColor: 'gray', width: 100, height: 30}}></div>
                    </div>
                    
        </div>
        <div style={{display: 'flex', flexFlow: 'row', marginTop: 20}}>
                    <EmptyAvatar/>
                    <div>
                        <div style={{borderRadius: '15px', backgroundColor: 'gray', width: 200, height: 30, marginBottom: 5}}></div>
                        <div style={{borderRadius: '15px', backgroundColor: 'gray', width: 100, height: 30}}></div>
                    </div>
                    
        </div>
    </Container>
);
    if (error) return (
        
        <Container>  
           
            <div>
                <Header className={isOnline?'':'offline'}>Поиск</Header>
                <SearchContainer className={isOnline?'':'offline'}>
                    <SearchIcon src={searchIcon} alt=""/>
                    <SearchInput
                    type="text"
                    placeholder="Поиск по имени, фамилии или никнейму"
                    value={searchQuery}
                    
                    />
                    <SortIcon   src={sortIcon} 
                                alt=""
                                onClick={()=>{setPopUp(true); console.log('click')}}
                            />
                </SearchContainer>
            </div>                       
            
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
            <div>
                <h1 style={{textAlign: 'center', marginTop: '10%', fontSize: '5em'}}>🛸</h1>
                <h2 style={{textAlign: 'center'}}>Какой-то сверхразум все поломал</h2>
                <p style={{textAlign: 'center', color: 'gray'}}>Постараемся быстро починить</p>
            </div>
            
            
        </Container>
    

);

    const filteredByDepartment = (department === "all"
    ? users
    : users.filter(user => user.department === department));

    const filteredUsers = filteredByDepartment.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.userTag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const sortByBirthday = (users: UserWithNextBirthday[]) => {
        const today = new Date();
        const currentYear = today.getFullYear();
      
        const sortedUsers = [...users].sort((a: any, b: any) => a.nextBirthday - b.nextBirthday);

        return sortedUsers;
          
    };

    const groupByYear = (users: UserWithNextBirthday[]) => {
        const grouped = new Map();      
        users.forEach((user) => {
          const year = user.nextBirthday.getFullYear();
      
          if (!grouped.has(year)) {
            grouped.set(year, []);
          }
      
          grouped.get(year).push(user);
        });
      
        return grouped;
    };

    const sortedUsers = sortType === "alphabet" ?  [...filteredUsers].sort((a, b) => {return a.firstName.localeCompare(b.firstName)})
     : sortByBirthday(filteredUsers);  
    const groupedUsers = groupByYear(sortedUsers);
    


    return (
    
    //api.lorem.space из ссылки на аватар заменен на гуся, т.к. api.lorem.space не отвечает на запросы. 
    
        <Container>  
            {isOnline && !reloading && 
            <div>
                <Header className={isOnline?'':'offline'}>Поиск</Header>
                <SearchContainer className={isOnline?'':'offline'}>
                    <SearchIcon src={searchIcon} alt=""/>
                    <SearchInput
                    type="text"
                    placeholder="Поиск по имени, фамилии или никнейму"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <SortIcon   src={sortIcon} 
                                alt=""
                                onClick={()=>{setPopUp(true); console.log('click')}}
                            />
                </SearchContainer>
            </div>
            }
            {!isOnline &&
            <OfflineContainer>
                <HeaderOffline className={isOnline?'':'offline'}>Поиск</HeaderOffline>
                <p style={{color:'white'}}>Не могу обновить данные. Проверь соединение с интернетом</p>
            </OfflineContainer>
            }
            {reloading &&
            <ReloadingContainer>
                <HeaderOffline className={isOnline?'':'offline'}>Поиск</HeaderOffline>
                <p style={{color:'white'}}>Секундочку, гружусь...</p>
            </ReloadingContainer>
            }
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
                
                {
                (sortType == 'birthday' && groupedUsers.size > 0) ? (
                    [...groupedUsers.entries()].map(([year, users]) => (
                        <div key={year}>
                          <YearHeader>{year}</YearHeader>
                          {users.map((user : any) => (
                            
                            <UserItem key={user.id} onClick={() => navigate(`/user/${user.id}`)}>
                                <Avatar src={goose} alt={user.firstName} width={50} />
                                <UserInfo>
                                    <p>{user.firstName} {user.lastName}</p>
                                    <p style={{color: 'gray'}}>{user.position}</p>
                                    <p style={{color: 'gray'}}>{user.nextBirthday.toLocaleDateString()}</p>
                                </UserInfo>
                    
                            </UserItem>
                            
                        ))}
                        </div>
                    ))) : (sortedUsers.length > 0) ?
                (
                sortedUsers.map((user) => (
                <UserItem key={user.id} onClick={() => navigate(`/user/${user.id}`)}>
                    <Avatar src={goose} alt={user.firstName} width={50} />
                    <UserInfo>
                        <p>{user.firstName} {user.lastName}</p>
                        <p style={{color: 'gray'}}>{user.position}</p>
                    </UserInfo>
                    
                </UserItem>
                ))) : (
                        <div>
                            <h1 style={{textAlign: 'center', marginTop: '10%', fontSize: '5em'}}>🔍</h1>
                            <h2 style={{textAlign: 'center'}}>Мы никого не нашли</h2>
                            <p style={{textAlign: 'center', color: 'gray'}}>Попробуй скорректировать запрос</p>
                        </div>
                            
                )}

            </UserList>
            {popUp && (
                    <>
                        <Overlay onClick={() => setPopUp(false)} /> {/* Затемнение, клик = закрыть */}
                        <PopupWrapper>
                        <div style={{display: 'flex', flexFlow: 'row', flexGrow: 10, width: '100%', justifyContent: 'space-beetween'}}>                            
                            <h3 style = {{marginLeft: 'auto',marginRight: 'auto' ,justifySelf:"center"}}>Cортировка</h3>
                            <img src={close} style={{marginLeft: '20px', justifySelf: 'end', cursor: 'pointer'}} onClick={()=>{setPopUp(false)}}/>   
                        </div>
                           
                        <SortOptionContainer onClick={()=>setSortType('alphabet')}>                            
                                <img src={sortType==="alphabet" ? radioOn : radioOff}/>                                
                                <h3 style={{marginLeft: '10px'}}>По алфавиту</h3>                            
                        </SortOptionContainer>
                        <SortOptionContainer onClick={()=>setSortType('birthday')}>                            
                                <img src={sortType==="birthday" ? radioOn : radioOff}/>
                                <h3 style={{marginLeft: '10px'}}>По дню рождения</h3>                            
                        </SortOptionContainer>
                        </PopupWrapper>
                    </>
)}
        </Container>
    )
}

export default Home;