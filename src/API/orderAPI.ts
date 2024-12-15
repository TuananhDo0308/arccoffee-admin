import axios from 'axios';
import API_URL from './LinkAPI';

//Product
export const getProcessingOrder = async () => {
    const response = await axios.post(`${API_URL}/admin/order/getProcessingOrders`);
    console.log("okkkkkkkkk")
    return response.data;
};
export const addNewProduct = async (itemdata: FormData) => {
    const response = await axios.post(`${API_URL}/admin/product/addNewProduct`, itemdata, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getOrderDetail = async (Id: string) => {
    const response = await axios.post(`${API_URL}/admin/order/getOrderDetail`,{
        orderId: Id
    });
    console.log(response.data)
    return response.data;
};
export const completeOrder = async (Id: string) => {
    const response = await axios.put(`${API_URL}/admin/order/completeOrder`,{
        orderId: Id
    });
    console.log(response.data)
    return response.data;
};

export const getCompletedOrders = async () => {
    const response = await axios.post(`${API_URL}/admin/order/getCompletedOrders`);
    return response.data;
};

export const getImport = async () => {
    const response = await axios.post(`${API_URL}/admin/import/allImport`);
    return response.data;
};
export const importDetail = async (Id: string) => {
    const response = await axios.post(`${API_URL}/admin/import/importDetail`,{
        importId: Id
    });
    console.log(response.data)
    return response.data;
};