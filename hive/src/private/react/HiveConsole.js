import React, { Component } from 'react';
import "./HiveConsole.css";
import Console from "react-console-component";

class HiveConsole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fakeEnv: [],
    }
  }
  componentDidUpdate = () => {
    this.refs.console.scrollToBottom();
  }
  echo = (text) => {
    try {
      const newEnv = this.state.fakeEnv.concat([text])
      this.refs.console.log(eval(newEnv.join(";")));
      this.setState({ fakeEnv: newEnv });
    } catch(error) {
      this.refs.console.logX("err", error.message);
    }
    this.refs.console.return();
  }
  isEndOfInput = (line) => {
    return line.length > 0 && line[line.length - 1] !== ";";
  }
  render() {
    return (
      <div className="HiveConsole">
        <Console
          ref="console"
          handler={ this.echo }
          continue={ this.isEndOfInput }
        />
      </div>
    );
  }
}

export default HiveConsole;
