import React, { Component } from 'react'

class Login extends Component {

  static defaultProps = {
    appId: 'YourAppId',
    redirectUri: typeof window !== 'undefined' ? window.location.href : '/',
    scope: 'public_profile,email,user_photos',
    xfbml: false,
    cookie: true,
    fields: 'albums',
    version: 'v2.9',
  }

  state = {
    isSdkLoaded: false,
    isProcessing: false,
  }

  responseLoginFacebook(response) {
    this.props.onLogin(response)
  }

  componentDidMount() {
    this._isMounted = true
    if (document.getElementById('facebook-jssdk')) {
      this.sdkLoaded()
      return
    }
    this.setFbAsyncInit()
    this.loadSdkAsynchronously()
    let fbRoot = document.getElementById('fb-root')
    if (!fbRoot) {
      fbRoot = document.createElement('div')
      fbRoot.id = 'fb-root'
      document.body.appendChild(fbRoot)
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  setStateIfMounted(state) {
    if (this._isMounted) {
      this.setState(state)
    }
  }

  setFbAsyncInit() {
    const { appId, xfbml, cookie, version } = this.props
    window.fbAsyncInit = () => {
      window.FB.init({
        version: `v${version}`,
        appId,
        xfbml,
        cookie,
      })
      this.setStateIfMounted({
        isSdkLoaded: true
      })
    }
  }

  loadSdkAsynchronously() {
    ((d, s, id) => {
      const element = d.getElementsByTagName(s)[0]
      const fjs = element
      let js = element
      if (d.getElementById(id)) { return }
      js = d.createElement(s); js.id = id
      js.src = `//connect.facebook.net/en_US/all.js`
      fjs.parentNode.insertBefore(js, fjs)
    })(document, 'script', 'facebook-jssdk')
  }

  responseApi = (authResponse) => {
    window.FB.api('/me', { locale: this.props.language, fields: this.props.fields }, (me) => {
      Object.assign(me, authResponse)
      this.responseLoginFacebook(me)
    })
  }

  checkLoginState = (response) => {
    this.setStateIfMounted({ isProcessing: false })
    if (response.authResponse) {
      this.responseApi(response.authResponse)
    } else {
      if (this.responseLoginFacebook) {
        this.responseLoginFacebook({ status: response.status })
      }
    }
  }

  click(e) {
    this.setState({ isProcessing: true })
    const { scope, appId, redirectUri } = this.props

    const params = {
      client_id: appId,
      redirect_uri: redirectUri,
      state: 'facebookdirect',
      scope,
    }

    window.FB.login(this.checkLoginState, { scope, auth_type: params.auth_type })
  }

  render() {
    return (
      <div className="login">
        <h1>To use the facebook photo import first login to your account and give this app required permissions.</h1>
        <button
          className="btn btn-info btn-raised"
          onClick={(this.click).bind(this)}
          >
          <i className="fa fa-facebook-official"></i> Log in with Facebook
        </button>
      </div>
    )
  }
}

export default Login
