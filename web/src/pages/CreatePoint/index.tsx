import httpStatus from 'http-status';
import { LeafletMouseEvent } from 'leaflet';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { Link, useHistory } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { IApiReturnData, ICity, IItem, IMapPosition, IPointFormData, IUf } from '../../interfaces';
import api from '../../services/api';
import ibgeApi from '../../services/ibge';
import './styles.css';

const CreatePoint = () => {
  const [mapInitialPosition, setInitialMapPosition] = useState<IMapPosition>({
    lat: 0,
    lng: 0
  })
  const [items, setItems] = useState<IItem[]>([])
  const [ufs, setUfs] = useState<IUf[]>([])
  const [cities, setCities] = useState<ICity[]>([])
  const [formData, setFormData] = useState<IPointFormData>({
    lat: 0, lng: 0, items: []
  })

  const history = useHistory();

  useEffect(() => {
    api.get('/items').then(response => {
      setItems(response.data);
    })
  }, []);

  useEffect(() => {
    ibgeApi.get('/estados?orderBy=nome').then(response => {
      setUfs(response.data);
    })
  }, []);

  useEffect(() => {
    if (formData.uf !== '0') {
      ibgeApi.get(`/estados/${formData.uf}/municipios?orderBy=nome`)
        .then(response => {
          setCities(response.data);
        })
    } else {
      setCities([]);
    }
  }, [formData.uf]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setInitialMapPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
    })
  }, []);

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    setFormData({ ...formData, uf: event.target.value });
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    setFormData({ ...formData, city: event.target.value });
  }

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng
    setFormData({ ...formData, lat, lng });
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  function handleSelectItem(id: number) {
    let newItems = formData.items || [];
    const existingIndex = formData.items?.indexOf(id);

    if (existingIndex === -1 || existingIndex === undefined) {
      newItems?.push(id);
    } else {
      newItems = newItems?.filter(item => item !== id);
    }

    setFormData({ ...formData, items: newItems });
  }

  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const resultHandler = {
      [httpStatus.OK]: (data: IApiReturnData) => {
        history.push('/success');
      },

      [httpStatus.BAD_REQUEST]: (data: IApiReturnData) => {
        alert(`${data.message} <br> ${JSON.stringify(data.fields)}`);
      },

      [httpStatus.INTERNAL_SERVER_ERROR]: (data: IApiReturnData) => {
        alert(`${data.message} <br> ${data.error?.message}`);
      }
    };

    try {
      const result = await api.post('/points', formData);
      resultHandler[result.status](result.data);
    } catch (err) {
      resultHandler[httpStatus.INTERNAL_SERVER_ERROR]({
        message: 'Erro ao tentar salvar',
        error: { message: err.message }
      });
    }
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleFormSubmit}>
        <h1>Cadastro do<br />Ponto de Coleta</h1>
        <fieldset>
          <legend><h2>Dados</h2></legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input type="text" name="name" id="name" onChange={handleInputChange} />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input type="email" name="email" id="email" onChange={handleInputChange} />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">WhatsApp</label>
              <input type="number" name="whatsapp" id="whatsapp" onChange={handleInputChange} />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={[mapInitialPosition.lat, mapInitialPosition.lng]} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[formData.lat, formData.lng]} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="state">UF</label>
              <select onChange={handleSelectUf} name="state" id="state">
                <option value="0">Selecione a UF</option>
                {ufs.map(uf => (
                  <option key={uf.id} value={uf.sigla}>{`${uf.nome} - ${uf.sigla}`}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select onChange={handleSelectCity} name="city" id="city">
                <option value="0">Selecione a Cidade</option>
                {cities.map(city => (
                  <option key={city.id} value={city.nome}>{city.nome}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de Coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>
          <ul className="items-grid">
            {items.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                className={formData.items?.includes(item.id) ? 'selected' : ''}
              >
                <img src={item.image} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div >
  );
}

export default CreatePoint;
