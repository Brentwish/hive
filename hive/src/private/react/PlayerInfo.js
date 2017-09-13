import React, { Component } from 'react';
import "./PlayerInfo.css"
import { keysToTitles, graphTypes } from "../js/constants.js"

import _ from "lodash";
import { Table, ButtonToolbar, DropdownButton, MenuItem } from "react-bootstrap";
import { LineChart } from "react-easy-chart";

class StatsTable extends Component {
  renderGroupHeader() {
    return (
      <tr>
        <th colSpan={ 2 }>Player</th>
        <th colSpan={ 2 }>Ants</th>
        <th colSpan={ 2 }>Combat</th>
        <th colSpan={ 2 }>Food</th>
      </tr>
    );
  }
  renderRowHeaders() {
    return (
      <tr>
        <th>Name</th>
        <th>Color</th>
        <th>Queens</th>
        <th>Workers</th>
        <th>Dead</th>
        <th>Killed</th>
        <th>Total</th>
        <th>Current</th>
      </tr>
    );
  }
  renderPlayerRow(player) {
    return (
      <tr key={ player.identifiers.id }>
        <td>{ player.identifiers.name }</td>
        <td><div
          className="colorDiv"
          style={ { backgroundColor: player.identifiers.color } }
        /></td>

        <td>{ player.antCounts.numQueens }</td>
        <td>{ player.antCounts.numWorkers }</td>

        <td>{ player.combatCounts.numDead }</td>
        <td>{ player.combatCounts.numKilled }</td>

        <td>{ player.foodCounts.currentFood }</td>
        <td>{ player.foodCounts.totalFood }</td>
      </tr>
    );
  }
  render() {
    const players = this.props.players;
    return (
      <div className="PlayerTable">
        <Table striped bordered hover>
          <thead>
            { this.renderGroupHeader() }
            { this.renderRowHeaders() }
          </thead>
          <tbody>
            { _.map(players, this.renderPlayerRow) }
          </tbody>
        </Table>
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
