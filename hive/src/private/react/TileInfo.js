import React, { Component } from 'react';
import _ from "lodash";
import "./TileInfo.css"
import { capitalize } from "../js/constants.js"
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap";

class TileInfo extends Component {
  render() {
    let tileTable;
    let antTable;
    let watchAntButtonGroup;
    if (this.props.x && this.props.y) {
      const tile = window.hive.board.getTileFromCoords({
        x: this.props.x,
        y: this.props.y
      });

      if (tile) {
        const trailTable = (
          <table className="innerTable">
            { _.map(tile.trails || [], (v, k) => { return <tr key={ k }><td>{ k }</td><td>{ v }</td></tr>; }) }
          </table>
        );
        const tileInfo = {
          "Type": capitalize(tile.type),
          "Food": tile.food || "0",
          "Trails": (_.isEmpty(tile.trails) ? "None" : trailTable),
        };
        tileTable = (
          <table className="outerTable">
            { _.map(tileInfo, (v, k) => { return <tr key={ k }><td>{ k }</td><td>{ v }</td></tr>; }) }
          </table>
        );
      }

      if (tile.ant) {
        const ant = tile.ant;
        const movesTable = (
          <table className="innerTable">
            { _.map(ant.moves, (v, k) => { return <tr key={ k }><td>{ k }</td><td>{ v }</td></tr>; }) }
          </table>
        );
        const antInfo = {
          "Owner": ant.owner.id,
          "Type": capitalize(ant.type),
          "Food": ant.food,
          "Health": ant.health,
          "Age": ant.age,
          "Moves": movesTable,
        };
        antTable = (
          <table className="outerTable">
            { _.map(antInfo, (v, k) => { return <tr key={ k }><td>{ k }</td><td>{ v }</td></tr>; }) }
          </table>
        );
        watchAntButtonGroup = (
          <ToggleButtonGroup className="badge" type="checkbox" defaultValue={ [] }>
            <ToggleButton className="badge" value={ 1 } checked={ this.props.isAntWatched } onChange={ this.props.onTrackAnt }>
              <span className="glyphicon glyphicon-chevron-right" />
            </ToggleButton>
          </ToggleButtonGroup>
        );
      }
    }
    return (
      <div className="TileInfo">
        <div className="Panel">
          <div className="Title">Tile</div>
          { tileTable }
        </div>
        <div className="Panel">
          { watchAntButtonGroup }
          <div className="Title">
            Ant
          </div>
          { antTable }
        </div>
      </div>
    );
  }
}

export default TileInfo;
