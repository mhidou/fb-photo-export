import React, { Component } from 'react'
import _ from 'underscore'

import Login from '../Login'
import AlbumsList from '../AlbumsList'
import PhotosList from '../PhotosList'

class App extends Component {

  routes = [
    'login',
    'albums',
    'photos'
  ]

  state = {
    route: '',
    currentUser: {},
    albums: [],
    currentAlbum: '',
    importedAlbums: []
  }

  onLogin(response) {
    const user = {
      userID: response.userID,
      expiresIn: response.expiresIn,
      signedRequest: response.signedRequest,
      accessToken: response.accessToken
    }

    let albums = response.albums
     albums.data = _.sortBy(albums.data, 'name')

    this.setState((prevState, props) => {
      return {
        route: 'albums',
        currentUser: user,
        albums: albums,
        currentAlbum: this.state.currentAlbum,
        importedAlbums: this.state.importedAlbums
      }
    })
    
  }

  onSelectAlbum(albumId) {
    this.setState((prevState, props) => {
      return {
        route: 'album',
        currentUser: this.state.currentUser,
        albums: this.state.albums,
        currentAlbum: albumId,
        importedAlbums: this.state.importedAlbums
      }
    })
  }

  loadMoreAlbums(cursor) {
    // TODO: load more albums
    // https://graph.facebook.com/me/albums?after=<paging.next>
    console.log('loading more albums')
  }

  onReturnAlbums() {
    this.setState((prevState, props) => {
      return {
        route: 'albums',
        currentUser: this.state.currentUser,
        albums: this.state.albums,
        currentAlbum: this.state.currentAlbum,
        importedAlbums: this.state.importedAlbums
      }
    })
  }

  render() {
    const route = this.state.route
    const currentUser = this.state.currentUser
    const currentAlbum = this.state.currentAlbum

    if (
      route === 'albums'  &&
      currentUser.signedRequest
    ) {
      return (
        <AlbumsList 
          user={currentUser}
          albums={this.state.albums}
          loadMoreAlbums={(this.loadMoreAlbums).bind(this)}
          onSelectAlbum={(this.onSelectAlbum).bind(this)} 
          />
      )
    }
    else if (
      route === 'album' &&
      currentUser.signedRequest
    ){
      return (
        <PhotosList 
          user={currentUser}
          currentAlbum={currentAlbum}
          onReturn={(this.onReturnAlbums).bind(this)} 
          />
      )
    }
    else {
      return (
        <Login onLogin={(this.onLogin).bind(this)} />
      )
    }
  }
}

export default App
