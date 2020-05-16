import React from 'react';
import {
  AppBar,
  Tabs,
  Tab
} from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
//import { indigo, red, purple } from '@material-ui/core/colors';
import PositionTab from './Tabs/PositionTab';
import CameraTab from './Tabs/CameraTab';
import CalibrationTab from './Tabs/CalibrationTab';
import WebSocketService from './WebSocketService'

const theme = createMuiTheme({
  palette: {
  },
});

const App = class App  extends React.Component {

    constructor (props) {
      super(props)
      this.state = {
        tab: 0
      }
    }

    componentDidMount() {
      this.webSocketService = new WebSocketService("192.168.1.140:8082")
      this.webSocketService.open()
    }

    handleTabChange = (e, newValue) => {
      this.setState({ tab: newValue })
    }

    render() {
      return (
        <div className="App">
          <ThemeProvider theme={theme}>
            <AppBar position="static">
              <Tabs
                centered
                value={this.state.tab}
                onChange={this.handleTabChange}>
                <Tab label="Position" />
                <Tab label="Camera"  />
                <Tab label="Calibration"  />
              </Tabs>
            </AppBar>
            <div>
              { this.state.tab === 0 &&
                <PositionTab />
              }
              { this.state.tab === 1 &&
                <CameraTab webSocketService={this.webSocketService} />
              }
              { this.state.tab === 2 &&
                <CalibrationTab webSocketService={this.webSocketService} />
              }
            </div>
          </ThemeProvider>
        </div>
      );
    }
}
export default App
