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

import STORE from '../_reducers/main';
import BrandSelect from'../_component/base/brandSelect';
import SonPage from '../_component/base/sonPage';


var thisView=window.LAUNCHER.getView();//第一句必然是获取view


// W.native={
//     scanner:{
//         start:function(callback){
//             setTimeout(function(){
//                 callback('123456');
//             },100);
//         }
//     }
// }
// let isWxSdk=true;
let isWxSdk=false;
W.include(WiStorm.root+'/wslib/toolkit/WxSdk.js',function(){},function(){alert('can not scan')});
window.addEventListener('nativeSdkReady',()=>{isWxSdk=true;});

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
    show:{paddingTop:'50px',width:'750px'},
    hide:{display:'none'},
    scan_input:{color:'#00bbbb',borderBottom:'solid 1px'},
    product_id:{borderBottom:'solid 1px #999999'},
    ids_box:{marginTop:'1em'},
    btn_cancel:{marginTop:'30px',marginRight:'20px'},
    input_page:{marginTop:'20px',textAlign:'center'},
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
        let deviceItems = this.state.devices.map(ele=>
            <TableRow key={ele.did}>
                <TableRowColumn>{ele.model}</TableRowColumn>
                <TableRowColumn>{ele.did}</TableRowColumn>
                <TableRowColumn>{ele.carNum}</TableRowColumn>
                <TableRowColumn>{ele.activedIn}</TableRowColumn>
                <TableRowColumn>{ele.bindDate}</TableRowColumn>
                <TableRowColumn>{ele.status==0?___.online:___.offline}</TableRowColumn>
            </TableRow>);
        return(
            <ThemeProvider>
                <div style={{overflow:'auto'}}>
                    <AppBar 
                        title={___.device_manage} 
                        style={{position:'fixed'}} 
                    />
                    <div style={styles.show}>
                        <Table height={this.state.height+'px'} width={1000+'px'} fixedHeader={true}>
                            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                <TableRow>
                                    <TableHeaderColumn>{___.device_type}</TableHeaderColumn>
                                    <TableHeaderColumn>{___.device_id}</TableHeaderColumn>
                                    <TableHeaderColumn>{___.carNum}</TableHeaderColumn>
                                    <TableHeaderColumn>{___.activedIn}</TableHeaderColumn>
                                    <TableHeaderColumn>{___.bindDate}</TableHeaderColumn>
                                    <TableHeaderColumn>{___.device_status}</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false} stripedRows={true}>
                                {deviceItems}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </ThemeProvider>
        );
    }
}
