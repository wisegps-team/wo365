import React from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

import APP from '../_component/pc/app';
import WTable from '../_component/table';

window.addEventListener('load',function(){
    ReactDOM.render(
            <App/>
        ,W('#APP'));
});
const styles={
    tableHeight:window.innerHeight-120,
    main:{padding:'25px'}
}
class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            mainPage:'history'
        }
    }
    toHistoryPage(){
        this.setState({mainPage:'history'});
    }
    toWarnPage(){
        this.setState({mainPage:'warn'});
    }
    toSpeedPage(){
        this.setState({mainPage:'speed'});
    }
    render() {
        let left=<Menu>
                    <MenuItem primaryText="history" onClick={this.toHistoryPage.bind(this)} />
                    <MenuItem primaryText="warn" onClick={this.toWarnPage.bind(this)} />
                    <MenuItem primaryText="speed" onClick={this.toSpeedPage.bind(this)} />
                </Menu>
        let main;
        switch(this.state.mainPage){
            case 'history':
                main=<HistoryPage/>;
                break;
            case 'warn':
                main=<WarnPage/>;
                break;
            case 'speed':
                main=<SpeedPage/>;
                break;
            default:
                break;
        }
        return (
            <APP leftContent={left}>
                {main}
            </APP>
        );
    }
}
class HistoryPage extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    render(){
        return(
            <div style={styles.main}>
                HistoryPage
            </div>
        )
    }
}
class WarnPage extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    render(){
        return(
            <div style={styles.main}>
                WarnPage
            </div>
        )
    }
}
class SpeedPage extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    render(){
        return(
            <div style={styles.main}>
                SpeedPage
            </div>
        )
    }
}