import axios from 'axios';

const ibgeApi = axios.create({
  baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

export default ibgeApi;
