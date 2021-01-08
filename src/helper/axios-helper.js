import axios from 'axios';

if (!process.env.REACT_APP_ACCESS_TOKEN) {
  throw new Error('Please set Access token');
}

let buildClient = () => {
  return axios.create({
    baseURL: 'https://api.nylas.com/',
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`,
    },
  });
};

export default buildClient();

//wsnVJsDonuPTdO8IJdtlkBjo6FyDsp
