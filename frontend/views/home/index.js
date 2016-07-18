import React from 'react'
import { Grid, Row } from 'react-bootstrap'
import FastestDogs from 'components/FastestDogs/'
import FastestChildren from 'components/FastestChildren/'
import AverageDogs from 'components/AverageDogs/'

export default class Home extends React.Component {

  render() {
    return (
      <Grid>
        <Row>
          <FastestDogs top={10} direction="fastest" />
          <FastestChildren top={10} direction="fastest" />
          <AverageDogs top={10} direction="slowest" />
          <FastestChildren top={10} direction="slowest" gender="f" />
          <AverageDogs top={15} direction="fastest" />
          <FastestDogs top={10} direction="slowest" />
        </Row>
      </Grid>
    )
  }
}
