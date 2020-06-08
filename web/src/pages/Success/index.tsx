import React, { useEffect } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import './styles.css';

const Success = () => {
  const history = useHistory();

  useEffect(() => {
    setTimeout(() => {
      history.push('/');
    }, 2000);
  }, [history]);

  return (
    <div id="page-success">
      <div className="content">
        <header>
          <img src={logo} alt="Ecoleta" />
        </header>

        <main>
          <FiCheckCircle className="icon-check" size="36px" />
          <h2>Cadastro concluído!</h2>
        </main>
      </div>
    </div>
  );
}

export default Success;
