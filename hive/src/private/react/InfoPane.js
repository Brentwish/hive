import React, { Component } from 'react';
import TileInfo from "./TileInfo.js";
import PlayerInfo from "./PlayerInfo.js";
import HiveConsole from "./HiveConsole.js";
import "./InfoPane.css"

import { Tab, Tabs } from "react-bootstrap";

class InfoPane extends Component {
  constructor(props) {
    super();
    this.state = {
      currentTab: props.activeTab || 1
    };
  }
  handleSelect = (tab) => {
    this.setState({ currentTab: tab });
  }
  render() {
    let playerInfo;
    if (this.state.currentTab === 2) {
      playerInfo = (
        <PlayerInfo
          ref={ (p) => this._playerInfo = p }
          players={ this.props.players }
          graphs={ this.props.graphs }
          graphDimensions={ this.props.graphDimensions }
          setGraphDimensions={ this.props.setGraphDimensions }
        />
      );
    }
    const tileInfo = (
      <TileInfo
        x={ this.props.watchTile[0] }
        y={ this.props.watchTile[1] }
        onTrackAnt={ this.props.onTrackAnt }
        isAntWatched={ this.props.isAntWatched }
      />
    );
    const hiveConsole = (
      <HiveConsole
      />
    );
    return (
      <Tabs className="InfoPane" activeKey={ this.state.currentTab } onSelect={ this.handleSelect } >
        <Tab eventKey={ 1 } title="Hive Console">
          { hiveConsole }
        </Tab>
        <Tab eventKey={ 2 } title="Player Info">
          { playerInfo }
        </Tab>
        <Tab eventKey={ 3 } title="Tile Info">
          { tileInfo }
        </Tab>
      </Tabs>
    );
  }
}

export default InfoPane;
