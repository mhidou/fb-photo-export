import React, { Component } from 'react';

import Login from '../Login'
import AlbumsList from '../AlbumsList'

class App extends Component {

  state = {
    logedIn: false,
    me: {},
  }

  login(me) {
    this.setState({
      logedIn: true,
      me: me
    })
  }

  render() {
    if (this.state.logedIn) {
      return (
        <div>
          <AlbumsList me={this.state.me} />
        </div>
      )
    }
    return (
      <div>
        <Login />
      </div>
    )
  }
}

export default App;
