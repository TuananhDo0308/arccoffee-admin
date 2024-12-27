
const clientUrl = 'http://localhost:3000';

const clientLinks = {
  admin: {
    signin: `${clientUrl}/api/admin/loginAdmin`,
    updateAdmin: `${clientUrl}/api/admin/updateAdmin`,
    getAdmin: `${clientUrl}/api/admin/getAdmin`,
    region: `${clientUrl}/api/user/regions`,
  },
  bill: {
    getPendingBills: `${clientUrl}/api/bill/getPendingBills`,
    getCompletedBills: `${clientUrl}/api/bill/getCompletedBills`,
    updateStatusBills: (id: string) => `${clientUrl}/api/bill/updateStatusBills/${id}`,
  },
  category: {
    addCategory: `${clientUrl}/api/category/addCategory`,
    getCategory: `${clientUrl}/api/category/getCategory`,
    deleteCategory: (id: string) => `${clientUrl}/api/category/deleteCategory/${id}`,
    editCategory: (id: string) => `${clientUrl}/api/category/editCategory/${id}`,
  },
  product: {
    addProduct: `${clientUrl}/api/products/addProducts`,
    getProductAll: `${clientUrl}/api/products/getProductAll`,
    getProductAvailable: `${clientUrl}/api/products/getProductAvailable`,
    getProductHidden: `${clientUrl}/api/products/getProductHidden`,
    updateProductStatus: (id: string) => `${clientUrl}/api/products/updateProductStatus/${id}`,
    editProduct: (id: string) => `${clientUrl}/api/products/editProduct/${id}`,
    deleteProduct: (id: string) => `${clientUrl}/api/products/deleteProduct/${id}`,
  }
};

export default clientLinks;
