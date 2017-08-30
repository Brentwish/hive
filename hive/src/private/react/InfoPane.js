import React, { Component } from 'react';
import TileInfo from "./TileInfo.js";
import PlayerInfo from "./PlayerInfo.js";

import { Tab, Tabs } from "react-bootstrap";

class InfoPane extends Component {
  constructor(props) {
    super();
    this.state = {
      currentTab: props.activeTab || 1
    };
  }
  handleSelect = (tab) => {
    this.setState({ currentTab: tab});
  }
  render() {
    const playerInfo = (
      <PlayerInfo players={ this.props.players }/>
    );
    let tileInfo;
    if (window.hive && this.props.watchTile) {
      tileInfo = (
        <TileInfo
          x={ this.props.watchTile[0] }
          y={ this.props.watchTile[1] }
        />
      );
    }
    return (
      <div className="InfoPanel">
        <Tabs
          activeKey={ this.state.currentTab }
          onSelect={ this.handleSelect }
        >
          <Tab eventKey={ 1 } title="Player Info">
            { playerInfo }
          </Tab>
          <Tab eventKey={ 2 } title="Tile Info">
            { tileInfo }
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default InfoPane;
