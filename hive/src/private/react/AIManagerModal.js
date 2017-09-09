import React, { Component } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import _ from "lodash";

class AIManagerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AIs: [
        { name: "Bob", id: 5 },
        { name: "A really cool AI", id: 4 },
      ],
    };
  }
  generateAITableRow = (ai) => {
    return (
      <tr>
        <td>
          <Button onClick={ () => this.props.selectAI(ai.id) }>
            <span className="glyphicon glyphicon-folder-open"/>
          </Button>
        </td>
        <td><input value={ ai.name } onChange={ (e) => this.props.updateAI(ai.id, 'name', e.target.value) }/></td>
        <td>
          <Button onClick={ () => this.props.deleteAI(ai.id) }>
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
          <th></th>
          <th>AI Name</th>
          <th></th>
        </thead>
        <tbody>
          { _.map(this.props.AIs, this.generateAITableRow) }
        </tbody>
      </Table>
    );
  }
  render() {
    return (
      <Modal show={ this.props.showModal } onHide={ this.props.close }>
        <Modal.Header closeButton>
          <Modal.Title>AI Manager</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button onClick={ this.props.addAI }>Add AI</Button>
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
