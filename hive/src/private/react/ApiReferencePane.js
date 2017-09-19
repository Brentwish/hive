import React, { Component } from 'react';
import Markdown from "react-markdown";
import "./ApiReferencePane.css"
import { Pane, PaneControls, PaneContent } from "./Pane.js";
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import { Api } from "../../Api.js"
import codeRenderer from './CodeRenderer.js';
import _ from "lodash";

class ApiReferencePane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      source: Api
		}
  }
  parseErrorsToMD = (errors) => {
    return _.map(errors, (error) => {
      const id = error.id || "";
      const reason = error.reason || "";
      const line = error.line || "";
      const character = error.character || "";
      const evidence = error.evidence || "";
      return [
        "## " + error.id,
        "#### " + error.reason,
        "#### " + "Line " + error.line + " : Charater " + error.character + " => " + error.evidence,
      ].join("\n");
    }).join("\n\n");
  }
  render() {
    const source = [
      "```js",
      JSON.stringify(this.props.lintData),
      "```",
    ].join("\n");
    return (
      <Pane>
        <PaneControls>
          <ButtonToolbar>
            <ButtonGroup>
              <Button bsStyle="success" onClick={ this.props.onRun } ><span className="glyphicon glyphicon-play"/></Button>
            </ButtonGroup>
          </ButtonToolbar>
        </PaneControls>
        <PaneContent>
          <Markdown
            className="Markdown"
            source={ this.parseErrorsToMD(this.props.lintErrors) }
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
