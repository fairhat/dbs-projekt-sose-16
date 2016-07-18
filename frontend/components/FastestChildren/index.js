import React from 'react'
import Api from 'api'
import { Col, Panel, Table } from 'react-bootstrap'

export default class FastestChildren extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      dogs: []
    }

    this.getHunde = this.getHunde.bind(this)
  }

  getHunde() {
    this.setState({ isLoading: true })
    const direction = this.props.direction === 'fastest' ? -1 : 1
    Api.get('/hund/children', {
      params: {
        page: 0,
        itemsPerPage: this.props.top,
        top: this.props.top,
        gender: this.props.gender,
        direction
      }
    }).then((res) => {
      this.setState({ dogs: res.data })
    })
  }

  componentDidMount() {
    this.getHunde()
  }

  render() {
    const direction = this.props.direction === 'fastest' ? 'schnellsten' : 'langsamsten'
    const top = this.props.top
    const gender = this.props.gender === 'm' ? 'Rüden' : 'Hündinnen'
    return (
      <Col md={12} className="animated bounceInUp">
        <Panel header={`Die ${gender} mit den ${direction} ${top} Kindern.`} bsStyle="danger">
          <span>Enthält keine Hunde, deren Eltern <b>keine</b> Rennhunde sind.</span>
          <hr />
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>Bestes Kind</th>
                <th>Punkte Bestes Kind</th>
                <th>Hund</th>
                <th>Kinder</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.dogs.map((dog, index) => (
                  <tr key={index}>
                    <td>{dog.children ? dog.children.split(', ')[0] : '-'}</td>
                    <td>{dog.best}</td>
                    <td>{dog.parentName}</td>
                    <td>{dog.children || '-'}</td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
          <hr />
        </Panel>
      </Col>
    )
  }
}

FastestChildren.propTypes = {
  direction: React.PropTypes.oneOf(['fastest', 'slowest']),
  top: React.PropTypes.number,
  gender: React.PropTypes.oneOf(['m', 'f']),
}

FastestChildren.defaultProps = {
  direction: 'fastest',
  top: 15,
  gender: 'm'
}
