import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {Provider,connect} from 'react-redux';

import STORE from '../_reducers/main';

import AppBar from 'material-ui/AppBar';
import {ThemeProvider} from '../_theme/default';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import APP from '../_component/pc/app';


window.addEventListener('load',function(){
    ReactDOM.render(
            <App/>
        ,W('#APP'));
});

let _device={
    model:'w13',
    did:'123456',
    activedIn:'2016-08-15',
    carNum:'粤B23333',
    bindDate:'2016-08-16',
    status:0,
}
let _devices=[];
for(let i=0;i<20;i++){
    let device=Object.assign({},_device);
    device.did+=i;
    _devices[i]=device;
}

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            devices:[],
            height:window.innerHeight-120
        }
    }

    componentDidMount(){
        console.log('did mount')
        Wapi.device.list(res=>{
            if(res.data.length>0)
                this.setState({devices:res.data});
        },{uid:_user.customer.objectId});
        // this.setState({devices:_devices});
    }

    render() {
        let deviceItems = this.state.devices.map(ele=>{
            let isOnline=___.offline;
            let rcvTime='--';
            if(ele.activeGpsData&&ele.activeGpsData.rcvTime){
                let t=W.date(ele.activeGpsData.rcvTime);
                isOnline=((t-new Date())/1000/60<10)?___.online:___.offline;
                rcvTime=W.dateToString(t);
            }
            let version=(ele.hardwareVersion||'-')+','+(ele.softwareVersion||'-');
            return (<TableRow key={ele.did}>
                <TableRowColumn>{ele.model}</TableRowColumn>
                <TableRowColumn>{ele.did}</TableRowColumn>
                <TableRowColumn>{ele.vehicleName}</TableRowColumn>
                <TableRowColumn>{version}</TableRowColumn>
                <TableRowColumn>{rcvTime}</TableRowColumn>
                <TableRowColumn>{isOnline}</TableRowColumn>
            </TableRow>)
        });
        return (
            <APP leftBar={false}>
                <div style={{marginLeft:'25px',marginRight:'25px'}} >
                    <Table height={this.state.height+'px'} fixedHeader={true}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn>{___.device_type}</TableHeaderColumn>
                                <TableHeaderColumn>{___.device_id}</TableHeaderColumn>
                                <TableHeaderColumn>{___.carNum}</TableHeaderColumn>
                                <TableHeaderColumn>{___.device_version}</TableHeaderColumn>
                                <TableHeaderColumn>{___.rcv_time}</TableHeaderColumn>
                                <TableHeaderColumn>{___.device_status}</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false} stripedRows={true}>
                            {deviceItems}
                        </TableBody>
                    </Table>
                </div>
            </APP>
        );
    }
}
