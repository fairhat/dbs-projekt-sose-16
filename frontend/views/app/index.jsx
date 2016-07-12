import React from 'react'
import Navbar from 'components/Navbar/'

export default class App extends React.Component {
    static propTypes = {
        children: React.PropTypes.node,
    }

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
