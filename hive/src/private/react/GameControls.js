import React, { Component } from 'react';
import { ButtonToolbar, ToggleButtonGroup, ToggleButton, ButtonGroup, Button } from 'react-bootstrap';

class GameControls extends Component {
  handleSpeedChange = (value) => {
    if (value === "pause") {
      this.props.onPause();
    } else {
      this.props.onSpeedChange(value);
    }
  }
  render() {
    return (
      <ButtonToolbar>
        <ButtonGroup>
          <Button onClick={ this.props.handleStopGame }><span className="glyphicon glyphicon-stop" /></Button>
          <Button onClick={ this.props.handleZoomOut }><span className="glyphicon glyphicon-zoom-out" /></Button>
          <Button onClick={ this.props.handleZoomIn }><span className="glyphicon glyphicon-zoom-in" /></Button>
          <Button onClick={ this.props.handleStep }><span className="glyphicon glyphicon-step-forward" /></Button>
        </ButtonGroup>
        <ToggleButtonGroup type="radio" name="speed" defaultValue={ 10 } onChange={ this.handleSpeedChange }>
          <ToggleButton value={ 10 }>
            <span className="glyphicon glyphicon-chevron-right" />
            <span className="glyphicon glyphicon-chevron-right" />
            <span className="glyphicon glyphicon-chevron-right" />
          </ToggleButton>
          <ToggleButton value={ 100 }>
            <span className="glyphicon glyphicon-chevron-right" />
            <span className="glyphicon glyphicon-chevron-right" />
          </ToggleButton>
          <ToggleButton value={ 1000 }>
            <span className="glyphicon glyphicon-chevron-right" />
          </ToggleButton>
          <ToggleButton value={ "pause" }><span className="glyphicon glyphicon-pause" /></ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup type="checkbox" defaultValue={ [] }>
          <ToggleButton value={1} onChange={ this.props.onToggleTrails }>
            <span className="glyphicon glyphicon-road" />
          </ToggleButton>
        </ToggleButtonGroup>
      </ButtonToolbar>
    );
  }
}

export default GameControls;
