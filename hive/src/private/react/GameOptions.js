import React, { Component } from 'react';
import _ from "lodash";
import "./GameOptions.css"
import { Button, Tabs, Tab, Table } from "react-bootstrap";
import {
  foodGrades,
  MIN_NUM_PLAYERS, MAX_NUM_PLAYERS, MIN_BOARD_WIDTH,
  MAX_BOARD_WIDTH, MIN_BOARD_HEIGHT, MAX_BOARD_HEIGHT
} from "../js/constants.js";

class GameOptions extends Component {
  constructor(props) {
    super();
    this.state = {
      currentTab: props.activeTab || 1
    };
  }
  handleSelect = (tab) => {
    this.setState({ currentTab: tab });
  }
  renderBoardOptions() {
    const gradeOptions = _.map(_.keys(foodGrades), (grade) => {
      return (<option key={ grade } value={ grade }>{ grade }</option>);
    });
    return (
      <div className="GameOptions">
        <div>
          <label>Width: { this.props.width }</label>
          <input
            type="range"
            min={ MIN_BOARD_WIDTH }
            max={ MAX_BOARD_WIDTH }
            step={ 10 }
            value={ this.props.width }
            onChange={ (e) => this.props.changeHandler("width", e.target.value) }
          />
        </div>
        <div>
          <label>Height: { this.props.height }</label>
          <input 
            type="range"
            min={ MIN_BOARD_HEIGHT }
            max={ MAX_BOARD_HEIGHT }
            step={ 10 }
            value={ this.props.height }
            onChange={ (e) => this.props.changeHandler("height", e.target.value) }
          />
        </div>
        <div className="FoodOptions">
          <label>Food options:</label>
          <ul>
            <li>
              <label>Sparsity: </label>
              <select 
                value={ this.props.sparsity }
                onChange={ (e) => this.props.changeHandler("sparsity", e.target.value) }
              >
                { gradeOptions }
              </select>
            </li>
            <li>
              <label>Density: </label>
              <select 
                value={ this.props.density }
                onChange={ (e) => this.props.changeHandler("density", e.target.value) }
              >
                { gradeOptions }
              </select>
            </li>
            <li>
              <label>Saturation: </label>
              <select 
                value={ this.props.saturation }
                onChange={ (e) => this.props.changeHandler("saturation", e.target.value) }
              >
                { gradeOptions }
              </select>
            </li>
          </ul>
        </div>
      </div>
    );
  }
  handleAddPlayer = () => {
    if (this.props.players.length < MAX_NUM_PLAYERS) {
      this.props.onAddPlayer();
    }
  }
  handleRemovePlayer = (index) => {
    if (this.props.players.length > MIN_NUM_PLAYERS) {
      this.props.removePlayer(index);
    }
  }
  renderPlayerTableRow = (player, index) => {
    return (
      <tr>
        <td>
          { index + 1 }
        </td>
        <td>
          <select value={ player } onChange={ (e) => this.props.updatePlayer(index, 'aiId', e.target.value) }>
            { _.map(this.props.AIs, (ai) => <option key={ ai.id } value={ ai.id }>{ ai.name }</option>) }
          </select>
        </td>
        <td>
          <Button onClick={ () => this.handleRemovePlayer(index) } bsSize="xsmall" bsStyle="danger">
            <span className="glyphicon glyphicon-remove"/>
          </Button>
        </td>
      </tr>
    );
  }
  renderPlayersTable = () => {
    return (
      <Table>
        <thead>
          <th>#</th>
          <th>AI</th>
          <th></th>
        </thead>
        <tbody>
          { _.map(this.props.players, this.renderPlayerTableRow) }
        </tbody>
      </Table>
    );
  }
  renderAISelector = () => {
    return (
      <div className="AISelector">
        <Button className="AddPlayerButton" bsStyle="primary" onClick={ this.handleAddPlayer }>Add Player</Button>
        <div style={ { height: "200px", "overflow-y": "scroll" } }>
          { this.renderPlayersTable() }
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className="GameOptionsTabs">
        <Tabs activeKey={ this.state.currentTab } onSelect={ this.handleSelect } animation={ false }>
          <Tab eventKey={ 1 } title="AIs">
            { this.renderAISelector() }
          </Tab>
          <Tab eventKey={ 2 } title="Board">
            { this.renderBoardOptions() }
          </Tab>
        </Tabs>
        <Button bsStyle="success" onClick={ this.props.startGame }>Start</Button>
      </div>
    );
  }
}

export default GameOptions;
