import React, { Component } from 'react';
import "./AIManagerModal.css";
import { Modal, Button, Table } from 'react-bootstrap';
import _ from "lodash";

class AIManagerModal extends Component {
  validateName = (ai) => {
    const otherAINames = _.map(_.values(_.omit(this.props.AIs, ai.id)), "name");
    if (_.includes(otherAINames, ai.name)) {
      let i = 1;
      while (_.includes(otherAINames, `${ai.name} (${i})`)) {
        i++;
      }
      this.props.updateAI(ai.id, 'name', `${ai.name} (${i})`);
    }
  }
  generateAITableRow = (ai) => {
    return (
      <tr>
        <td className="centered">
          <Button bsStyle="primary" onClick={ () => this.props.selectAI(ai.id) }>
            <span className="glyphicon glyphicon-folder-open"/>
          </Button>
        </td>
        <td className="name">
          <input
            value={ ai.name }
            onChange={ (e) => this.props.updateAI(ai.id, 'name', e.target.value) }
            onBlur={ (e) => this.validateName(ai) }
          />
        </td>
        <td className="centered">
          <Button bsStyle="danger" onClick={ () => this.props.deleteAI(ai.id) }>
            <span className="glyphicon glyphicon-trash"/>
          </Button>
        </td>
      </tr>
    );
  }
  generateAITable = () => {
    return (
      <Table>
        <thead>
          <th className="centered">Edit</th>
          <th className="name">AI Name</th>
          <th className="centered">Delete</th>
        </thead>
        <tbody>
          { _.map(this.props.AIs, this.generateAITableRow) }
          <tr><td>
            <Button bsStyle="success" onClick={ this.props.addAI }>
              <span className="glyphicon glyphicon-plus"/>
            </Button>
          </td></tr>
        </tbody>
      </Table>
    );
  }
  render() {
    return (
      <Modal className="AIManagerModal" show={ this.props.showModal } onHide={ this.props.close }>
        <Modal.Header closeButton>
          <Modal.Title>AI Manager</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { this.generateAITable() }
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ this.props.close }>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default AIManagerModal;
