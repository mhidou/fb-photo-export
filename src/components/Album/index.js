import React, { Component } from 'react'

import './Album.css'

class Album extends Component {
  state = {
    background: '',
    count: 0
  }

  componentDidMount () {
    const self = this
    window.FB.api(
        '/' + this.props.id + '?fields=cover_photo,count',
        (response) => {
          if (response && !response.error) {
            self.setState({
              count: response.count
            })
            self.getBackgroundImage(response.cover_photo.id)
          }
        }
    )
  }

  getBackgroundImage(id) {
    const self = this
    window.FB.api(
        '/' + id + '?fields=images',
        (response) => {
          if (response && !response.error) {
            self.setState({
              background: response.images[0].source
            })
          }
        }
    )
  }

  openAlbum(e) {
    e.preventDefault();
    if (this.props.onSelectAlbum) {
      this.props.onSelectAlbum(this.props.id)
    }
  }

  render() {
    const {name} = this.props
    return (
      <div className="col-xs-4 Album">
        <div className="cover" style={{backgroundImage: 'url('+this.state.background+')'}}>
        </div>
        <div className="info">
          <div className="name">
            <a href="#" className="btn btn-link btn-info" onClick={(this.openAlbum).bind(this)}>
              {name}
            </a>
          </div>
          <div className="count">
            {this.state.count} Photos
          </div>
        </div>
      </div>
    )
  }
}

export default Album
