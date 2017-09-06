import React, { Component } from 'react';
import "./PlayerInfo.css"
import { keysToTitles } from "../js/constants.js"
import { Tab, Tabs } from "react-bootstrap";
import _ from "lodash";

class PlayerInfo extends Component {
  constructor(props) {
    super();
    this.state = {
      currentTab: props.activeTab || 0,
    };
  }
  generatePlayerTabs = () => {
    return _.map(this.props.players, (player) => {
      return (
        <Tab
          key={ player.playerIdentifiers.id }
          eventKey={ player.playerIdentifiers.id }
          title={ player.playerIdentifiers.name }
        >
          { this.generateTable(_.omitBy(player, (v, k) => {
              return k === "playerIdentifiers"
            }))
          }
        </Tab>
      );
    });
  }
  generateTable = (player) => {
    return (
      <table key="PlayerTable">
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
      <table key={ type }>
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
  handleSelect = (tab) => {
    this.setState({ currentTab: tab });
  }
  render() {
    let currentPlayerColor;
    if (this.props.players[this.state.currentTab]) {
      currentPlayerColor = this.props.players[this.state.currentTab].color;
    }
    return (
      <div className="PlayerInfo">
        <Tabs
          className={ "PlayerTabs" }
          style={ { borderLeft: "solid " + currentPlayerColor } }
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
