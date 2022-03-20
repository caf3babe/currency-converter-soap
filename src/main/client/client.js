var axios = require('axios');
var https = require('https');
var fs = require('fs');

// var url = 'http://localhost:4321/currency-converter-1.0.0/services/CurrencyConverterService';
var url = 'http://currency-converter.westeurope.azurecontainer.io:4321/currency-converter-1.0.0/services/CurrencyConverterService';


var payloadCurrenciesList =               
'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cur="http://example.org/CurrencyConverter">'+
'<soapenv:Header/>'+
    '<soapenv:Body>'+
        '<cur:currenciesListRequest/>'+
    '</soapenv:Body>'+
'</soapenv:Envelope>';

//Change the symbol in <cur:currency>XXX</cur:currency> -> use currenciesList for available symbols
var payloadCurrencyPerCode = 
'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cur="http://example.org/CurrencyConverter">'+
   '<soapenv:Header/>'+
   '<soapenv:Body>'+
    '  <cur:currency>USD</cur:currency>'+
   '</soapenv:Body>'+
'</soapenv:Envelope>';


var config = {
     headers: {'Content-Type': 'application/xml'},
     auth: {
        username: 'group1',
        password: 'group1'
      },
      httpsAgent: new https.Agent({ ca: fs.readFileSync('localhost.pem') })
    };

  function currencyConverter(method){
    axios.post(url, method, config).then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //currencyConverter(payloadCurrenciesList);

  currencyConverter(payloadCurrencyPerCode);