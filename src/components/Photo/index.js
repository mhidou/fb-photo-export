import React, { Component } from 'react'

import './Photo.css'

class Photo extends Component {
  state = {
    selected: false
  }
  toggleSelect() {
    const toggle = this.state.selected ? false : true

    this.setState({
      selected: toggle
    })

    this.props.onSelected(this.props.id)
  }
  render() {
    const images = this.props.images
    const name = this.props.name
    const selectedClass = this.state.selected ? ' selected' : ''
    
    return (
      <div className={'col-xs-12 col-md-6 Photo'.concat(selectedClass)} onClick={(this.toggleSelect).bind(this)}>
        <img src={images[0].source} alt={name} />
      </div>
      )
  }
}

export default Photo
