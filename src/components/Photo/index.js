import React, { Component } from 'react'

import './Photo.css'

class Photo extends Component {
  state = {
    selected: false,
    imported: false
  }

  toggleSelect() {
    if (this.state.imported) {
      return;
    }
    const toggle = this.state.selected ? false : true

    this.setState({
      selected: toggle
    })

    this.props.onSelected(this.props.id)
  }

  render() {
    // Get photo status before rendering
    const userId = this.props.userId
    const albumId = this.props.albumId
    const photoId = this.props.id
    const self = this

    fetch('http://localhost:' + window.BACKEND_PORT + '/photo/' + userId + '/' + albumId + '/' + photoId, {
      method: 'GET'
    })
    .then((response) => response.json())
    .then((data) => {
      self.setState({
        imported: data.imported
      })
    })
    .catch((e) => {
      console.log(e);
    })

    const images = this.props.images
    const name = this.props.name
    const selectedClass = this.state.selected ? ' selected' : ''
    const importedClass = this.state.imported ? ' imported' : ''

    return (
      <div className={'col-xs-12 col-md-6 Photo'.concat(selectedClass, importedClass)} onClick={(this.toggleSelect).bind(this)}>
        <img src={images[0].source} alt={name} />
      </div>
      )
  }
}

export default Photo
