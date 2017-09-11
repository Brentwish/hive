import React, { Component } from 'react';
import "./Pane.css";

class PaneControls extends Component {
  render() {
    return (
      <div className="PaneControls">
        { this.props.children }
      </div>
    );
  }
}

class PaneContent extends Component {
  render() {
    return (
      <div className="PaneContent">
        { this.props.children }
      </div>
    );
  }
}

class Pane extends Component {
  render() {
    return (
      <div className="Pane">
        { this.props.children }
      </div>
    );
  }
}

export {
  PaneContent,
  PaneControls,
  Pane,
}
