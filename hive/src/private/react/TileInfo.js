import React, { Component } from 'react';
import _ from "lodash";
import "./TileInfo.css"
import { capitalize } from "../js/constants.js"

class TileInfo extends Component {
  render() {
    let tileDiv = [
      <h3>Tile</h3>
    ];
    let antDiv = [
      <h3>Ant</h3>
    ];

    if (this.props.x && this.props.y) {
      const tile = window.hive.board.getTileFromCoords({
        x: this.props.x,
        y: this.props.y
      });
      const tileHash = tile.toDataHash();
      const trailElements = (
        <ul>{
          _.map(tileHash.trails, (strength, name) => {
            return (<li>{ name }: { strength }</li>);
          })
        }</ul>
      );
      tileDiv.push(<span>Tile type: { capitalize(tileHash.type) }</span>);
      tileDiv.push(<span>Food: { tileHash.food || "0" }</span>);
      tileDiv.push(<span>Trails: { trailElements }</span>);

      const ant = tile.ant ? tile.ant.toDataHash() : null;
      if (ant) {
        antDiv.push(<span>Owner: { ant.ownerId }</span>);
        antDiv.push(<span>Ant type: { capitalize(ant.type) }</span>);
        antDiv.push(<span>Food: { ant.carryingAmount }</span>);
        antDiv.push(<span>Moves:
          <ul>{
            _.map(ant.moves, (n, dir) => {
              return (<li>{ dir }: { n }</li>);
            })
          }</ul>
        </span>);
        antDiv.push(<span>Health: { ant.health }</span>);
        antDiv.push(<span>Age: { ant.age }</span>);
      } else {
        antDiv.push(<h5>None</h5>);
      }
    } else {
      tileDiv.push(<h5>None</h5>);
      antDiv.push(<h5>None</h5>);
    }
    return (
      <div className="TileInfoContainer">
        <div>{ tileDiv }</div>
        <div>{ antDiv }</div>
      </div>
    );
  }
}

export default TileInfo;
