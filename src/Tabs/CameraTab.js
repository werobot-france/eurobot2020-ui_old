import React from 'react';
import {
 Checkbox,
 FormControlLabel,
 Typography
} from '@material-ui/core'
import ReactJson from 'react-json-view'

const CameraTab = class Camera extends React.Component {

    constructor (props) {  
      super(props)
      this.state = {
        detectMarkers: false,
        markerPositions: false,
        cameraDebug: {},
        fps: 0,
        tmpFps: 0
      }
      this.ws = props.webSocketService
    }
    
    componentDidMount() {
      const image = document.getElementById('camera_frame')
      this.ws.send('live')
      this.ws.addEventListener('frame', (e) => {
        image.src = e.detail[0]
        this.setState({cameraDebug: {corners: e.detail[1][0],ids: e.detail[1][1]}, tmpFps: this.state.tmpFps + 1})
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
                <div class="fps-counter">
                  <Typography>{this.state.fps} FPS</Typography>
                </div>
                <div className="camera-options">
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