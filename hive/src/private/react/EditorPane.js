import React, { Component } from 'react';
import "./EditorPane.css"
import AIManagerModal from "./AIManagerModal.js";

import ace from "brace";
import brace from "brace";
import AceEditor from "react-ace";

import 'brace/mode/javascript';
import 'brace/theme/monokai';
import 'brace/keybinding/vim';

import { Tab, Tabs } from "react-bootstrap";

class EditorPane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      watchingFile: false,
      showModal: false,
    };
  }
  componentDidMount() {
    ace.config.loadModule('ace/keyboard/vim', (module) => {
      var VimApi = module.CodeMirror.Vim;
      VimApi.defineEx('write', 'w', (cm, input) => {
        this.props.onRun();
      });
    });
  }
  closeModal = () => {
    this.setState({ showModal: false });
  }
  openModal = () => {
    this.setState({ showModal: true });
  }
  updatePlayerCodeFromFile = () => {
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
  onLoad = (editor) => {
    editor.scrollToLine(1, true, true, () => {});
    editor.gotoLine(1, 0, true);
    editor.focus();
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
      <div className="EditorPane">
        <div className="EditorDiv">
          <AceEditor
            width={ "100%" }
            height={ "100%" }
            mode="javascript"
            theme="monokai"
            keyboardHandler="vim"
            onLoad={this.onLoad}
            onChange={ this.props.updatePlayerCode }
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            value={ this.props.playerCode }
            cursorStart={3}
            setOptions={{
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
          }}
          />
        </div>
        <div className="EditorContorls">
          <button onClick={ this.props.onRun } ><span className="glyphicon glyphicon-play"/></button>
          <button onClick={ this.openModal } ><span className="glyphicon glyphicon-folder-close"/></button>
          <button onClick={ this.props.onDownload } ><span className="glyphicon glyphicon-download"/></button>
          { watchLabel }
          <input type='file' id='filename' ref={ (f) => { this._file = f; } } onChange={ this.onStartFileWatch }/>
          <button onClick={ this.props.onShowApi } ><span className="glyphicon glyphicon-book"/></button>
        </div>
        <AIManagerModal
          showModal={ this.state.showModal }
          close={ this.closeModal }
          addAI={ this.props.addAI }
          updateAI={ this.props.updateAI }
          selectAI={ this.props.selectAI }
          deleteAI={ this.props.deleteAI }
          AIs={ this.props.AIs }
        />
      </div>
    );
  }
}

export default EditorPane;
