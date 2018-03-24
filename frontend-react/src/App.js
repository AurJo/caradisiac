import React, { Component } from 'react';
import './App.css';
import axios from 'axios'


class App extends Component {
  constructor () {
    super();
    this.state = {
      models: [{
        brand:'', 
        model: '',
        volume: '', 
        uuid:'', 
        name:''
      }]
    };

    this.handleClick = this.handleClick.bind(this);
  }


  handleClick () {
    axios.get('http://localhost:9292/cars?nbr=10')
    .then(response => {
        const models = response.data; 
        models.forEach(element => {
          this.state.models.push(element);
        });
    });
  }


  render() {
    var listmodels = this.state.models
    return (
      <div className='button_container'>
        <button className='button' onClick={this.handleClick}> Click Me </button>
        <p>{listmodels}</p>
       </div> 
    )
  }

}

export default App;
