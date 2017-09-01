import React, { Component } from 'react';
import _ from "lodash";
import "./TileInfo.css"
import { capitalize } from "../js/constants.js"

class TileInfo extends Component {
  render() {
    let tileTable;
    let antTable;
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
      }
    }
    return (
      <div className="TileInfo">
        <div className="Panel">
          <div className="Title">Tile</div>
          { tileTable }
        </div>
        <div className="Panel">
          <div className="Title">Ant</div>
          { antTable }
        </div>
      </div>
    );
  }
}

export default TileInfo;
