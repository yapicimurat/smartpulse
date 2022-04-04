const {createServer} = require('http');
const express = require('express');
const app = express();

const server = createServer(app);
const axios = require('axios');
const cors = require("cors");

const corsOptions = {
    origin: 'http://localhost:3000',
};
app.use(cors(corsOptions));

server.listen(3005);



app.get('/getData', async (req, res) => {
    /*
        ÖNEMLİ NOT: NORMALDE API KISMINA İHTİYAÇ DUYMAYACAKTIM FAKAT ANLADIGIM KADARIYLA İSTEK YAPMAMIZ GEREKEN
        API KAYNAGINDA allow-access-control-origin KABULU BULUNMAMAKTADIR. TARAYICI KISMINDA İSTEK YAPMAMIZA
        ENGEL OLUYOR. BU NEDENLE KENDİM API YAZIP BURDAN API ADRESİNE GET İSTEGİ YAPIP BENIM UYGULAMAMA DÖNDÜRME
        KARARI ALDIM. BU İŞLEM ÇOKTA MANTIKLI OLMASA DA MECBUR KALDIM....
    */
   

    const {startDate, endDate} = req.query;
    const result = await axios.get('https://seffaflik.epias.com.tr/transparency/service/market/intra-day-trade-history',
    {
        params:{
            endDate: endDate,
            startDate: startDate
        }
    })
    .then(response => {
        res.json(response.data.body);
    })
    .catch(error => {
        res.json(error.message);
    });


    // res.end(result);
})



