import React, { Component } from 'react';
import './App.css';
import axios from 'axios'


class App extends Component {
  constructor () {
    super();
    this.state = {
      models: [{
        brand:'', 
        image:'',
        model: '',
        volume: '', 
        uuid:'', 
        name:''
      }],
      size: 10,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }


  handleClick () {
    var url = 'http://localhost:9292/cars';
    if(this.state.size !== 0) url = url + "?nbr=" + this.state.size
    axios.get(url, {responseType: 'json'})
    .then(response => {
        this.setState({models:response.data});
    });
  }

  handleChange(e){
    this.setState({size: e.target.value});
  }


  render() {
    return (
      <div>
        <div className='button_container'>
          <h1 class='txtstyle'>Welcome on Caradisiac 2.0</h1>
          <button className='button' onClick={this.handleClick}> Click Me </button>
          <form>
            Number of cars : <input type="number" value={this.state.size} onChange={this.handleChange}/>
          </form> 
        </div> 
        <ul>
          {
            this.state.models.map(function(model){
              return <div >
                <p class="flotte"> 
                  <img src={model.image} alt="model" height="150" vertical-aligne="middle"/> 
                  <h2>{model.brand}</h2>
                  <h5> {model.model} </h5>
                  <b> Volume : {model.volume} </b>
                </p>
              </div>
            })
          }
        </ul>    
      </div>
    )
  }

}

export default App;
