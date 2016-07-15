import React from 'react'
import Api from 'api'
import { Col, Panel, Table } from 'react-bootstrap'

export default class FastestDogs extends React.Component {
  static propTypes = {
    direction: React.PropTypes.oneOf(['fastest', 'slowest']),
    top: React.PropTypes.number,
  }

  static defaultProps = {
    direction: 'fastest',
    top: 15,
  }

  state = {
    isLoading: false,
    dogs: []
  }

  getHunde = () => {
    this.setState({ isLoading: true })
    const direction = this.props.direction === 'fastest' ? -1 : 1
    Api.get('/hund/races', {
      params: {
        page: 0,
        itemsPerPage: this.props.top,
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
    return (
      <Col md={12} className="animated bounceInUp">
        <Panel header={`Die ${direction} ${top} Hunde`} bsStyle="danger">
          <span>Enthält <b>alle</b> Hunde</span>
          <hr />
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>Beste Punktzahl</th>
                <th>Hund</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.dogs.map((dog, index) => (
                  <tr key={index}>
                    <td>{dog.best}</td>
                    <td>{dog.name}</td>
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
