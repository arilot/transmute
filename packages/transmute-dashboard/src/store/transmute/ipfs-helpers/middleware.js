import axios from 'axios';

const ENVS = {
  LOCAL: 'http://localhost:5001',
  TEST: 'https://ipfs.transmute.minikube:30382',
  PROD: 'https://ipfs.infura.io:5001'
};

export const getIpfsId = async () => {
  return axios
    .create({
      baseURL: ENVS.LOCAL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
    .get(`/api/v0/id`);
};
