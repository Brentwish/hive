import React, { Component } from 'react';
import "./HiveConsole.css";
import Console from "react-console-component";
import _ from "lodash";

class HiveConsole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fakeEnv: [],
    }
  }
  componentDidMount = () => {
    setInterval(this.echoLogQueue, 100);
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
    _.delay(this.refs.console.scrollToBottom);
  }
  isEndOfInput = (line) => {
    return line.length > 0 && line[line.length - 1] !== ";";
  }
  echoLogQueue = () => {
    if (!window.hive) {
      return;
    }
    const logQueue = window.hive.consoleLogs || [];
    const console = this.refs.console;
    let log = console.state.log;
    _.forEach(logQueue, (msg) => {
			log.push({
				label: msg.message,
				command: "",
				message: [msg.type],
			});
    });
    console.setState({ log });
    this.refs.console.return();
    this.refs.console.scrollToBottom();
    window.hive.consoleLogs = [];
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
