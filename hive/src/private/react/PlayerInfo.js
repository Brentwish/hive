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
      graphDimensions: { width: 0, height: 0 },
    };
  }
  componentDidUpdate = (prevProps) => {
    this.props.setGraphDimensions();
  }
  generatePlayerTabs = () => {
    return _.map(this.props.players, (player) => {
      const playerWithoutIdentifiers = _.omitBy(player, (v, k) => {
        return k === "playerIdentifiers";
      })
      let lineGraph;
      if (this.state.currentTab === player.playerIdentifiers.id) {
        lineGraph = this.generateLineGraph();
      }
      return (
        <Tab
          key={ player.playerIdentifiers.id }
          eventKey={ player.playerIdentifiers.id }
          title={ player.playerIdentifiers.name }
        >
          { this.generateTable(playerWithoutIdentifiers) }
          { lineGraph }
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
        <div ref={ (d) => this._graphContainer = d } className="LineGraph">
          <LineChart
            data={ graph }
            axes={ true }
            axisLabels={ { x: 'Ticks', y: currentGraph } }
            xTicks={ 10 }
            yDomainRange={ [
              0,
              Math.max(Math.max(...yVals), 25)
            ] }
            lineColors={ this.props.graphs.playerColors }
            width={ this.props.graphDimensions.width }
            height={ this.props.graphDimensions.height }
          />
        </div>
      );
    }
  }
  handleSelect = (tab) => {
    this.props.setGraphDimensions();
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
