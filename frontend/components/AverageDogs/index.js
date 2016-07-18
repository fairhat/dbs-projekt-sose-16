import React from 'react'
import Api from 'api'
import { Col, Panel, Table } from 'react-bootstrap'

/**
 * @name AverageDogs
 * @class
 * @desc Calculates average dogs
 */
export default class AverageDogs extends React.Component {

  constructor(props) {
    super(props)
    this.getHunde = this.getHunde.bind(this)

    this.state = {
      isLoading: false,
      dogs: []
    }
  }

  /**
   * @desc fetch dogs from api
   */
  getHunde() {
    this.setState({ isLoading: true })
    const direction = this.props.direction === 'fastest' ? -1 : 1
    Api.get('/hund/average', {
      params: {
        page: 0,
        itemsPerPage: this.props.top,
        top: this.props.top,
        direction
      }
    }).then((res) => {
      this.setState({ dogs: res.data, isLoading: false })
    })
  }

  /**
   * @desc fetch dogs on mount
   */
  componentDidMount() {
    this.getHunde()
  }

  render() {
    const direction = this.props.direction === 'fastest' ? 'höchsten' : 'niedrigsten'
    const top = this.props.top
    return (
      <Col md={12} className="animated bounceInUp">
        <Panel header={`${top} Hunde mit der ${direction} durchschnittlichen Punktzahl.`} bsStyle="danger">
          <span>Enthält <b>alle</b> Hunde.</span>
          <hr />
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>Durchschnittliche Punktzahl</th>
                <th>Hund</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.dogs.map((dog, index) => (
                  <tr key={index}>
                    <td>{dog.average}</td>
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

AverageDogs.propTypes = {
  direction: React.PropTypes.oneOf(['fastest', 'slowest']),
  top: React.PropTypes.number,
}

AverageDogs.defaultProps = {
  direction: 'fastest',
  top: 15
}
