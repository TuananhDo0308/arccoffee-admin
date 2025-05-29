
const authUrl = 'http://dotnet.aaateammm.online';

const apiLinks = {
  admin: {
    signin: `${authUrl}/api/authentication/login`,
    updateAdmin: `${authUrl}/api/arc-shop/profile/`,
    getAdmin: `${authUrl}/api/arc`,
    region: `${authUrl}/api/regions`,
  },
  bill: {
    getPendingBills: `${authUrl}/api/bills?status=Pending`,
    getCompletedBills: `${authUrl}/api/bills?status=Completed`,
    updateStatusBills: (id: string) =>  `${authUrl}/api/bills?id=${id}`,
  },
  category: {
    addCategory: `${authUrl}/api/categories`,
    getCategory: `${authUrl}/api/categories`,
    deleteCategory: `${authUrl}/api/categories`,
    editCategory: `${authUrl}/api/categories`,
  },
  product: {
    addProduct: `${authUrl}/api/products`,
    getProductAll: `${ authUrl }/api/products`,
    getProductAvailable: `${authUrl}/api/products/available`,
    getProductHidden: `${authUrl}/api/products/hidden`,
    updateProductStatus: `${authUrl}/api/products`,
    editProduct: `${authUrl}/api/products`,
    deleteProduct: `${authUrl}/api/products`,
  },
    voucher:{
    index: `${authUrl}/api/vouchers`,
  },
  branch:{
    index: `${authUrl}/api/branches`,
  },
  employee:{
    index: `${authUrl}/api/arc`,
    list: `${authUrl}/api/arc/staffs`,
  }
};

export default apiLinks;
