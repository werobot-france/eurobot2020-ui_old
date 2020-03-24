import React from 'react';
import {
 Button,
 Typography
} from '@material-ui/core'
const PositionTab = class Camera extends React.Component {

    constructor (props) {
      super(props)
      this.state = {
        
      }
    }

    render() {
      return (
        <div className="Camera">
          <Typography>Position</Typography>
          <Button>WOW</Button>
        </div>
      );
    }
}
export default PositionTab