import React, { Component } from 'react';
import _ from "lodash";

class PlayerInfo extends Component {
  render() {
    const playerAntCounts = _.map(this.props.players, (p) => {
      return (
        <div
          className="PlayerAntCount"
          style={ { background: p.color } }
          key={ p.id }
        >
          <div style={ { textDecoration: "underline" } }>Player { p.id }</div>
          <div>Queens: { p.antCounts.queen || 0 }</div>
          <div>Workers: { p.antCounts.worker || 0 }</div>
        </div>
      );
    });
    return (
      <div className="PlayerAntCounts">
        { playerAntCounts }
      </div>
    );
  }
}

export default PlayerInfo;
