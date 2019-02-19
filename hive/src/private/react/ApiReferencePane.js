import React, { Component } from 'react';
import Markdown from "react-markdown";
import "./ApiReferencePane.css"
import { Api } from "../../Api.js"
import codeRenderer from './CodeRenderer.js';

class ApiReferencePane extends Component {
  render() {
    return (
      <Markdown
        className="Markdown"
        source={ Api }
        renderers={ {
          CodeBlock: codeRenderer,
          Code: codeRenderer,
        } }
      />
    );
  }
}

export default ApiReferencePane;
