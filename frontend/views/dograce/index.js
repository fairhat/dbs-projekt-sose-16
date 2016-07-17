import React from 'react'
import Api from 'api'
import { Col, ProgressBar, Grid, Row, Button,
  DropdownButton, MenuItem, FormGroup, InputGroup,
  ControlLabel, FormControl } from 'react-bootstrap'
import Chart, { Line } from 'react-chartjs'
import { flatten, pick, uniq, uniqBy, sortBy } from 'lodash'
import ChartJS from 'chart.js'
const interpolate = require('interpolating-polynomial')

export default class DogRace extends React.Component {

  state = {
    isLoading: false,
    amount: 10,
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    data: [
      12, 9, 7, 8, 5, 4, 6, 2, 3, 3, 4, 6,
      4,  5, 3, 7, 3, 5, 5, 3, 4, 4, 5, 5,
      5,  3, 4, 5, 6, 3, 3, 4, 5, 6, 3, 4,
      3,  4, 5, 6, 7, 6, 4, 5, 6, 7, 6, 3
    ],
    delays: 80,
    duration: 500,
    hunde: [],
    races: [],
    render: 0,
    calculatedSixteen: false,
    calculatedSeventeen: false,
    year: 2016,
  }

  componentWillMount() {
    this.getHunde(this.state.amount)
  }

  getHunde = (amount = this.state.amount) => {
    this.setState({ isLoading: true, calculatedSixteen: false, calculatedSeventeen: false })
    Api.get('/hund/random', {
      params: {
        amount,
        maxAge: 96
      }
    })
      .then((res) => {
        this.calculateDogRankings(res.data)
        this.startRace()
      })
  }

  startRace(year = this.state.year) {
    this.getYear(year)
    this.setState({ year: year + 1 })
    this.timer = setTimeout(() => this.startRace(year + 1), 5000)
  }

  static randomColor = () => '#' + ('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6)

  calculateDogRankings = (_hunde = this.state.hunde) => {
    const hundeRennen = _hunde.map((hund, index) => ({
      label: hund.name,
      data: sortBy(uniqBy(hund.rennen, 'jahr').map((r) => {
        const { name } = hund
        const ergebnisse = hund.ergebnisse.filter(e => e.rennen == r.rid)
        const ergebnis = ergebnisse.reduce((prev, curr, i, acc) => {
          const laeufe = curr.laeufe === 0 ? 1 : curr.laeufe
          const punkte = typeof curr.result !== 'undefined' ? curr.result : Math.round(curr.punkte / curr.laeufe)
          return prev + punkte
        }, 0)
        const result = ({ y: ergebnis, x: r.jahr, name })
        return result
      }), 'x'),
      borderColor: this.state.races[index] ? this.state.races[index].borderColor : DogRace.randomColor(),
      backgroundColor: 'rgba(125,125,125, .3)'
    }))

    const hunde = _hunde.map((h, i) => {
      h.racingTableData = hundeRennen[i].data
      return h
    })

    const labels = uniq(flatten(hundeRennen.map(h => h.data)).map(d => d.x))
    this.setState({ races: hundeRennen, labels, isLoading: false, hunde: hunde }, () => this.renderChart())
  }

  renderChart = () => {
    const ctx = document.getElementById('dogracechart').getContext('2d')

    if (this.chart) {
      this.chart.data.datasets = this.state.races
      this.chart.update()
    } else {
      this.chart = new ChartJS(ctx, {
        type: 'line',
        data: {
          datasets: this.state.races
        },
        options: {
          responsive: true,
          scales: {
            xAxes: [
              {
                type: 'linear',
                position: 'bottom',
                ticks: {
                  stepSize: 1,
                }
              }
            ]
          }
        }
      })
    }
  }

  getYear = (year = 2016, _dogs = this.state.races) => {
    const hunde = this.state.hunde.map((hund) => {
      if (hund.racingTableData) {
        const data = sortBy(hund.racingTableData.map(({ x, y }) => ([x, y])), '0')
        const f = interpolate(data)
        const runInYear = f(year)
        const res = !isNaN(runInYear) && runInYear >= 0 ? runInYear : 0
        const result = res <= 40 ? res : 40
        const runId = Math.random()
        const rennen = ({ rid: runId, jahr: year })
        const ergebnis = ({ eid: Math.random, hund: hund.hid, rennen: runId, result })
        hund.ergebnisse.push(ergebnis)
        hund.rennen.push(rennen)
      }

      return hund
    })

    this.calculateDogRankings(hunde)

    return hunde
  }

  componentWillUnmount() {
    this.chart.destroy()
    this.chart = null
    clearTimeout(this.timer)
  }

  render() {
    const treten = this.state.amount === 1 ? 'tritt' : 'treten'
    const hunde = this.state.amount === 1 ? 'Hund' : 'Hunde'
    const gegeneinander = this.state.amount === 1 ? '' : 'gegeneinander'
    const dataSets = {
      datasets: this.state.races
    }
    return (
      <Grid>
        <Row>
          <Col md={12}>
            <h2>Virtuelles Hunderennen</h2>
            <span>Es {treten} <b>{this.state.amount}</b> {hunde} {gegeneinander} an.</span>
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
            <canvas id="dogracechart"></canvas>
          </Col>
          <Col md={6}>
            <Button onClick={() => { this.getYear(2016); this.setState({ calculatedSixteen: true }) }} type="button" disabled={this.state.calculatedSixteen} bsStyle="danger">2016 berechnen</Button>
            <Button onClick={() => { this.getYear(2017); this.setState({ calculatedSeventeen: true }) }} type="button" disabled={this.state.calculatedSeventeen} bsStyle="danger">2017 berechnen</Button>
            <hr />
          </Col>
        </Row>
      </Grid>
    )
  }
}
