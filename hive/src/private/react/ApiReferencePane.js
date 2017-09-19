import React, { Component } from 'react';
import Markdown from "react-markdown";
import "./ApiReferencePane.css"
import { Pane, PaneControls, PaneContent } from "./Pane.js";
import { ButtonToolbar, ButtonGroup, ToggleButtonGroup, Button, ToggleButton } from 'react-bootstrap';
import { Api } from "../../Api.js"
import codeRenderer from './CodeRenderer.js';
import _ from "lodash";

class ApiReferencePane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      source: Api,
      showAPI: 1,
		}
  }
  parseErrorsToMD = (errors) => {
    return "# Errors\n" + _.map(errors, (error) => {
      return [
        "## " + error.id,
        "#### " + error.reason,
        "#### " + "Line " + error.line + " : Charater " + error.character + " => " + error.evidence,
      ].join("\n");
    }).join("\n\n");
  }
  toggleAPI = (value) => {
    this.setState({ showAPI: value });
  }
  render() {
    let source;
    if (this.state.showAPI === 1) {
      source = this.state.source;
    } else {
      source = this.parseErrorsToMD(this.props.lintErrors);
    }
    return (
      <Pane>
        <PaneControls>
          <ButtonToolbar>
            <ToggleButtonGroup type="radio" name="toggleAPI" onChange={ this.toggleAPI }>
              <ToggleButton value={ 1 } ><span className="glyphicon glyphicon-book"/></ToggleButton>
              <ToggleButton value={ 2 } ><span className="glyphicon glyphicon-asterisk"/></ToggleButton>
            </ToggleButtonGroup>
            <ButtonGroup>
              <Button bsStyle="success" onClick={ this.props.onRun } ><span className="glyphicon glyphicon-play"/></Button>
            </ButtonGroup>
          </ButtonToolbar>
        </PaneControls>
        <PaneContent>
          <Markdown
            className="Markdown"
            source={ source }
            renderers={ {
              CodeBlock: codeRenderer,
              Code: codeRenderer,
            } }
          />
        </PaneContent>
      </Pane>
    );
  }
}

export default ApiReferencePane;
