import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CoinItem from './CoinItem.js';
import { Link, browserHistory } from 'react-router';
 
const CRYPTOCOMPARE_API_URL = "https://www.cryptocompare.com";
const COINMARKETCAP_API_URI = "https://api.coinmarketcap.com";
const UPDATE_INTERVAL = 60*1000;

/* An example React component */
class CoinsTable extends Component {

    constructor(props){
        super(props);
        this.state = {
            requestFailed : false,
            coinmarketcapData : [],   
            crytocompareData : [],           
        }
    }c

    componentDidMount(){
        this.getCoins();
        this.getCoinData();
        this.interval = setInterval(this.getCoins.bind(this), UPDATE_INTERVAL);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    getCoins(){
        //API call n1

        fetch(COINMARKETCAP_API_URI + "/v1/ticker/?limit=20")
            .then(response1 => {
                if(response1 == ""){
                    throw Error("Network request failed");
                }
                return response1.json();
            })
            .then(d => {
                this.setState({
                    coinmarketcapData : d
                })
            }), () => {
                this.setState({
                    requestFailed : true
                })
            }       
    }

    getCoinData(){
        //AJAX request n2
        fetch(CRYPTOCOMPARE_API_URL + "/api/data/coinlist")
            .then(response2 => {
                if(response2.Response == "Success"){
                    throw Error("Network request failed");
                }

                return response2.json();
            })
            .then(d => {
                this.setState({
                    crytocompareData : d.Data
                });
                console.log(d);
            }), () => {
                this.setState({
                    requestFailed : true
                })
            }
    }

    getCoinImage(symbol){

        //Symbol errors 
        if(symbol == "MIOTA"){symbol = "IOT";}

        try{
            const img = CRYPTOCOMPARE_API_URL+this.state.crytocompareData[symbol]['ImageUrl']
            console.log(img);
            if(!img) throw "No Picture";
            else return img;
            
        }
        catch(err)
        {
            return err;
        }
      
    }

    renderCoins() {

        if(this.state.coinmarketcapData instanceof Array){

            return this.state.coinmarketcapData.map(coin => {

                const symbol = coin.symbol;
                const img = this.getCoinImage(symbol);
                return <CoinItem key={coin.name} data = {coin} image = {img} />

            })
        }
    }

    render() {

        if(this.state.coinmarketcapData == "" && this.state.crytocompareData =="") return <p>Loading</p>
        return (
            <div>
                <h3>All Coins</h3>
                <table className="table table-hover">
                    <thead>
                      <tr>
                        <td>Rank</td>
                        <td>Name</td>
                        <td>Symbol</td>
                        <td>Price (USD)</td>
                        <td>1H</td>
                        <td>1D</td>
                        <td>1W</td>
                        <td>Market Cap (USD)</td>
                      </tr>
                    </thead>
                    <tbody>
                        { this.renderCoins() }
                    </tbody>
                  </table>
            </div>
        );
    }
}
 
export default CoinsTable;
 