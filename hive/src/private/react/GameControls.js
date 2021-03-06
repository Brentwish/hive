import React, { Component } from 'react';
import { ButtonToolbar, ToggleButtonGroup, ToggleButton, ButtonGroup, Button } from 'react-bootstrap';
import { PaneControls } from "./Pane.js";
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
      <PaneControls>
        <ButtonToolbar>
          <ButtonGroup className="ButtonPadding">
            <Button bsStyle="danger" onClick={ this.props.handleStopGame }><span className="glyphicon glyphicon-stop" /></Button>
          </ButtonGroup>
          <ButtonGroup className="ButtonPadding">
            <Button onClick={ this.props.onZoomOut }><span className="glyphicon glyphicon-zoom-out" /></Button>
            <Button onClick={ this.props.onZoomIn }><span className="glyphicon glyphicon-zoom-in" /></Button>
          </ButtonGroup>
          <ToggleButtonGroup className="ButtonPadding SpeedControls" type="radio" name="speed" value={ speed } onChange={ this.handleSpeedChange }>
            <ToggleButton value={ 1 }>
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
      </PaneControls>
    );
  }
}

export default GameControls;
