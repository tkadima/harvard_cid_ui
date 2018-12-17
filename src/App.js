import React, { Component } from 'react'
import axios from 'axios'

import MainDropDown from './components/MainDropDown'
import './styles.scss'

const API = 'https://api.myjson.com/bins/dbg52'

class App extends Component {
  state = {
    regions: [],
    states: [],
    counties: [],
    error: null,
    loading: false
  }

  getStateCountyPairForRegion = (region) => {
    const stateCountyPairs = this.getStateCountyPairs()
    return stateCountyPairs.filter(stateCountyPair => stateCountyPair[0].parent === region.id)
  }

  getCountiesForState = (state) => {
    const countyStates = this.state.counties
    return countyStates.filter(county => county.parent === state.id)
  }

  getStateCountyPairs = () => {
    const { states } = this.state
    const stateCountyPairs = []
    states.map(state => stateCountyPairs.push([state, this.getCountiesForState(state)]))
    return stateCountyPairs
  }

  sortLocationsbyHierachy = () => {
    const sortedLocations = []
    const { regions } = this.state
    regions.map(region => sortedLocations.push([region, this.getStateCountyPairForRegion(region)]))
    return sortedLocations
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    });
    axios.get(API)
      .then(results => this.setState({
        regions: results.data.filter(location => location.level === 'region'),
        states: results.data.filter(location => location.level === 'state'),
        counties: results.data.filter(location => location.level === 'county'),
        isLoading: false
      }))
      .catch(error => this.setState({
        error,
        isLoading: false
      }));
  }

  render() {
    const { isLoading, error } = this.state
    return (
      <div>
        <p className="error">
          { error && 'Error occured when loading counties' }
        </p>
        <p>{ isLoading ? 'Loading...' : ''} </p>
        <MainDropDown locations={this.sortLocationsbyHierachy()} />
      </div>
    )
  }
}

export default App
