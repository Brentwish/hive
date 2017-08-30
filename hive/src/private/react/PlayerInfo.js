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
        > { p.antCount } </div>
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
