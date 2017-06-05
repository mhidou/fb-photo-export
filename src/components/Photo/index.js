import React, { Component } from 'react'

import './Photo.css'

class Photo extends Component {
  render() {
    const images = this.props.images
    const name = this.props.name
    
    return (
      <div className="col-xs-12 col-md-6 Photo">
        <img src={images[0].source} alt={name} />
      </div>
      )
  }
}

export default Photo
