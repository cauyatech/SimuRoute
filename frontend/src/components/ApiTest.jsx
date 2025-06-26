/*
** EPITECH PROJECT, 2025
** SimuRoute [WSL: Ubuntu]
** File description:
** ApiTest
*/

import React, {useEffect, useState} from 'react';
import axios from 'axios';
const port = 3001;

export default function ApiTest() {
  const [msg, setMsg] = useState('…loading');

  useEffect(() => {
    axios.get(`http://localhost:${port}`)
      .then(res => setMsg(res.data.status))
      .catch(err => setMsg('Erreur : ' + err.message));
  }, []);

  return <div style={{ position: 'absolute', top: 10, left: 10, padding: '6px 12px', background: 'white' }}>{msg}</div>;
}
