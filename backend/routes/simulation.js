/*
** EPITECH PROJECT, 2025
** SimuRoute [WSL: Ubuntu]
** File description:
** simulation
*/

const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { depart, arrivee, type } = req.body;

  const distance = 120;
  const temps = 90;
  const cout = 18.5;

  res.json({
    depart,
    arrivee,
    type,
    distance,
    temps,
    cout
  });
});

module.exports = router;
