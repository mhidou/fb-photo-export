import React, { Component } from 'react';
import Album from '../Album'

class AlbumsList extends Component {

  constructor(props) {
    super(props);
    console.log(props.me.albums);
    this.state = {
      albums: props.me.albums.data,
      after: props.me.albums.paging.cursors.after,
      before: props.me.albums.paging.cursors.before
    };
  }

  render() {
    const albums = this.state.albums;
    return (
      <div>
        {albums.map(function(elt, index){
          return <Album key={index} id={elt.id} name={elt.name} created_time={elt.created_time} />;
        })}
      </div>
    )
  }
}

export default AlbumsList;
