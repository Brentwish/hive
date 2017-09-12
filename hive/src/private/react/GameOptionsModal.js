import React, { Component } from 'react';
import { Modal, Button, Tabs, Tab, Table } from 'react-bootstrap';
import GameOptions from "./GameOptions.js";
import _ from "lodash";
import {
  foodGrades,
  MIN_NUM_PLAYERS, MAX_NUM_PLAYERS, MIN_BOARD_WIDTH,
  MAX_BOARD_WIDTH, MIN_BOARD_HEIGHT, MAX_BOARD_HEIGHT
} from "../js/constants.js";

class GameOptionsModal extends Component {
  onStart = () => {
    this.props.startGame();
    this.props.close();
  }
  render() {
    return (
      <Modal className="GameOptionsModal" show={ this.props.showModal } onHide={ this.props.close }>
        <Modal.Header closeButton>
          <Modal.Title>Game Options</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <GameOptions
            width={ this.props.width }
            height={ this.props.height }
            sparsity={ this.props.sparsity }
            density={ this.props.density }
            saturation={ this.props.saturation }
            changeHandler={ this.props.changeHandler }
            startGame={ this.props.startGame }
            players={ this.props.players }
            AIs={ this.props.AIs }
            onAddPlayer={ this.props.onAddPlayer }
            removePlayer={ this.props.removePlayer }
            updatePlayer={ this.props.updatePlayer }
          />
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="success" onClick={ this.onStart }>Start</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default GameOptionsModal;
