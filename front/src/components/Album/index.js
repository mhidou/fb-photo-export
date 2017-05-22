import React, { Component } from 'react';
import moment from 'moment';

class Album extends Component {
  state = {
    background: ''
  }

  componentDidMount () {
    const self = this;
    window.FB.api(
        '/' + this.props.id + '?fields=cover_photo',
        function (response) {
          if (response && !response.error) {
            self.getBackgroundImage(response.cover_photo.id);
          }
        }
    );
  }

  getBackgroundImage(id) {
    const self = this;
    window.FB.api(
        '/' + id + '?fields=images',
        function (response) {
          console.log(response);
          if (response && !response.error) {
            self.setState({
              background: response.images[0].source
            });
          }
        }
    );
  }

  render() {
    const {name, created_time} = this.props
    return (
      <div style={{backgroundImage:'url(' + this.state.background + ')'}}>
        <span>
          {name}
        </span>
        <span>
          Created {moment(created_time).fromNow()}
        </span>
      </div>
    )
  }
}

export default Album;
