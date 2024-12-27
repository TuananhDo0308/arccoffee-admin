import axios from 'axios';
import API_URL from './LinkAPI';

export const loginAdmin = async (credentials: any) => {
    debugger
    console.log("Cre: ",credentials);
    const response = await axios.post(`${API_URL}/admin/signin`, credentials);
    return response.data;
};;

export const updateAdmin = async (admin: FormData) => {
    console.log(admin);
    const response = await axios.put(`${API_URL}/users/updateProfile`, admin, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
