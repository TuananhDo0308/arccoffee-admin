
const authUrl = 'https://9c90-113-161-72-138.ngrok-free.app';

const apiLinks = {
  admin: {
    signin: `${authUrl}/api/authentication/login`,
    updateAdmin: `${authUrl}/api/arc-shop/profile/`,
    getAdmin: `${authUrl}/api/arc-shop/profile`,
    region: `${authUrl}/api/regions`,
  },
  bill: {
    getPendingBills: `${authUrl}/api/bills/pending-bills`,
    getCompletedBills: `${authUrl}/api/bills/completed-bills`,
    updateStatusBills: `${authUrl}/api/bills`,
  },
  category: {
    addCategory: `${authUrl}/api/categories/new-category`,
    getCategory: `${authUrl}/api/categories`,
    deleteCategory: `${authUrl}/api/categories`,
    editCategory: `${authUrl}/api/categories`,
  },
  product: {
    addProduct: `${authUrl}/api/products/new-product`,
    getProductAll: `${ authUrl }/api/products`,
    getProductAvailable: `${authUrl}/api/products/available`,
    getProductHidden: `${authUrl}/api/products/hidden`,
    updateProductStatus: `${authUrl}/api/products`,
    editProduct: `${authUrl}/api/products`,
    deleteProduct: `${authUrl}/api/products`,
  }
};

export default apiLinks;
