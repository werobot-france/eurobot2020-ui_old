import React from 'react';
import {
 Checkbox,
 FormControlLabel
} from '@material-ui/core'
const CameraTab = class Camera extends React.Component {

    constructor (props) {  
      super(props)
      this.state = {
        detectMarkers: false,
        markerPositions: false
      }
      this.ws = props.webSocketService
    }
    
    componentDidMount() {
      const image = document.getElementById('camera_frame')
      this.ws.send('live')
      this.ws.addEventListener('frame', (e) => {
        image.src = e.detail
      })
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
          <div className="Camera" style={{display: 'flex', justifyContent: 'center', marginTop: '1em'}}>
            <img src="" id="camera_frame" />
          </div>
          <div className="CameraOptions" style={{display: 'flex', justifyContent: 'center'}}>
            
              
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
      );
    }
}
export default CameraTab