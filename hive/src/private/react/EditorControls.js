import React, { Component } from 'react';

class EditorControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      watchingFile: false,
    };
  }
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
            this.props.changeHandler(e.target.result, "playerCode");
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
    this.setState({ watchingFile: false });
    e.preventDefault();
  }
  onStartFileWatch = (file) => {
    this.setState({ watchingFile: true });
    this.watchInterval = setInterval(this.updatePlayerCodeFromFile, 100);
  }
  render() {
    let watchLabel;
    if (!this.state.watchingFile) {
      watchLabel = (
        <label htmlFor="filename" className="custom-file-upload">
          <span className="glyphicon glyphicon-eye-open"/>
        </label>
      );
    } else {
      watchLabel = (
        <label className="custom-file-upload" onClick={ this.onStopFileWatch }>
          <span className="glyphicon glyphicon-eye-close"/>
        </label>
      );
    }
    return (
      <div className="EditorContorls">
        <button onClick={ this.props.onRun } ><span className="glyphicon glyphicon-play"/></button>
        <button onClick={ this.props.onDownload } ><span className="glyphicon glyphicon-download"/></button>
        { watchLabel }
        <input type='file' id='filename' ref={ (f) => { this._file = f; } } onChange={ this.onStartFileWatch }/>
      </div>
    );
  }
}

export default EditorControls;
