import React, { Component } from 'react';
import ApiReferencePane from "./ApiReferencePane.js";
import CodeErrorsPane from "./CodeErrorsPane.js";
import { Pane, PaneControls, PaneContent } from "./Pane.js";
import { ButtonToolbar, ButtonGroup, ToggleButtonGroup, Button, ToggleButton } from 'react-bootstrap';
import { Api } from "../../Api.js"
import codeRenderer from './CodeRenderer.js';
import _ from "lodash";

class ReferencePane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPane: props.lintErrors.length <= 0 ? 1 : 2,
		}
  }
  togglePane = (value) => {
    this.setState({ currentPane: value });
  }
  render() {
    let reference;
    if (this.state.currentPane === 1) {
      reference = (
        <ApiReferencePane
        />
      );
    } else {
      reference = (
        <CodeErrorsPane
          errors={ this.props.lintErrors }
        />
      );
    }
    return (
      <Pane>
        <PaneControls>
          <ButtonToolbar>
            <ToggleButtonGroup type="radio" name="togglePane" onChange={ this.togglePane }>
              <ToggleButton value={ 1 } ><span className="glyphicon glyphicon-book"/></ToggleButton>
              <ToggleButton value={ 2 } ><span className="glyphicon glyphicon-asterisk"/></ToggleButton>
            </ToggleButtonGroup>
            <ButtonGroup>
              <Button bsStyle="success" onClick={ this.props.onRun } ><span className="glyphicon glyphicon-play"/></Button>
            </ButtonGroup>
          </ButtonToolbar>
        </PaneControls>
        <PaneContent scrollable>
          { reference }
        </PaneContent>
      </Pane>
    );
  }
}

export default ReferencePane;
