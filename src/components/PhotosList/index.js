import React, { Component } from 'react'
import Spinner from 'react-spinner'
import 'whatwg-fetch'

import Photo from '../Photo/'

class PhotosList extends Component {
  state = {
    photos: [],
    paging: {},
    isImported: false,
    isImporting: false,
  }

  componentWillMount() {
    const self = this

    window.FB.api(
        '/' + this.props.currentAlbum + '/photos?fields=name,images',
        (response) => {
          if (response && !response.error) {
            self.setState({
              photos: response.data,
              paging: response.paging
            })
          }
        }
    )
  }

  loadMorePhotos() {
    // TODO: load more photos
    // https://graph.facebook.com/<albumId>/?after=<paging.next>
    console.log('loading more photos')
  }

  importAlbum() {
    const self = this
    this.setState((prevState, props) => {
      return {
        photos: this.state.photos,
        paging: this.state.paging,
        isImported: false,
        isImporting: true,
      }
    })
    fetch('http://localhost:' + window.BACKEND_PORT + '/import/album/', {
      method: 'POST',
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      mode: 'cors',
      cache: 'default',
      body: JSON.stringify({
        albumId: this.props.currentAlbum,
        accessToken: this.props.user.accessToken,
        userId: self.props.user.userID
      })
    })
    .then((data) => {
      self.setState((prevState, props) => {
        return {
          photos: self.state.photos,
          paging: self.state.paging,
          isImported: true,
          isImporting: false,
        }
      })
    }).catch((error) => {
      self.setState((prevState, props) => {
        return {
          photos: self.state.photos,
          paging: self.state.paging,
          isImported: false,
          isImporting: false,
        }
      })
    })
  }

  render() {
    const photos = this.state.photos
    const next = this.state.paging.next
    const isImported = this.state.isImported
    const isImporting = this.state.isImporting

    let loadMore = false

    if(next) {
      loadMore = true
    }

    return (
      <div className="row">
        <h1 className="col-xs-12" style={{cursor: 'pointer'}}>
          {!isImporting && 
            <div className="pull-left" onClick={this.props.onReturn}>
              <i className="fa fa-arrow-left"></i>
            </div>
          }
          {!isImporting && !isImported &&
            <div className="pull-right" onClick={(this.importAlbum).bind(this)}>
              <i className="fa fa-download"></i> Import this album
            </div>
          }
          {isImporting && !isImported &&
            <div className="pull-right">
              <i className="fa fa-circle-o-notch fa-spin"></i> Please wait while importing
            </div>
          }
          {!isImporting && isImported &&
            <div className="pull-right">
              <i className="fa fa-check"></i> Imported
            </div>
          }
          
        </h1>
        {photos.map((elt, index) => {
          return <Photo 
            key={index} id={elt.id} 
            name={elt.name} 
            images={elt.images}
            />
        })}
        {loadMore && 
          <button className="btn btn-info btn-raised col-xs-12" onClick={(this.loadMoreAlbums).bind(this)}>
            Load more
          </button>
        }
        {isImporting && 
          <div className="spinnerContainer">
            <Spinner />
          </div>
        }
      </div>
    )
    //return <div>photos list</div>
  }
}

export default PhotosList
