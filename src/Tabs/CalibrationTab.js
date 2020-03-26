import React from 'react';
import {
 Button,
 GridList,
 GridListTile,
 GridListTileBar,
 ListSubheader,
 IconButton,
 Typography,
 Dialog,
 DialogContent,
 DialogTitle,
 DialogActions,
 List,
 ListItem,
 ListItemText
} from '@material-ui/core'

import LoadingButton from '../Helpers/LoadingButton'
import DeleteIcon from '@material-ui/icons/Delete'
import ReactJson from 'react-json-view'

const CalibrationTab = class Camera extends React.Component {

    constructor (props) {
      super(props)
      this.state = {
        status: 'ready',
        pictures: [],
        savesDialog: false,
        expectedPictureCount: 0,
        saves: [],
        processLoading: false
      }
      this.ws = props.webSocketService
    }
    
    beginCalibration = () => {
      this.setState({ status: 'gathering' }, () => {
        const image = document.getElementById('camera_frame_gathering')
        //this.ws.send('begin_calibration')
        this.ws.send('live')
        this.ws.addEventListener('frame', (e) => {
          image.src = e.detail[0]
        })
        this.ws.addEventListener('calibrationSnapshot', (e) => {
          let pictures = this.state.pictures
          pictures.push(e.detail)
          this.setState({pictures})
        })
      })
      
    }

    takePic = () => {
      let calibrationId = ''
      if (this.state.pictures.length > 0) {
        calibrationId = this.state.pictures[0].calibrationId
      }
      this.ws.send('calibration_snapshot', {calibrationId})
    }

    process = () => {
      this.setState({processLoading: true})
      this.ws.send('calibration_process', {calibrationId: this.state.pictures[0].calibrationId})
      this.ws.removeEventListener('calibrationOutput', this.onCalibrationOutput)
      this.ws.addEventListener('calibrationOutput', this.onCalibrationOutput)
    }

    onCalibrationOutput = event => {
      console.log('CALIB OUTPUT', event.detail)
      this.setState({ calibrationOutput: event.detail }, () => {
        this.setState({processLoading: false})
      })
    }

    deleteFrame = args => {
      this.setState({pictures: this.state.pictures.filter(pic => pic.calibrationFrameId !== args[1] )})
      this.ws.send('calibration_delete_input_data', { path: args[0], calibrationFrameId: args[1], calibrationId: args[2] })
    }

    openSavesDialog = () => {
      this.ws.send('calibration_fetch_saves')
      this.ws.removeEventListener('calibrationSaves', this.onCalibrationSaves)
      this.ws.addEventListener('calibrationSaves', this.onCalibrationSaves)
      this.setState({savesDialog: true})
    }

    onCalibrationSaves = event => { this.setState({saves: event.detail.saves}) }

    loadSave = args => {
      this.ws.send('calibration_fetch_save', { calibrationId: args[0] })
      this.setState({ pictures: [], expectedPictureCount: args[1] })
      this.ws.removeEventListener('calibrationSave', this.onCalibrationSave)
      this.ws.addEventListener('calibrationSave', this.onCalibrationSave)
    }

    onCalibrationSave = event => {
      console.log('received')
      let pictures = this.state.pictures
      pictures.push(event.detail.picture)
      pictures = pictures.sort((a, b) => a.calibrationFrameId > b.calibrationFrameId ? 1 : -1)
      this.setState({pictures})
      if (this.state.pictures.length === this.state.expectedPictureCount) {
        console.log('finished')
        this.setState({savesDialog: false})
      }
    }

    closeSavesDialog = () => { this.setState({savesDialog: false}) }

    render() {
      return (
        <div>
          <Dialog open={this.state.savesDialog}>
            <DialogTitle>
              Load a calibration save
            </DialogTitle>
            <DialogContent dividers>
              <List>
                {this.state.saves.map(save => (
                  <ListItem button key={save.id}>
                    <ListItemText primary={"#" + save.id} secondary={"Has " + save.count + " images"} onClick={this.loadSave.bind(this, [save.id, save.count])} />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={this.closeSavesDialog} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
          <div className="board-row">
            <div className="frame-container frame-container-with-meta">
              <img 
                className="frame-image"
                src=""
                alt="camera frame"
                id="camera_frame_gathering" />
              <div className="calibration-meta">
                {this.state.pictures.length > 0 &&
                  <div><Typography variant="subtitle1">Calibration ID #{this.state.pictures[0].calibrationId}</Typography></div>
                }
              </div>
            </div>
            <div className="side-panel">
              {this.state.status === 'ready' &&
                <div className="CalibrationBegin" style={{marginTop: '1em', marginBottom: '1em', display: 'flex', justifyContent: 'center'}}>
                  <Button variant="contained" color="secondary" onClick={this.beginCalibration}>Begin calibration</Button>
                </div>
              }  
              {this.state.status === 'gathering' &&
                <div>
                  <div style={{marginTop: '1em', marginBottom: '1em', display: 'flex'}}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={this.takePic}
                      style={{marginRight: '1em'}}>
                        Take pic
                    </Button>
                    <Button 
                      variant="contained"
                      color="primary"
                      onClick={this.openSavesDialog}
                      style={{marginRight: '1em'}}>
                        Load save
                    </Button>
                    <LoadingButton 
                      id="process-button"
                      text="Process"
                      onClick={this.process}
                      disabled={this.state.pictures.length === 0}
                      loading={this.state.processLoading} />
                  </div>
                  <div className="calibration-input-data-mosaic">
                    <GridList cellHeight={125}>
                      <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                      <ListSubheader component="div">Calibration input data <span> ({this.state.pictures.length} pictures)</span>
                      </ListSubheader>
                      </GridListTile>
                      {this.state.pictures.map(pic => (
                        <GridListTile key={pic.calibrationFrameId} className="calibration-input-data-tile">
                          <img src={pic.data} alt={pic.calibrationFrameId} />
                          <GridListTileBar
                            title={pic.calibrationFrameId}
                            actionIcon={
                              <IconButton onClick={this.deleteFrame.bind(this, [pic.path, pic.calibrationFrameId, pic.calibrationId])}>
                                <DeleteIcon style={{ color: 'white' }}  />
                              </IconButton>
                            }
                          />
                        </GridListTile>
                      ))}
                    </GridList>
                  </div>
                </div>
              }
            </div>
          </div>
          <div className="calibration-output">
            <ReactJson 
              src={this.state.calibrationOutput}
              enableClipboard={true}
              displayObjectSize={false}
              displayDataTypes={false}
              sortKeys={true}
              iconStyle={'triangle'}
              />
          </div>
            {/* {this.state.status === 'gathering' &&
              <div className="CalibrationGathering" style={{marginTop: '1em', marginBottom: '1em', display: 'flex', justifyContent: 'center'}}>
                <div>
                  <div className="Frame">
                      <div className="frame-container">
                        <img src="" id="camera_frame_gathering" />
                      </div>
                  </div>
                  <div style={{marginTop: '1em', marginBottom: '1em'}}>
                    <Button variant="contained" color="secondary" onClick={this.takePic}>Take pic</Button>
                    <Button variant="contained" color="primary" onClick={this.process}>Process</Button>
                  </div>
                </div>
              </div>
            } */}
            {/**
             * - First, click on the button "start calibration"
             * - This will create a new folder in calibration_data this folder will contain all the picture taken while the calibration
             * - A video frame will show up with a button take picture, as well as a list of picture taken along with the total count of photos taken
             * - When the button "take picture" is pressed, we will send a msg to the server saying "Hey, when you will reach the next frame, it would be very kind of you to also save this picture in a file with the following id, thank you"
             * - When the picture is saved the server will respond with a message saying "The photo have been save under this file name blah blah"
             * - When enougth pictures were taken, the user will click on "Finish calibration"
             * - a loading bar will show up
             * - the server will process all these picture to get the two calibration array which will be send back to the client
             */}
        </div>
      );
    }
}
export default CalibrationTab