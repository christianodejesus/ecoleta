export interface IApiReturnData {
  message?: string;
  fields?: {};
  error?: {
    message: string;
  }
}

export interface IItem {
  id: number;
  title: string;
  image: string;
}

export interface IUf {
  id: number;
  sigla: string;
  nome: string;
}

export interface ICity {
  id: number;
  nome: string;
}

export interface IMapPosition {
  lat: number;
  lng: number;
}

export interface IPointFormData {
  name?: string;
  email?: string;
  whatsapp?: string;
  lat: number;
  lng: number;
  city?: string;
  uf?: string;
  items: number[]
}
