import React, { Component } from 'react';
import "./PlayerInfo.css"
import { keysToTitles, graphTypes } from "../js/constants.js"

import _ from "lodash";
import { Tab, Tabs } from "react-bootstrap";
import { ButtonToolbar, DropdownButton, MenuItem } from "react-bootstrap";
import { LineChart } from "react-easy-chart";

class StatsTable extends Component {
  render() {
    const players = this.props.players;
    return (
      <div className="PlayerTable">
        <table>
          <thead>
            <tr className="PlayerTable Header">
              { 
                _.map(players[0], (counts, type) => { 
                  return (
                    <th key={ type } colSpan={ _.size(counts) }>{ keysToTitles[type] }</th>
                  );
                })
              }
            </tr>
            <tr className="PlayerTable Subheader">
              {
                _.map(_.flatten(_.map(players[0], _.keys)), (type) => {
                  return (
                    <th key={ type } scope="col">{ keysToTitles[type] }</th>
                  );
                })
              }
            </tr>
          </thead>
          <tbody>
            {
              _.map(players, (player) => {
                return (
                  <tr key={ player.identifiers.id }>
                    {
                      _.map(_.flatten(_.map(player, _.values)), (count, key) => {
                        return (
                          <td key={ key }>{ count }</td>
                        );
                      })
                    }
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
}

class Graph extends Component {
  render() {
    return (
      <div className="Graph">
        <div className="GraphButtons">
          <ButtonToolbar>
            <DropdownButton
              title={ this.props.graphType }
              id="dropdown-size-medium"
              onSelect={ this.props.changeGraphType }
            >
            {
              _.map(graphTypes, (type) => {
                return (
                  <MenuItem key={ type } eventKey={ type }>{ type }</MenuItem>
                );
              })
            }
            </DropdownButton>
          </ButtonToolbar>
        </div>
        <div ref={ (d) => this._graphContainer = d } className="GraphContainer">
          <LineChart
            data={ this.props.graph }
            axes
            axisLabels={ { x: 'Ticks', y: this.props.graphType } }
            xTicks={ 10 }
            yDomainRange={ [
              0,
              Math.max(Math.max(...this.props.yVals), 25)
            ] }
            lineColors={ this.props.playerColors }
            width={ 0.9 * this.props.graphDimensions.width }
            height={ 0.9 * this.props.graphDimensions.height }
          />
        </div>
      </div>
    );
  }
}

class PlayerInfo extends Component {
  constructor(props) {
    super();
    this.state = {
      currentTab: props.activeTab || 0,
      currentGraph: "TotalFood",
    };
  }
  componentDidUpdate = (prevProps) => {
    this.props.setGraphDimensions();
  }
  changeGraphType = (newGraph) => {
    this.setState({ currentGraph: newGraph });
  }
  render() {
    const graph = this.props.graphs[this.state.currentGraph];
    return (
      <div className="PlayerInfo">
        <StatsTable
          players={ this.props.players }
        />
        <Graph
          ref={ (g) => this._graph = g }
          graphType={ this.state.currentGraph }
          graph={ graph }
          yVals={ _.map(_.flatten(graph), (pair) => { return pair.y; }) }
          changeGraphType={ this.changeGraphType }
          playerColors={ this.props.graphs.playerColors }
          graphDimensions={ this.props.graphDimensions }
        />
      </div>
    );
  }
}

export default PlayerInfo;
