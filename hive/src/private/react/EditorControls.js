import React, { Component } from 'react';
import { PaneControls } from "./Pane.js";
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import "./EditorControls.css";

class EditorControls extends Component {
  updatePlayerCodeFromFile = () => {
    console.log("wat");
    let file;

    if (typeof window.FileReader !== 'function') {
      console.log("The file API isn't supported on this browser yet.");
      return;
    }

    const input = this._file;
    if (!input) {
      console.log("Um, couldn't find the filename element.");
    }
    else if (!input.files) {
      console.log("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
      console.log("Please select a file before clicking 'Show Size'");
    } else {
      file = input.files[0];
      if (!this.state.fileLastModified || this.state.fileLastModified < file.lastModified) {
        const reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = ((theFile) => {
          return (e) => {
            this.props.updatePlayerCode(e.target.result);
            this.setState({ fileLastModified: theFile.lastModified });
            this.props.onRun();
          };
        })(file);

        reader.readAsText(file);
      }
    }
  }
  onStopFileWatch = (e) => {
    clearInterval(this.watchInterval);
    this._file.value = null;
    this.props.onStopFileWatch();
    e.preventDefault();
  }
  onStartFileWatch = (file) => {
    this.setState({ watchingFile: true, watchFileName: file.target.files[0].name });
    this.props.onStartFileWatch(file.target.files[0].name);
    this.watchInterval = setInterval(this.updatePlayerCodeFromFile, 100);
  }
  render() {
    let watchLabel;
    if (!this.props.watchingFile) {
      watchLabel = (
        <label onMouseOver={ this.props.watchFileName } htmlFor="filename" className="custom-file-upload btn btn-default">
          <span className="glyphicon glyphicon-eye-open"/>
        </label>
      );
    } else {
      watchLabel = (
        <label className="custom-file-upload btn btn-default btn-warning" onClick={ this.onStopFileWatch }>
          <div className="WatchFileName">{ this.props.watchFileName }</div>
          <span className="glyphicon glyphicon-eye-close"/>
        </label>
      );
    }
    return (
      <PaneControls>
        <ButtonToolbar>
          <ButtonGroup>
            <Button onClick={ this.props.onManageAIs } ><span className="glyphicon glyphicon-folder-close"/></Button>
            <Button onClick={ this.props.onDownload } ><span className="glyphicon glyphicon-download"/></Button>
            { watchLabel }
            <input type='file' id='filename' ref={ (f) => { this._file = f; } } onChange={ this.onStartFileWatch }/>
            <Button onClick={ this.props.onOpenGameOptions } ><span className="glyphicon glyphicon-cog"/></Button>
          </ButtonGroup>
        </ButtonToolbar>
      </PaneControls>
    );
  }
}

export default EditorControls;
