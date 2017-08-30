import React, { Component } from 'react';
import _ from "lodash";

class TileInfo extends Component {
  render() {
    const tile = window.hive.board.getTileFromCoords({ x: this.props.x, y: this.props.y });
    return (
      <div>
        <div style={ { 'text-align': "left", width: "150px", margin: "auto" } }>
          <pre>{ JSON.stringify(_.omitBy(_.omit(tile.toDataHash(), "ant"), (v) => _.isNull(v)), undefined, 2) }</pre>
          <pre>{ tile.ant ? JSON.stringify(_.omitBy(_.omit(tile.ant.toDataHash(), ['adjacentTiles', 'currentTile']), (v) => _.isNull(v)), undefined, 2) : "" }</pre>
        </div>
      </div>
    );
  }
}

export default TileInfo;
