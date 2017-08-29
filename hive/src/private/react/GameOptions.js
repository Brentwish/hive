import React, { Component } from 'react';
import _ from "lodash";
import {
  foodGrades,
  MIN_NUM_PLAYERS, MAX_NUM_PLAYERS, MIN_BOARD_WIDTH,
  MAX_BOARD_WIDTH, MIN_BOARD_HEIGHT, MAX_BOARD_HEIGHT
} from "../js/constants.js";

class GameOptions extends Component {
  render() {
    const gradeOptions = _.map(_.keys(foodGrades), (grade) => {
      return (<option key={ grade } value={ grade }>{ grade }</option>);
    });
    return (
      <div>
        <div>
          <label>Width: { this.props.width }</label>
          <input
            type="range"
            min={ MIN_BOARD_WIDTH }
            max={ MAX_BOARD_WIDTH }
            step={ 10 }
            value={ this.props.width }
            onChange={ (e) => this.props.changeHandler(e.target.value, "width") }
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
            onChange={ (e) => this.props.changeHandler(e.target.value, "height") }
          />
        </div>
        <div>
          <label>Number of Players: { this.props.numPlayers }</label>
          <input 
            type="range"
            min={ MIN_NUM_PLAYERS }
            max={ MAX_NUM_PLAYERS }
            value={ this.props.numPlayers }
            onChange={ (e) => this.props.changeHandler(e.target.value, "numPlayers") }
          />
        </div>
        <div>
          <label>Sparsity: </label>
          <select 
            value={ this.props.sparsity }
            onChange={ (e) => this.props.changeHandler(e.target.value, "sparsity") }
          >
            { gradeOptions }
          </select>

          <label>Density: </label>
          <select 
            value={ this.props.density }
            onChange={ (e) => this.props.changeHandler(e.target.value, "density") }
          >
            { gradeOptions }
          </select>

          <label>Saturation: </label>
          <select 
            value={ this.props.saturation }
            onChange={ (e) => this.props.changeHandler(e.target.value, "saturation") }
          >
            { gradeOptions }
          </select>
        </div>
      </div>
    );
  }
}

export default GameOptions;
