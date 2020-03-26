import React from 'react';
import {
 Button,
 CircularProgress
} from '@material-ui/core'

import { green } from '@material-ui/core/colors';

const LoadingButton = class LoadingButton extends React.Component {

    constructor (props) {
      super(props)
      this.state = {
        id: props.id,
        loading: props.loading === undefined ? false : props.loading,
        text: props.text,
        overlappingElementStyle: {},
        disabled: props.disabled === undefined ? false : props.disabled
      }
      this.green = green[500]
      this.onClick = props.onClick
    }

    componentWillReceiveProps = (props) => {
      this.setState({loading: props.loading, disabled: props.disabled})
    }

    buttonClicked = () => {
      this.onClick()
      let modelElement = window.document.getElementById('modelElement-' + this.state.id)
      this.setState({
        overlappingElementStyle: {
          width: modelElement.offsetWidth + 'px',
          height: modelElement.offsetHeight + 'px',
          marginTop: - modelElement.offsetHeight + 'px'
        }
      })
    }

    render() {
      return (
        <div className="loading-button-wrapper">
            <Button
                variant="contained"
                color="primary"
                disabled={this.state.loading || this.state.disabled}
                onClick={this.buttonClicked}
                id={'modelElement-' + this.state.id}
            >
                {this.state.text}
            </Button>
            <div 
                id={'overlappingElement-' + this.state.id}
                className="loading-button-overlapping-element"
                style={this.state.overlappingElementStyle}>
                {this.state.loading && <CircularProgress size={24} style={{color: this.green}}/>}
            </div>
        </div>
      );
    }
}
export default LoadingButton