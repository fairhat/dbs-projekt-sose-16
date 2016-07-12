import React from 'react'
import { Col, Panel, Row } from 'react-bootstrap'
import Chart, { Line } from 'react-chartjs'


export default class DogCard extends React.Component {

  state = {
    labels: [],
    placements: []
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.empty) {
      const dog = this.props
      const ergebnisWithYears = dog.ergebnisse.map((e) => {
        const run = dog.rennen.filter(r => r.rid == e.rennen)[0]
        const year = run ? run.jahr : null
        e.year = year
        return e
      })
      console.log(ergebnisWithYears.filter(e => !e.year))
      const sortedRuns = ergebnisWithYears.sort((a, b) => {
        if (a.year > b.year) return 1
        if (a.year < b.year) return -1
        return 0
      })
      const ergebnisLabels = sortedRuns.map(e => e.year)
      const mergeYearRun = ergebnisLabels.map((jahr) => {
        const run = sortedRuns.find(r => r.year == jahr)

        return { jahr, rang: run.rang }
      })

      const placements = mergeYearRun.map(r => r.rang)
      this.setState({ labels: ergebnisLabels, placements })
    }

  }

  render() {
    if (this.props.empty) {
      return (
        null
      )
    }
    const dog = this.props
    const vater = dog.vater ? dog.vater.name : 'Unbekannt'
    const mutter = dog.mutter ? dog.mutter.name : 'Unbekannt'
    const zwinger = dog.zwinger ? dog.zwinger.name : 'Unbekannt'
    const showChart = this.props.showChart

    const dataSets = [
      {
        label: 'Dograce',
        fill: false,
        lineTension: 0.1,
        data: this.state.placements
      }
    ]

    return (
      <div style={this.props.style}>
        <Col md={4}>
          <Panel header={`Name: ${this.props.name}`} bsStyle="info">
            <hr />
            <h4>Daten</h4>
            <Row>
              <Col md={6}>ID</Col><Col md={6}>{dog.hid}</Col>
              <Col md={6}>Aufenthalt</Col><Col md={6}>{dog.aufenthaltsland}</Col>
              <Col md={6}>Geburtsland</Col><Col md={6}>{dog.geburtsland}</Col>
              <Col md={6}>Alter</Col><Col md={6}>{dog.geburtsjahr}</Col>
              <Col md={6}>Vater</Col><Col md={6}>{vater}</Col>
              <Col md={6}>Mutter</Col><Col md={6}>{mutter}</Col>
              <Col md={6}>Zwinger</Col><Col md={6}>{zwinger}</Col>
            </Row>
            <hr />
            <h4>Platzierungen (mit Prognose)</h4>
            {
              showChart && (
                <Line
                  width="300"
                  data={{
                    labels: this.state.labels,
                    datasets: dataSets
                  }}
                  options={{
                    scales: {
                        xAxes: [{
                            type: 'linear',
                            position: 'bottom'
                        }]
                    }
                  }} />
              )
            }
            { !showChart && 'Wird geladen...'}
            <hr />
          </Panel>
        </Col>
      </div>
    )
  }
}
