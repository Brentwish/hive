import React, { Component } from 'react';
import { Pane, PaneContent } from "./Pane.js";
import GameDisplay from "./GameDisplay.js";
import GameControls from "./GameControls.js";
import SplitPane from "react-split-pane";
import InfoPane from "./InfoPane.js";
import "./GamePane.css";
import "./Hive.css";

class GamePane extends Component {
  render() {
    return (
      <Pane>
        <GameControls
          isPaused={ this.props.isPaused }
          gameSpeed={ this.props.gameSpeed }
          onPause={ this.props.onPause }
          onSpeedChange={ this.props.onSpeedChange }
          onToggleTrails={ this.props.onToggleTrails }
          handleStopGame={ this.props.handleStopGame }
          onZoomOut={ this.props.onZoomOut }
          onZoomIn={ this.props.onZoomIn }
          handleStep={ this.props.handleStep }
        />
        <PaneContent>
          <SplitPane split="horizontal" minSize={ 100 } defaultSize={ "69vh" } onChange={ this.props.setGraphDimensions }>
            <GameDisplay
              ref={ (d) => this._display = d }
              gameWidth={ this.props.gameWidth }
              gameHeight={ this.props.gameHeight }
              pixelScale={ this.props.pixelScale }
              onTileSelect={ this.props.onTileSelect }
              showTrails={ this.props.showTrails }
              onZoomIn={ this.props.onZoomIn }
              onZoomOut={ this.props.onZoomOut }
              onPan={ this.props.onPan }
            />
            <InfoPane
              ref={ (i) => this._infoPane = i }
              watchTile={ this.props.watchTile }
              onTrackAnt={ this.props.onTrackAnt }
              isAntWatched={ this.props.isAntWatched }
              players={ this.props.players }
              graphs={ this.props.graphs }
              graphDimensions={ this.props.graphDimensions }
              setGraphDimensions={ this.props.setGraphDimensions }
            />
          </SplitPane>
        </PaneContent>
      </Pane>
    );
  }
}

export default GamePane;
