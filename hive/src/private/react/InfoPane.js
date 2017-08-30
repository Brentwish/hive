import React, { Component } from 'react';
import TileInfo from "./TileInfo.js";
import PlayerInfo from "./PlayerInfo.js";

class InfoPane extends Component {
  render() {
    let tileInfo;
    if (window.hive && this.props.watchTile) {
      tileInfo = (
        <TileInfo
          x={ this.props.watchTile[0] }
          y={ this.props.watchTile[1] }
        />
      );
    }
    const playerInfo = <PlayerInfo players={ this.props.players }/>;
    return (
      <div className="InfoPanel">
        { playerInfo }
        { tileInfo }
      </div>
    );
  }
}

export default InfoPane;
