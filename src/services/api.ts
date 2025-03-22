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