const clientUrl = 'http://localhost:3000';

const clientLinks = {
  user: {
    signin:`${clientUrl}/api/user/login`,
    region: `${clientUrl}/api/user/regions`
  },
  homepage: {
    menu: `${clientUrl}/api/menu`,
    product: `${clientUrl}/api/products`,
    category: `${clientUrl}/api/category`
    
  },
  admin: {
    signin: `${clientUrl}/api/admin/loginAdmin`,
    updateAdmin: `${clientUrl}/api/admin/updateAdmin`,
    getAdmin: `${clientUrl}/api/admin/getAdmin`,
    region: `${clientUrl}/api/user/regions`,
  }
};

export default clientLinks;
