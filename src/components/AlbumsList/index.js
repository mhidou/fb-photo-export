import React, { Component } from 'react'

import LoadMoreBtn from '../LoadMoreBtn/'
import Album from '../Album'

class AlbumsList extends Component {

  render() {
    const albums = this.props.albums.data
    const next = this.props.albums.paging.next
    const onSelectAlbum = this.props.onSelectAlbum

    let loadMore = false

    if(next) {
      loadMore = true
    }

    return (
      <div className="row">
        <h1>Your albums.</h1>
        {albums.map((elt, index) => {
          return <Album 
            onSelectAlbum={onSelectAlbum} 
            key={index} id={elt.id} 
            name={elt.name} 
            created_time={elt.created_time} 
            />
        })}
        {loadMore && 
          <LoadMoreBtn
            callback={this.props.loadMoreAlbums}
            next={next}
            />
        }
      </div>
    )
  }
}

export default AlbumsList
