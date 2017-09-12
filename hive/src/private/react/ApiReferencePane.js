import React, { Component } from 'react';
import Markdown from "react-markdown";
import "./ApiReferencePane.css"
import { Pane, PaneControls, PaneContent } from "./Pane.js";
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';

import codeRenderer from './CodeRenderer.js';

class ApiReferencePane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      source: [
        '# Hive',
        'This is hive.',
        '\n',
        '### Code Block',
        '```js',
        'if (antData.type === "worker") {',
        '  return {',
        '    type: "move",',
        '    direction: _.sample(dirs),',
        '  }',
        '}',
        '```'
      ].join("\n")
    }
  }
  render() {
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
            source={ this.state.source }
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
