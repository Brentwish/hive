import React, { Component } from 'react';
import "./PlayerInfo.css"
import { keysToTitles } from "../js/constants.js"

import _ from "lodash";
import { Tab, Tabs } from "react-bootstrap";
import { LineChart } from "react-easy-chart";

class PlayerInfo extends Component {
  constructor(props) {
    super();
    this.state = {
      currentTab: props.activeTab || 0,
    };
  }
  generatePlayerTabs = () => {
    return _.map(this.props.players, (player) => {
      const playerWithoutIdentifiers = _.omitBy(player, (v, k) => {
        return k === "playerIdentifiers";
      })
      return (
        <Tab
          key={ player.playerIdentifiers.id }
          eventKey={ player.playerIdentifiers.id }
          title={ player.playerIdentifiers.name }
        >
          { this.generateTable(playerWithoutIdentifiers) }
          { this.generateLineGraph() }
        </Tab>
      );
    });
  }
  generateTable = (player) => {
    return (
      <table className="PlayerTable" key="PlayerTable">
        <tbody>
          { _.map(player, (counts, type) => {
              return (
                <tr key={ type }>
                  <td key={ type + "_title" }>{ keysToTitles[type] }</td>
                  <td key={ type + "_table" }>
                    { this.generateInnerTable(type, counts) }
                  </td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    );
  }
  generateInnerTable = (type, counts) => {
    return (
      <table className="InnerTables" key={ type }>
        <tbody>
          { _.map(counts, (v, k) => {
              return (
                <tr key={ k }>
                  <td key={ k + "_title" }>{ keysToTitles[k] }</td>
                  <td key={ k + "_value" }>{ v }</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    );
  }
  generateLineGraph = () => {
    if (this.props.graphs && this.props.currentGraph) {
      const currentGraph = this.props.currentGraph;
      const graph = this.props.graphs[currentGraph];
      const yVals = _.map(_.flatten(graph), (pair) => { return pair.y; });
      return (
        <LineChart
          data={ graph }
          axisLabels={ { x: 'Ticks', y: currentGraph } }
          lineColors={ this.props.graphs.playerColors }
          style={ { width: "100%", height: "100%" } }
          width={ 500}
          height={ 250 }
          xTicks={ 10 }
          yDomainRange={ [
            0,
            Math.max(Math.max(...yVals), 25)
          ] }
          axes={ true }
        />
      );
    }
  }
  handleSelect = (tab) => {
    this.setState({ currentTab: tab });
  }
  render() {
    let currentPlayerColor;
    if (this.props.players[this.state.currentTab]) {
      currentPlayerColor = this.props.players[this.state.currentTab].playerIdentifiers.color;
    }
    return (
      <div className="PlayerInfo">
        <Tabs
          className={ "PlayerTabs" }
          style={ { border: "solid " + currentPlayerColor } }
          stacked={ true }
          activeKey={ this.state.currentTab }
          onSelect={ this.handleSelect }
        >
          { this.generatePlayerTabs() }
        </Tabs>
      </div>
    );
  }
}

export default PlayerInfo;
