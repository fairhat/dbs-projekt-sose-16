import React from 'react'
import Api from 'api'
import { Col, ProgressBar, Grid, Row, Button,
  DropdownButton, MenuItem, FormGroup, InputGroup,
  ControlLabel, FormControl } from 'react-bootstrap'
import Chart, { Line } from 'react-chartjs'
import { flatten } from 'lodash'

export default class DogRace extends React.Component {

  state = {
    isLoading: false,
    amount: 10,
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    data: [
      [12, 9, 7, 8, 5, 4, 6, 2, 3, 3, 4, 6],
      [4,  5, 3, 7, 3, 5, 5, 3, 4, 4, 5, 5],
      [5,  3, 4, 5, 6, 3, 3, 4, 5, 6, 3, 4],
      [3,  4, 5, 6, 7, 6, 4, 5, 6, 7, 6, 3]
    ],
    delays: 80,
    duration: 500,
    hunde: [],
    render: 0,
  }

  componentWillMount() {
    this.getHunde(this.state.amount)
  }

  getHunde = (amount = this.state.amount) => {
    this.setState({ isLoading: true })
    Api.get('/hund/random', {
      params: {
        amount,
        maxAge: 96
      }
    })
      .then((res) => {
        this.setState({ hunde: res.data, isLoading: false }, () => this.calculateDogRankings())
      })
  }

  calculateDogRankings = () => {
    const hunde = this.state.hunde.map((hund) => hund.ergebnisse.map(({...e}) => {
      const rennenErgebnis = hund.ergebnisse.
      return { ...e, ...hund, ...(...hund.rennen) }
    }))

    console.log(hunde)
  }

  render() {
    const treten = this.state.amount === 1 ? 'tritt' : 'treten'
    const hunde = this.state.amount === 1 ? 'Hund' : 'Hunde'
    const against = this.state.amount === 1 ? '' : 'gegeneinander'

    return (
      <Grid>
        <Row>
          <Col md={12}>
            <h2>Virtuelles Hunderennen</h2>
            <span>Es {treten} <b>{this.state.amount}</b> {hunde} {against} an.</span>
            <form onSubmit={(e) => (e.preventDefault() || 1) && this.setState({ amount: parseInt(document.getElementById('amountText').value, 10) }, () => this.getHunde())}>
              <FormGroup controlId="amountText">
                <ControlLabel>Neue Hunde aus der Datenbank abrufen</ControlLabel>
                <InputGroup>
                  <FormControl type="text" ref="amt" name="amt" defaultValue={this.state.amount} />
                  <InputGroup.Button
                    componentClass={InputGroup.Button}
                    id="input-amount-btn"
                    title="Find new random dogs"
                    >
                    <Button type="submit">Rennen Starten!</Button>
                  </InputGroup.Button>
                </InputGroup>
              </FormGroup>
            </form>
          </Col>
          <Col md={12}>
            <div id="racechart"></div>
          </Col>
        </Row>
      </Grid>
    )
  }
}
