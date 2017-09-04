import React, { Component } from 'react';
import { ButtonToolbar, ToggleButtonGroup, ToggleButton, ButtonGroup, Button } from 'react-bootstrap';
import "./GameControls.css";

class GameControls extends Component {
  handleSpeedChange = (value) => {
    if (value === "pause") {
      this.props.onPause();
    } else {
      this.props.onSpeedChange(value);
    }
  }
  render() {
    const speed = this.props.isPaused ? "pause" : this.props.gameSpeed;
    return (
      <div className="GameControls">
        <ButtonToolbar>
          <ButtonGroup className="ButtonPadding">
            <Button onClick={ this.props.handleStopGame }><span className="glyphicon glyphicon-stop" /></Button>
          </ButtonGroup>
          <ButtonGroup className="ButtonPadding">
            <Button onClick={ this.props.handleZoomOut }><span className="glyphicon glyphicon-zoom-out" /></Button>
            <Button onClick={ this.props.handleZoomIn }><span className="glyphicon glyphicon-zoom-in" /></Button>
          </ButtonGroup>
          <ToggleButtonGroup className="ButtonPadding SpeedControls" type="radio" name="speed" value={ speed } onChange={ this.handleSpeedChange }>
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
          <ButtonGroup className="ButtonPadding">
            <Button onClick={ this.props.handleStep }><span className="glyphicon glyphicon-step-forward" /></Button>
          </ButtonGroup>
          <ToggleButtonGroup className="ButtonPadding" type="checkbox" defaultValue={ [] }>
            <ToggleButton value={1} onChange={ this.props.onToggleTrails }>
              <span className="glyphicon glyphicon-road" />
            </ToggleButton>
          </ToggleButtonGroup>
        </ButtonToolbar>
      </div>
    );
  }
}

export default GameControls;
