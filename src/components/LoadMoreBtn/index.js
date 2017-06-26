import React, { Component } from 'react'

class LoadMoreBtn extends Component {
  state = {
    isLoading: false
  }

  loadMore() {
    const self = this
    const next = this.props.next
    
    self.setState({
        isLoading: true
    })
    window.FB.api(next,
        (response) => {
          console.log(response)
          if (response && !response.error) {
            self.setState({
                isLoading: false
            })
            self.props.callback(response)
          }
        }
    )
  }
  render() {
    const isLoading = this.state.isLoading
      
    return (<div className="col-xs-12">
        <button className="btn btn-info btn-raised col-xs-12" onClick={(this.loadMore).bind(this)}> 
            {!isLoading && 
                <span>Load more</span>
            }
            {isLoading && 
                <i className="fa fa-circle-o-notch fa-spin"></i>
            }
        </button>
    </div>)
    
  }
}

export default LoadMoreBtn
