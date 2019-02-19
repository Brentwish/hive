import React, { Component } from 'react';
import Markdown from "react-markdown";
import codeRenderer from './CodeRenderer.js';
import _ from "lodash";

class CodeErrorsPane extends Component {
  parseErrorsToMD = (errors) => {
    return "# Errors\n" + _.map(errors, (error) => {
      return [
        "## " + error.id,
        "#### " + error.reason,
        "#### " + "Line " + error.line + " : Character " + error.character + " => " + error.evidence,
      ].join("\n");
    }).join("\n\n");
  }
  render() {
    return (
      <Markdown
        className="Markdown"
        source={ this.parseErrorsToMD(this.props.errors) }
        renderers={ {
          CodeBlock: codeRenderer,
          Code: codeRenderer,
        } }
      />
    );
  }
}

export default CodeErrorsPane;
