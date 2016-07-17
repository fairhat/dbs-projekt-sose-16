import React from 'react'
import Api from 'api'
import { ProgressBar, Grid, Row, Button,
  DropdownButton, MenuItem, FormGroup, InputGroup,
  ControlLabel, FormControl } from 'react-bootstrap'
import DogCard from 'components/DogCard/'
import DogCards from 'components/DogCards/'
import { spring, StaggeredMotion, presets } from 'react-motion'
import { range } from 'lodash'

export default class Predictions extends React.Component {

  state = {
    isLoading: false,
    amount: 12,
    hunde: [],
    styles: {
      top: -100,
    }
  }

  componentWillMount() {
    this.getHunde(this.state.amount)
  }

  getHunde = (amount = this.state.amount) => {
    this.setState({ isLoading: true })
    Api.get('/hund/random?amount=' + amount)
      .then((res) => {
        this.setState({ hunde: res.data, isLoading: false })})
  }

  render() {
    const { isLoading, hunde } = this.state
    return (
      <Grid>
        <Row>
          <FormGroup controlId="amountText">
            <ControlLabel>Neue Hunde aus der Datenbank abrufen</ControlLabel>
            <InputGroup>
              <FormControl type="text" ref="amt" name="amt" defaultValue={this.state.amount} />
              <InputGroup.Button
                componentClass={InputGroup.Button}
                id="input-amount-btn"
                title="Find new random dogs"
                onClick={() => {
                  const amt = document.getElementById('amountText').value
                  this.setState({ amount: amt }, () => this.getHunde())
                }}
                >
                <Button>Find new random dogs</Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
        </Row>
        <Row className="Cards">
          { !isLoading && <DogCards hunde={hunde} amount={this.state.amount} /> }
          { isLoading &&   <ProgressBar className="animated bounceIn" active now={100} label="wird geladen..." />}
        </Row>
      </Grid>
    )
  }
}
