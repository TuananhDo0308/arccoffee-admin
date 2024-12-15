import axios from 'axios';
import API_URL from './LinkAPI';

//Product
export const getProducts = async () => {
    const response = await axios.post(`${API_URL}/product`);
    return response.data;
};
export const getProductsBySupplier = async (supplierId:string) => {
    const response = await axios.post(`${API_URL}/product/bySupplier`,{
        supplierId: supplierId
    });
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

export const deleteProduct = async (productId:any) => {
    console.log(productId);
    const response = await axios.put(`${API_URL}/admin/product/removeProduct`,productId);
    return response.data;
};

export const updateProduct = async (product: FormData) => {
    console.log(product);
    const response = await axios.put(`${API_URL}/admin/product/updateProduct`, product, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

//Category
export const getCategories = async () => {
    const response = await axios.post(`${API_URL}/category`);
    console.log(response.data)
    return response.data;
};

export const addNewCategory = async (name: string) => {
    const response = await axios.post(`${API_URL}/admin/category/addNewCategory`,{
        name: name
    });
    console.log(response.data)
    return response.data;
};

export const updateCategory = async (categoryId: string, newName: string) => {
    const response = await axios.put(`${API_URL}/admin/category/updateCategory`, {
        id: categoryId,
        name: newName,
    });
    console.log(response.data);
    return response.data;
};

export const removeCategory = async (categoryId: string) => {
    const response = await axios.put(`${API_URL}/admin/category/removeCategory`, {
        id: categoryId,
    });
    console.log(response.data);
    return response.data;
};

//Supplier
export const getSupplier = async () => {
    const response = await axios.post(`${API_URL}/admin/supplier/getSupplier`);
    console.log("ok:",response.data)
    return response.data;
};

export const addNewSupplier = async ( name:any, address:any, phoneNumber:any) => {
    const response = await axios.post(`${API_URL}/admin/supplier/addNewSupplier`, {
        phoneNumber:phoneNumber,
        address: address,
        name: name,
    });
    return response.data;
};

interface Product {
    productId: string;
    quantity: number;
  }
export const newImport = async ( supplierId:string, totalPrice:any, products: Product[]) => {
    const response = await axios.post(`${API_URL}/admin/import/newImport`, {
        supplierId:supplierId, 
        totalPrice:totalPrice, 
        products:products
    });
    return response.data;
};

export const updateSupplier = async (supplierId: string, newName: string, address:string, phone:string) => {
    const response = await axios.put(`${API_URL}/admin/supplier/updateSupplier`, {
        id: supplierId,
        newName: newName,
        address:address,
        phoneNumber:phone,
    });
    console.log(response.data);
    return response.data;
};

export const removeSupplier = async (supplierId: string) => {
    const response = await axios.put(`${API_URL}/admin/supplier/removeSupplier`, {
        id: supplierId,
    });
    console.log(response.data);
    return response.data;
};


export const getRevenueProducts = async (categoryId: string, year: string, month: string) => {
    const response = await axios.post(`${API_URL}/admin/revenue/getRevenueProducts`, {
        categoryId: categoryId,
        year: year,
        month: month ,
    });
    console.log(response.data);
    return response.data;
};

export const getRevenueCategories = async (year: string, month: string) => {
    const response = await axios.post(`${API_URL}/admin/revenue/getRevenueCategories`, {
        year: year,
        month: month ,
    });
    console.log(response.data);
    return response.data;
};