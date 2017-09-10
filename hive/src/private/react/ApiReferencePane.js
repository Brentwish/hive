import React, { Component } from 'react';
import Markdown from "react-markdown";
import "./ApiReferencePane.css"

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
      <div>
        <Markdown
          className="Markdown"
          source={ this.state.source }
          renderers={ {
            CodeBlock: codeRenderer,
            Code: codeRenderer,
          } }
        />
      </div>
    );
  }
}

export default ApiReferencePane;
