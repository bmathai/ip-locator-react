import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import axios from 'axios';

const mapStyles = {
  width: '700px',
  height: '500px'
};

export class MapContainer extends Component {

  constructor(props) {
      super(props);
      this.state = {value: '',
                    location: '',
                    isp: '',
                    coord: {
                      lat: '1',
                      lng: '1'
                    }
  };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getLatLng = this.getLatLng.bind(this);
    this.getCoord = this.getCoord.bind(this);
    this.setLocation = this.setLocation.bind(this);
  }

  setLocation(response){
    var locationres =  response.data.city + ", " +
                       response.data.regionName + " " +
                       response.data.zip + ", " +
                       response.data.country;
    this.setState({location: locationres});
    console.log(this.state.location);
  }

  setISP(response){
    this.setState({isp: response.data.isp});
  }

  getCoord(response){
    console.log(response.data);

    this.setState({coord: {
                      lat: response.data.lat,
                      lng: response.data.lon
                    }});
    console.log(this.state.coord);
    this.setLocation(response);
    this.setISP(response);
  }

  getLatLng(ip){
    axios.get('http://ip-api.com/json/' + ip)
       .then(response => this.getCoord(response));
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    console.log(this.state.value);
    this.getLatLng(this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <div className="app">
      <h1 className="title">Find That IP!</h1>
      <div className="google-map">
      <Map
        key={this.state.coord.lat}
        google={this.props.google}
        zoom={14}
        style={mapStyles}
        initialCenter={this.state.coord}
      />
      </div>
      <div className ="form-wrapper">
      
      <form className="pure-form" ref="form" onSubmit={this.handleSubmit}>
      <fieldset>
          <input type="text" className="pure-input-2-3" value={this.state.value} onChange={this.handleChange} />
          <button type="submit" className="pure-button pure-button-primary pure-input-1-3 button-margin">Search IP Location</button>
          </fieldset>
      </form>
      <div className="result-wrapper">
      <div className="result-title"><strong>Location: &nbsp;</strong></div>
      <div className="result-content">{this.state.location}</div>
      </div>
      <div className="result-wrapper">
      <div className="result-title"><strong>Internet Service Provider: &nbsp;</strong></div>
      <div className="result-content">{this.state.isp}</div>
      </div>
      </div>


      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'PUT YOUR API KEY HERE'
})(MapContainer);