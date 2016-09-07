"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';

import {ThemeProvider} from '../_theme/default';
import AppBar from '../_component/base/appBar';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {List,ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import Card from 'material-ui/Card';

import STORE from '../_reducers/main';
import BrandSelect from'../_component/base/brandSelect';
import SonPage from '../_component/base/sonPage';


var thisView=window.LAUNCHER.getView();//第一句必然是获取view


thisView.addEventListener('load',function(){
    ReactDOM.render(
        <AppDeviceManage/>,thisView);
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

const styles = {
    main:{width:'90%',paddingTop:'50px',marginLeft:'5%',marginRight:'5%',},
    show:{paddingTop:'50px',width:'750px'},
    hide:{display:'none'},
    scan_input:{color:'#00bbbb',borderBottom:'solid 1px'},
    product_id:{borderBottom:'solid 1px #999999'},
    ids_box:{marginTop:'1em'},
    btn_cancel:{marginTop:'30px',marginRight:'20px'},
    input_page:{marginTop:'20px',textAlign:'center'},
    p:{paddingLeft:'20px'}
};


class AppDeviceManage extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            intent:'list',
            devices:[],
        }
    }

    componentDidMount(){
        Wapi.device.list(res=>{
            if(res.data.length>0)
                this.setState({devices:res.data});
        },{uid:_user.customer.objectId});
        // this.setState({devices:_devices});
    }


    render(){
        let deviceItems = this.state.devices.map((ele,index)=>{
            let isOnline=___.offline;
            let rcvTime='--';
            if(ele.activeGpsData&&ele.activeGpsData.rcvTime){
                let t=W.date(ele.activeGpsData.rcvTime);
                isOnline=((t-new Date())/1000/60<10)?___.online:___.offline;
                rcvTime=W.dateToString(t);
            }
            let version=(ele.hardwareVersion||'-')+','+(ele.softwareVersion||'-');
            return (<Card key={index} style={{marginTop:'1em', padding:'0.5em 1em'}} >
                <table>
                    <tbody>
                        <tr>
                            <td>{___.device_type}</td>
                            <td style={styles.p}>{ele.model}</td>
                        </tr>
                        <tr>
                            <td>{___.device_id}</td>
                            <td style={styles.p}>{ele.did}</td>
                        </tr>
                        <tr>
                            <td>{___.carNum}</td>
                            <td style={styles.p}>{ele.vehicleName}</td>
                        </tr>
                        <tr>
                            <td>{___.device_version}</td>
                            <td style={styles.p}>{version}</td>
                        </tr>
                        <tr>
                            <td>{___.rcv_time}</td>
                            <td style={styles.p}>{rcvTime}</td>
                        </tr>
                        <tr>
                            <td>{___.device_status}</td>
                            <td style={styles.p}>{isOnline}</td>
                        </tr>
                    </tbody>
                </table>
            </Card>);
        });
        return(
            <ThemeProvider>
                <div style={{overflow:'auto'}}>
                    <AppBar 
                        title={___.device_manage} 
                        style={{position:'fixed'}} 
                    />
                    <div style={styles.main}>
                        {deviceItems}
                    </div>
                </div>
            </ThemeProvider>
        );
    }
}
