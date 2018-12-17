import React, { Component } from 'react'

class MainDropDown extends Component {
  state = {
    displayList: false,
    selectedCounty: null,
    locations: []
  }

  componentWillMount(){
    document.addEventListener('mousedown', this.handleClick, false)
  }

  componentWillUnmount(){
    document.removeEventListener('mousedown', this.handleClick, false)
  }

  handleClick = (event) => {
    if(this.node.contains(event.target)) {
      return;
    }
    this.setState ({
      displayList: false
    })
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.locations !== this.props.locations){
        this.setState({locations: nextProps.locations});
      }
   }

  displayDropDown = () => {
    const { displayList } = this.state
    this.setState({
      displayList: !displayList,
    })
  }

  scrollToCounty = (id) => {
    document.getElementById(id).scrollIntoView()
  }

  onSelectCounty = (event) => {
    this.setState({
      selectedCounty: event.target.innerText,
      displayList: false,
    })
    this.scrollToCounty(event.target.id)
  }

  renderCounties = (locations) => {
    const locationsForDisplay  = locations.flat(4)

    return locationsForDisplay.map(location => (
      <li className={`dropdown-list-item--${location.level}`}
          id={location.id}
          key={location.id}
          onClick={location.level === 'county' ? this.onSelectCounty : null }>
        {location.name}
      </li>
    ))
  }

  onClearSelected = () => {
    this.setState({
      selectedCounty: null,
    })
  }

  isAncestor  = (county, location, locations) => {
    if (location.level === 'state') {
      return county.parent === location.id
    }
    if (location.level === 'region') {
      const stateOfCounty = locations.find(state => county.parent === location.id)
      return stateOfCounty.id === location.id
    }
  }


  onSearchCounty = (event) => {
    const { locations } = this.state

    const filteredLocations = locations.filter(location => {
      // location[1][1][1] refers to the list of counties at each location
      return location[1][1][1].filter(county => county.name.includes(event.target.value))
    })

    this.setState({
      locations: filteredLocations,
    })
  }

  render() {
    const { displayList, selectedCounty, locations }  = this.state

    return (
      <div ref={node => this.node = node }>
        <div className="dropdown-wrapper">
          <div className="dropdown-header">
            <div className="dropdown-header-title">
              { selectedCounty ?
                <p> {selectedCounty}
                  <button className="dropdown-clear" onClick={this.onClearSelected}>X</button>
                </p>
                :
                <input
                  className="dropdown-search"
                  placeholder='Please select a county'
                  onChange={this.onSearchCounty}/>
              }
            </div>
            <span className={`dropdown-arrow dropdown-arrow--${displayList ? 'up' : 'down'}`}
              onClick={this.displayDropDown}>
            </span>
          </div>
          <ul className={`dropdown-list${displayList ?  '' : '--hidden'}` }>
            { this.renderCounties(locations) }
          </ul>
        </div>
      </div>
    )
  }
}

export default MainDropDown
