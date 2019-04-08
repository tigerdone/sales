const express = require('express')
const path = require('path')

module.exports = function (app) {
    app.get('/poster_magic', function (req, res) {
        res.download(path.join(__dirname, '../public/pdf/program/MagicPAPER.jpg'));
    })
    app.get('/poster_anmoji', function (req, res) {
        res.download(path.join(__dirname, '../public/pdf/program/Anmoji_Poster.pdf'));
    })
    app.get('/poster_see', function (req, res) {
        res.download(path.join(__dirname, '../public/pdf/program/See-your-voice.jpg'));
    })
    app.get('/poster_table', function (req, res) {
        res.download(path.join(__dirname, '../public/pdf/program/tablewar.jpg'));
    })
    app.get('/poster_shibi', function (req, res) {
        res.download(path.join(__dirname, '../public/pdf/program/shibi.jpg'));
    })
}



