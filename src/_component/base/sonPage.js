import React, {Component} from 'react';

import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import IconButton from 'material-ui/IconButton';

const sty={
    p:{
        padding: '10px',
    }
}
class Sonpage extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        let w=WiStorm.agent.mobile?window.screen.width:300;
        return (
            <Drawer
                width={w} 
                openSecondary={true} 
                open={this.props.open} 
            >
                <AppBar
                    title={this.props.title}
                    iconElementLeft={<IconButton onClick={this.props.back}><NavigationArrowBack/></IconButton>}
                />
                <div style={sty.p}>
                    {this.props.children}
                </div>
            </Drawer>
        );
    }
}

export default Sonpage;