import React from 'react'
import Navbar from 'components/Navbar/'

export default class App extends React.Component {
    render() {
      return (
            <div className="APP-WRAPPER">
              <Navbar />
              <div className="body">
                { this.props.children }
              </div>
            </div>
        )
    }
}

App.propTypes = {
    children: React.PropTypes.node,
}
