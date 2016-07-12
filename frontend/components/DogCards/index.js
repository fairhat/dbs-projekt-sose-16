import React from 'react'
import DogCard from 'components/DogCard/'
import { spring, StaggeredMotion, presets } from 'react-motion'
import { range } from 'lodash'

export default class DogCards extends React.Component {
  static propTypes = {
    hunde: React.PropTypes.array
  }

  state = {
    top: -100,
    opacity: 0,
    direction: 0,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hunde !== this.props.hunde) {
      this.setState({ direction: -100 })

      setTimeout(() => {
        this.setState({ direction: 0 })
      })
    }
  }

  getStyles(prevStyles) {
    const endValue = prevStyles.map((_, index) => {
      const prev = prevStyles[index - 1] || { top: 0 }
      const other = { top: spring(prev, presets.gentle) }
      return index === 0
       ? this.state
       : other
    })
    return endValue
  }

  render() {
    const hunde = this.props.hunde
    const nextStyles = (prevStyles) => {
      return prevStyles.map((prev, i) => {
        if (i === 0) {
          if (this.state.direction === 0) {
            return { top: spring(0), opacity: spring(1, presets.stiff) }
          } else {
            return { top: spring(-100), opacity: spring(0, presets.stiff) }
          }
        } else {
          const lastCard = prevStyles[i - 1].top
          const Card = prevStyles[i]
          // const direction =
          if (this.state.direction === 0) {
            return lastCard >= -50 ? { top: spring(0, presets.wobbly), opacity: spring(1, presets.stiff) } : Card
          }
          return lastCard <= -50 ? { top: spring(-100, presets.wobbly), opacity: spring(0, presets.stiff) } : Card
        }
      })
    }
    return (
      <StaggeredMotion
        defaultStyles={range(this.props.amount).map(() => ({ top: -100, opacity: 0 }))}
        styles={nextStyles}>
        {
          hundeTransition => {
            return (
            <div>
              {hundeTransition.map(({ top, opacity }, index) => {
                const dog = hunde[index]
                if (dog) {
                  return (<DogCard showChart={top === 0} key={index} {...dog} style={{
                    transform: `translateY(${top}px)`,
                    opacity,
                    zIndex: hunde.length - index,
                  }} />)
                } else return <DogCard empty key={index}/>
              })}
            </div>
          )}
        }
      </StaggeredMotion>
    )
  }
}
