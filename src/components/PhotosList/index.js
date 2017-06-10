import React, { Component } from 'react'
import 'whatwg-fetch'
import _ from 'underscore'
import progressBar from 'react-progressbar.js';
const Line = progressBar.Line;
import sweetAlert from 'sweetalert'

import LoadMoreBtn from '../LoadMoreBtn/'
import Photo from '../Photo/'

class PhotosList extends Component {
  state = {
    photos: [],
    selectedPhotos: [],
    progress: 0,
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

  loadMorePhotos (response) {
    this.setState({
      photos: this.state.photos.concat(response.data),
      paging: response.paging
    })
  }

  importAlbum() {
    const self = this
    const selectedPhotos = this.state.selectedPhotos
    let importedPhotos = 0

    if (selectedPhotos.length === 0) {
      return;
    }

    this.setState((prevState, props) => {
      return {
        photos: this.state.photos,
        paging: this.state.paging,
        isImported: false,
        isImporting: true,
      }
    })

    selectedPhotos.forEach(function(element) {
      fetch('http://localhost:' + window.BACKEND_PORT + '/photo/import/', {
        method: 'POST',
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        mode: 'cors',
        cache: 'default',
        body: JSON.stringify({
          albumId: self.props.currentAlbum,
          accessToken: self.props.user.accessToken,
          photoId: element,
          userId: self.props.user.userID
        })
      })
      .then((response) => {
        importedPhotos++

        if (response.ok) {
          self.setState((prevState, props) => {
            return {
              progress: (importedPhotos / selectedPhotos.length),
            }
          })

          if (importedPhotos === selectedPhotos.length) {
            self.setState((prevState, props) => {
              return {
                isImported: false,
                isImporting: false,
              }
            })
            sweetAlert("All selected photos has been imported", "Check your public/imports folder", "success")
          }
        }
      })
    });
  }

  onSelectPhoto(photoId) {
    const selectedPhotos = this.state.selectedPhotos
    const alreadySelected = selectedPhotos.indexOf(photoId)

    const newSelectedPhotos = alreadySelected === -1 ? selectedPhotos.concat(photoId) : _.without(selectedPhotos, photoId);

    this.setState({
      selectedPhotos: newSelectedPhotos,
      photos: this.state.photos,
      paging: this.state.paging,
      isImported: this.state.isImported,
      isImporting: this.state.isImporting,
    })
  }

  render() {
    const photos = this.state.photos
    const next = this.state.paging.next
    const isImported = this.state.isImported
    const isImporting = this.state.isImporting
    const selectedPhotosLength = this.state.selectedPhotos.length

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
          {!isImporting && !isImported && selectedPhotosLength > 0  &&
            <div className="pull-right" onClick={(this.importAlbum).bind(this)}>
              <i className="fa fa-download"></i> Import now
            </div>
          }
          {!isImporting && !isImported && !selectedPhotosLength > 0 &&
            <div className="pull-right">
              <i className="fa fa-times"></i> Select some photos to import
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
            key={index}
            id={elt.id}
            albumId={this.props.currentAlbum}
            userId={this.props.user.userID}
            onSelected={(this.onSelectPhoto).bind(this)}
            name={elt.name}
            images={elt.images}
            />
        })}
        {loadMore &&
          <LoadMoreBtn
            callback={(this.loadMorePhotos).bind(this)}
            next={next}
            />
        }
        {isImporting &&
          <div className="spinnerContainer">
            <Line
              progress={this.state.progress}
              text={'test'}
              options={{
                strokeWidth: 4,
                easing: 'easeInOut',
                duration: 1400,
                color: '#FFEA82',
                trailColor: '#eee',
                trailWidth: 1,
                svgStyle: {width: '100%', height: '100%'},
                text: {
                  style: {
                    // Text color.
                    // Default: same as stroke color (options.color)
                    color: '#999',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    padding: 0,
                    margin: 0,
                    transform: null
                  },
                  autoStyleContainer: false
                },
                from: {color: '#FFEA82'},
                to: {color: '#ED6A5A'},
                step: (state, bar) => {
                  bar.setText(Math.round(bar.value()*100) + ' %');
                }
              }}
              initialAnimate={true}
              containerStyle={{
                  height: '50px'
              }}
              containerClassName={'.progressbar'}
              />
          </div>
        }
      </div>
    )
  }
}

export default PhotosList
