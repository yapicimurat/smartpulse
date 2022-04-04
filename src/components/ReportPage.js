import React from 'react';
import './ReportPage.css';
import axios from "axios";
import {dateFormatter} from "../helpers.js";
class ReportPage extends React.Component{

  constructor(props){
    super(props);

    this.grouped = null;
    this.error = false;
    this.errorDescription = "";

    this.getData();
  }


  getData(){
    const today = new Date();
    const startDate = dateFormatter(today);
    const endDate = dateFormatter(today);

    axios.get(`http://localhost:3005/getData`, {
        params: {
          endDate: endDate,
          startDate: startDate
        }
      }
    )
    .then(response => {
      console.log(response);
      const {resultCode, resultDescription, data} = response;
      const intraDayTradeHistoryList = data.intraDayTradeHistoryList;
      
      
      const grouped = {};
      let filtered = intraDayTradeHistoryList.forEach(element => {
          if(String(element.conract).substring(0, 2) == "PH"){
              const {price, quantity, conract} = element;
              if(typeof grouped[conract] == "undefined"){
                  grouped[conract] = {
                      [conract]: [],
                      toplamIslemTutari: 0,
                      toplamIslemMiktari: 0,
                      agirlikliOrtalamaFiyat: 0
                  }
              }

              //(price*quantity)/10
              grouped[conract].toplamIslemTutari += (price * quantity) / 10;
              
              //quantity/10
              grouped[conract].toplamIslemMiktari += quantity / 10;

              const {toplamIslemMiktari, toplamIslemTutari} = grouped[conract];
              
              //Toplam İşlem Tutarı/Toplam İşlem Miktarı
              grouped[conract].agirlikliOrtalamaFiyat = toplamIslemTutari / toplamIslemMiktari;

              grouped[conract][element.conract].push(element);
          }
          
      });
      this.grouped = grouped;

      this.setState({});
      
    })
    .catch(error => {
        this.error = true;
        this.errorDescription = error.message;
        this.setState({});
    });



  }

  showList(){

  }

  render(){
    if(this.grouped == null && this.error == false){
      return (
        <h2>Fetching data...</h2>
      );
    }
    else if(this.grouped != null && this.error == false){

      const editedList = [];
      Object.keys(this.grouped).forEach(el => {
        const currentData = this.grouped[el];
        const parseDateYear = el.substring(2, 4).padStart(4, '20');
        const parseDateMounth = el.substring(4, 6);
        const parseDateDay = el.substring(6, 8);

        const parseTime = el.substring(8, 10);
       
        const strDateTime = `${parseDateDay}.${parseDateMounth}.${parseDateYear} ${parseTime}:00`;
        
        const {toplamIslemMiktari, toplamIslemTutari, agirlikliOrtalamaFiyat} = this.grouped[el];

        let formatting = Intl.NumberFormat('en-US');
        

        editedList.push({
          date: strDateTime,
          toplamIslemMiktari: formatting.format(toplamIslemMiktari),
          toplamIslemTutari: formatting.format(toplamIslemTutari),
          agirlikliOrtalamaFiyat: formatting.format(agirlikliOrtalamaFiyat)
        });




      });

      
      /*
        <table>
          <thead>
            <tr>
              <th></th>
            </tr>
          </thead>
        </table>
      */
      const thead = (
        <thead>
          <tr>
            <th>Tarih</th>
            <th>Toplam İşlem Miktari (MWh)</th>
            <th>Toplam İşlem Tutari (TL)</th>
            <th>Ağırlık Ortalama Fiyat (TL/MWh)</th>
          </tr>
        </thead>
      );

      const tbody = editedList.map(data => {
        return <tbody>
          <tr>
            <td>{data.date}</td>
            <td>{data.toplamIslemTutari}</td>
            <td>{data.toplamIslemMiktari}</td>
            <td>{data.agirlikliOrtalamaFiyat}</td>
          </tr>
        </tbody>
        
       
      });

      console.log(tbody);

      return (
        <table>
          {thead}
          {tbody}
        </table>
      );






    }
    else{
      return (
        <h2>{this.errorDescription}</h2>
      );
    }

    
  }

  


}

export default ReportPage;
