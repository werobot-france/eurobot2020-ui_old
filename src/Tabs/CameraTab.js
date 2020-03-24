import React from 'react';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  IconButton
} from '@material-ui/core'

import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';

import ReactJson from 'react-json-view'

const CameraTab = class Camera extends React.Component {

    constructor (props) {  
      super(props)
      this.state = {
        detectMarkers: false,
        markerPositions: false,
        cameraDebug: {},
        fps: 0,
        tmpFps: 0,
        pause: false
      }
      this.ws = props.webSocketService
    }
    
    componentDidMount() {
      const image = document.getElementById('camera_frame')
      this.ws.send('live')
      this.ws.addEventListener('frame', (e) => {
        if (!this.state.pause) {
          image.src = e.detail[0]
          this.setState({cameraDebug: {corners: e.detail[1][0],ids: e.detail[1][1]}, tmpFps: this.state.tmpFps + 1})
        }
      })
      setInterval(() => {
        this.setState({tmpFps: 0, fps: this.state.tmpFps})
      }, 1000)
    }

    cameraOptionsChanged = (event) => {
      this.setState({
        [event.target.name]: event.target.checked
      }, () => {
        if (this.state.detectMarkers) {
          this.ws.send('enable_markers')
        }
        if (!this.state.detectMarkers) {
          this.ws.send('disable_markers')
        }
      })
    }

    togglePause = () => {
      this.setState({pause: !this.state.pause})
    }

    render() {
      return (
        <div>
          <div className="board-row camera-debug">
            <div className="frame-container frame-container-with-meta">
              <img 
                className="frame-image"
                src=""
                alt="camera frame"
                id="camera_frame" />
              <div className="camera-meta">
                <div className="fps-counter">
                  <Typography>{this.state.fps} FPS</Typography>
                </div>
                <div className="camera-options">
                  <div className="camera-options-button">
                    <IconButton onClick={this.togglePause} color="primary">
                       {!this.state.pause && <PauseCircleFilledIcon />}
                       {this.state.pause && <PlayCircleFilledIcon />}
                    </IconButton>
                  </div>
                  <FormControlLabel
                    control={
                      <Checkbox 
                          checked={this.state.detectMarkers}
                          onChange={this.cameraOptionsChanged}
                          name="detectMarkers" />
                    }
                    label="Detect markers"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                          checked={this.state.markerPositions}
                          onChange={this.cameraOptionsChanged}
                          name="markerPositions" />
                    }
                    label="Markers position"
                  />
                </div>
              </div>
            </div>
            <div className="side-panel camera-debug-side-panel">
              <div className="camera_debug">
                <ReactJson 
                  src={this.state.cameraDebug}
                  enableClipboard={true}
                  displayObjectSize={false}
                  displayDataTypes={false}
                  sortKeys={true}
                  iconStyle={'triangle'}
                  />
              </div>
            </div>
          </div>
        </div>
      );
    }
}
export default CameraTab