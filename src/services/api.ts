import axios from "axios";

const API_URL = "https://stoplight.io/mocks/kode-frontend-team/koder-stoplight/86566464/";

export const fetchUsers = async () => {
    
        try {
          const response = await axios.get(`${API_URL}/users?__example=all`);
          return response.data;
        } catch (error) {
          console.error("Ошибка при получении пользователей:", error);
          throw error;
        }
      
};
const CACHE_KEY = "users_cache";
const CACHE_TIME = 5 * 60 * 1000; // 5 минут в миллисекундах

export const getCachedUsers = () => {
  const cachedData = localStorage.getItem(CACHE_KEY);
  console.log("Извлекаем кэш:", cachedData);
  if (!cachedData) return null;

  const { timestamp, users } = JSON.parse(cachedData);
  const isFresh = Date.now() - timestamp < CACHE_TIME;

  return isFresh && Array.isArray(users) ? users : null;
};

export const setCachedUsers = (users: any) => {
    console.log("Сохраняем в кэш:", users);
    const cacheData = {
    timestamp: Date.now(),
    users,
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  
};