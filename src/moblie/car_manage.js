import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {Provider,connect} from 'react-redux';

import STORE from '../_reducers/main';
import Fab from '../_component/base/fab';
import Input from '../_component/base/input';
import AppBar from '../_component/base/appBar';

import {ThemeProvider} from '../_theme/default';
import Paper from 'material-ui/Paper';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import IconButton from 'material-ui/IconButton';
import ActionAccountCircle from 'material-ui/svg-icons/action/account-circle';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import {Tabs, Tab} from 'material-ui/Tabs';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';

import CarBrand from '../_component/base/carBrand';
import Sonpage from '../_component/base/sonPage';
import CarDriver from '../_component/car_driver';
import CarDevice from '../_component/car_device';
import CarInfo from '../_component/car_info';
import {getDepart} from '../_modules/tool';


const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

const styles={
    main_mobile:{width:'90%',paddingTop:'50px',marginLeft:'5%',marginRight:'5%',},
    bottomBtn:{width:'100%',display:'block',textAlign:'right',paddingTop:'5px'},
    iconStyle:{marginRight: '12px'},
    sonpage:{paddingLeft:'1em',paddingRight:'1em'},
    td_left:{whiteSpace:'nowrap'},
    td_right:{paddingLeft:'1em'}
}

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            vehicles:[],            //所有车辆
            isEditingDriver:false,  //正在编辑驾驶人员，为true则显示'驾驶人员'子页面
            isEditingDevice:false,  //正在编辑设备，为true则显示'设备管理'子页面
            isShowingInfo:false,    //正在显示信息，为true则显示'详细信息'子页面
            curCar:{},              //当前车辆，用于显示'驾驶人员''设备管理'的时候判断当前所选车辆
            drivers:[],             //驾驶人员，当前所选车辆的驾驶人员数组
            did:{},                 //设备id，当前所选车辆绑定的设备id
            fabDisplay:'block',     //feb的display，当显示子页面的时候，设置为'none'以隐藏右下角'添加车辆'按钮
        }
        //'驾驶人员'相关
        this.editDriver=this.editDriver.bind(this);
        this.editDriverCancel=this.editDriverCancel.bind(this);
        this.editDriverSubmit=this.editDriverSubmit.bind(this);
        //'设备信息'相关
        this.editDevice=this.editDevice.bind(this);
        this.editDeviceCancel=this.editDeviceCancel.bind(this);
        this.editDeviceSubmit=this.editDeviceSubmit.bind(this);
        //'更多信息'相关
        this.showInfo=this.showInfo.bind(this);
        this.showInfoCancel=this.showInfoCancel.bind(this);
        this.showInfoSubmit=this.showInfoSubmit.bind(this);
    }
    getChildContext() {
        return {
            view:thisView//用于carBrand的子页面打开
        };
    }

    componentDidMount(){
        this.getVehicles();//初始化时获取所有车辆数据
        let that=this;
        thisView.addEventListener('message',function(e){
            if(e.data=='add_car'){
                that.getVehicles();
            }
        });
    }
    getVehicles(){
        Wapi.vehicle.list(res=>{
            if(res.data.length>0){
                this.setState({
                    vehicles:res.data,
                });
            }
        },{
            uid:_user.customer.objectId
        },{
            fields:'objectId,name,uid,departId,brandId,brand,model,modelId,type,typeId,desc,frameNo,engineNo,buyDate,mileage,maintainMileage,insuranceExpireIn,inspectExpireIn,serviceType,feeType,serviceRegDate,serviceExpireIn,did,drivers,managers,deviceType'
        });
    }
    
    addCar(){
        thisView.goTo('car_add.js');//跳转到新增车辆页面
    }
    
    editDriver(car){
        this.setState({
            curCar:car,
            isEditingDriver:true,
            fabDisplay:'none',
        });
    }
    editDriverCancel(){
        this.setState({
            isEditingDriver:false,
            fabDisplay:'block',
        });
    }
    editDriverSubmit(){
        this.editDriverCancel();
    }

    editDevice(car){
        let _this=this;
        if(!car.did){
            W.confirm(___.confirm_device_bind,function(b){
                if(b){
                    _this.setState({
                        isEditingDevice:true,
                        fabDisplay:'none',
                        curCar:car,
                    });
                }else{
                    return;
                }
            });
        }else{
            _this.setState({
                isEditingDevice:true,
                fabDisplay:'none',
                curCar:car,
            });
        }
    }
    editDeviceCancel(){
        this.setState({
            isEditingDevice:false,
            fabDisplay:'block',
        });
    }
    editDeviceSubmit(data){
        this.setState({
            isEditingDevice:false,
            fabDisplay:'block',
        });
        this.getVehicles();
    }
    
    showInfo(car){
        this.setState({
            curCar:car,
            isShowingInfo:true,
            fabDisplay:'none',
        });
    }
    showInfoCancel(){
        this.setState({
            isShowingInfo:false,
            fabDisplay:'block',
        });
        this.getVehicles();
    }
    showInfoSubmit(){
        this.setState({
            isShowingInfo:false,
            fabDisplay:'block',
        });
    }

    render() {
        return (
            <ThemeProvider>
                <div>
                    <AppBar title={___.car_manage} style={{position:'fixed',top:'0px'}} />
                    <div style={styles.main_mobile} >
                        <Cars data={this.state.vehicles} editDriver={this.editDriver} editDevice={this.editDevice} showInfo={this.showInfo} />
                    </div>
                    <Fab sty={{display:this.state.fabDisplay}} onClick={this.addCar}/>
                    
                    <Sonpage open={this.state.isEditingDriver} back={this.editDriverCancel}>
                        <CarDriver cancel={this.editDriverCancel} submit={this.editDriverSubmit} curCar={this.state.curCar}/>
                    </Sonpage>
                    
                    <Sonpage open={this.state.isEditingDevice} back={this.editDeviceCancel}>
                        <CarDevice cancel={this.editDeviceCancel} submit={this.editDeviceSubmit} curCar={this.state.curCar}/>
                    </Sonpage>
                    
                    <Sonpage open={this.state.isShowingInfo} back={this.showInfoCancel}>
                        <CarInfo cancel={this.showInfoCancel} submit={this.showInfoSubmit} curCar={this.state.curCar}/>
                    </Sonpage>
                </div>
            </ThemeProvider>
        );
    }
}
App.childContextTypes = {
    view: React.PropTypes.object
};

