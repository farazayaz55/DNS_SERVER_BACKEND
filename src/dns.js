const userDatabase = [
    {
      email: 'farazayaz55@gmail.com',
      ip: '127.0.0.1',
      location: 'india',
      vpnInstance: null,
    },
    {
      email: 'farazayaz55@gmail.com',
      ip: '192.168.1.2',
      location: 'saudiarabia',
      vpnInstance: null,
    },
  ];
const getUserByIP=(ip)=> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(ip)
      const user = Object.values(userDatabase).find((u) => u.ip === ip);
      if (user) {
        resolve(user);
      } else {
        reject(new Error('User not found'));
      }
    }, 0);
  });
}

const getIpForLocation = (location) => {
  const data = {
    saudiarabia: '38.54.38.116',
    india: '181.214.10.147',
  };
  return data[location];
};


module.exports={
    getUserByIP,
    getIpForLocation,
}