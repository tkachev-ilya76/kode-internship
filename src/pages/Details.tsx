import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchUsers } from "../services/api";
import { User } from "../types";
import back from '../assets/arrow_back.svg';
import star from '../assets/star.svg';
import call from '../assets/call.svg';
import dep from '../assets/case.svg';
import { getCachedUsers } from "../services/api";
import goose from '../assets/goose.svg';

function Details(){
    const {id} = useParams();      
    const navigate = useNavigate(); 
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    
    
    
const TitleContainer = styled.div`
    display: flex;
    flex-flow: column;
    background-color:rgb(243, 243, 243);
    width: 100%;
    font-family: 'Arial Black', sans-serif;
    color: black;
    
`;
const Description = styled.p`
    text-align: left;

`;
const DescriptionContainer = styled.div`
    background-color: #ffffff;
    width: 100%;  
    font-family: 'Arial Black', sans-serif;
    color: black;
`;

const BackButton = styled.img`
  width: 30px;
  height: 30px;
  margin: 20px;
  justify-self: left;
  padding: 10px;
  border: none;
  
  color: white;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background:#a5a5a5;
  }

`;

const Avatar = styled.img`
  width: 240px;
  height: 240px;
  border-radius: 50%;
  margin-bottom: 10px;
  justify-self: center;
  align-self: center;
  background-color: white;
`;

const PhoneLink = styled.a`
  display: block;
  margin-top: 10px;
  margin-left: 10px;
  color: #007bff;
  text-decoration: none;
  text-align: left;
  &:hover {
    text-decoration: underline;
  }
`;

  useEffect(() => {
    const loadUsers = async () => {
        const cachedUsers = getCachedUsers();
                if (cachedUsers) {
                    const user = cachedUsers.find((u:User) => u.id === id);
                    setUser(user);
                    setLoading(false);
                    return;
                }
        try {
            const usersData = await fetchUsers();
            const user = usersData.items.find((u:User) => u.id === id);
            if (user)
            {
                setUser(user);
            }
            else
            {
                setError(true);
            }
        }
        catch
        {
            setError(true);
        }
        finally
        {
            setLoading(false);
        }
    }
    loadUsers();
    
  }, [id]);

  if (loading) return (
    <div>
        <TitleContainer>
            <BackButton src={back} onClick={() => navigate(-1)}/>
            <Avatar src={goose} alt={''} />
            <h2 style={{margin: '10px'}}>Загрузка...</h2>
            <h3 style={{margin: '10px', color:'#414141'}}>должность</h3>
        </TitleContainer>
      <DescriptionContainer>
        <div style={{marginLeft: '20px'}}>
            <div style ={{display: 'flex', flexFlow: 'row'}}>
                <img src={dep} alt=""/>
                <p style={{textAlign:'left', marginLeft: '10px'}}>Отдел</p>
            </div>
            <div style={{display: 'flex', flexFlow: 'row'}}>
                <img src={star} alt=""/>
                <p style={{textAlign: 'left', marginLeft: '10px'}}>Дата рождения</p>
            </div>
            <div style={{display: 'flex', flexFlow: 'row'}}>
                <img src={call} alt=""/>                
            </div>
        </div>
        
        
      </DescriptionContainer>
      
    </div>
  );
  if (error || !user) return (
  <div>
        <TitleContainer>
            <BackButton src={back} onClick={() => navigate('/')}/>            
        </TitleContainer>
            <h1 style={{textAlign: 'center', marginTop: '10%', fontSize: '5em'}}>🛸</h1>
            <h2 style={{textAlign: 'center'}}>Какой-то сверхразум все поломал</h2>
            <p style={{textAlign: 'center', color: 'gray'}}>Постараемся быстро починить</p>
    </div>)

  return (
    <div>
        <TitleContainer>
            <BackButton src={back} onClick={() => navigate(-1)}/>
            <Avatar src={goose} alt={''} />
            <h2 style={{margin: '10px'}}>{user.firstName} {user.lastName}</h2>
            <h3 style={{margin: '10px', color:'#414141'}}>{user.position}</h3>
        </TitleContainer>
      <DescriptionContainer>
        <div style={{marginLeft: '20px'}}>
            <div style ={{display: 'flex', flexFlow: 'row'}}>
                <img src={dep} alt=""/>
                <p style={{textAlign:'left', marginLeft: '10px'}}>Отдел: {user.department}</p>
            </div>
            <div style={{display: 'flex', flexFlow: 'row'}}>
                <img src={star} alt=""/>
                <p style={{textAlign: 'left', marginLeft: '10px'}}>Дата рождения: {user.birthday}</p>
            </div>
            <div style={{display: 'flex', flexFlow: 'row'}}>
                <img src={call} alt=""/>
                <PhoneLink href={`tel:${user.phone}`}>{user.phone}</PhoneLink>
            </div>
        </div>
        
        
      </DescriptionContainer>
      
    </div>
      
   
  );

}

export default Details;