class Cars extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    render(){
        let vehicleItems = this.props.data.map(ele=>
            <Card key={ele.objectId} style={{marginTop:'1em',padding:'0.5em 1em'}} >
                <table >
                    <tbody >
                        <tr>
                            <td style={styles.td_left}>{___.carNum}</td>
                            <td style={styles.td_right}>{ele.name}</td>
                        </tr>
                        <tr>
                            <td style={styles.td_left}>{___.car_model}</td>
                            <td style={styles.td_right}>{ele.brand+' '+ele.model}</td>
                        </tr>
                        <tr>
                            <td style={styles.td_left}>{___.car_depart}</td>
                            <td style={styles.td_right}>{getDepart(ele.departId)}</td>
                        </tr>
                        <tr>
                            <td style={styles.td_left}>{___.device_type}</td>
                            <td style={styles.td_right}>{ele.deviceType}</td>
                        </tr>
                        <tr>
                            <td style={styles.td_left}>{___.service_type}</td>
                            <td style={styles.td_right}>{ele.serviceType}</td>
                        </tr>
                        <tr>
                            <td style={styles.td_left}>{___.service_expireIn}</td>
                            <td style={styles.td_right}>{ele.serviceExpireIn}</td>
                        </tr>
                    </tbody>
                </table>
                <Divider />
                <div style={styles.bottomBtn}>
                    <DriverBtn data={ele} onClick={this.props.editDriver} />
                    <DeviceBtn data={ele} onClick={this.props.editDevice} />
                    <InfoBtn data={ele} onClick={this.props.showInfo}/>
                </div>
            </Card>);
        return(
            <div style={{paddingBottom:'70px'}}>
                {vehicleItems}
            </div>
        );
    }
}


const _driver={
    name:'123',
    status:'0',
    distributeTime:'2016-08-22',
    syncTime:'今天',
    bindTime:'明天',
    stopTime:'后天',
}
const _drivers=[];
for(let i=0;i<9;i++){
    _drivers[i]=_driver;
}
const _statuses=['status0','status1','status2'];

class DriverBtn extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    handleClick(){
        this.props.onClick(this.props.data);
    }
    render(){
        return(
            <ActionAccountCircle style={styles.iconStyle} onClick={this.handleClick.bind(this)} />
        )
    }
}

class DeviceBtn extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    handleClick(){
        this.props.onClick(this.props.data);
    }
    render(){
        return(
            <ActionSettings style={styles.iconStyle} onClick={this.handleClick.bind(this)} />
        )
    }
}

class InfoBtn extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    handleClick(){
        this.props.onClick(this.props.data);
    }
    render(){
        return(
            <ActionInfo style={styles.iconStyle} onClick={this.handleClick.bind(this)} />
        )
    }
}

