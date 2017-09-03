import React, { Component } from 'react';
import "./HiveConsole.css";
import Console from "react-console-component";

class HiveConsole extends Component {
  echo = (text) => {
    try {
      this.refs.console.log(eval(text));
    } catch(error) {
      this.refs.console.logX("err", error.message);
    }
    this.refs.console.return();
  }
  render() {
    return (
      <div className="HiveConsole">
        <Console
          ref="console"
          handler={ this.echo }
        />
      </div>
    );
  }
}

export default HiveConsole;
