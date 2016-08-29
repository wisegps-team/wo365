import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {Provider,connect} from 'react-redux';

import STORE from '../_reducers/main';
import Fab from '../_component/base/fab';
import Input from '../_component/base/input';

import AppBar from 'material-ui/AppBar';
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
import APP from '../_component/pc/app';
import SonPage from '../_component/base/sonPage';


const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

const styles={
    main:{width:'100%',paddingLeft:'25px',paddingRight:'25px'},
    bottomBtn:{width:'100%',display:'block',textAlign:'right',paddingTop:'5px'},
    iconStyle:{marginRight: '12px'},
    sonpage:{paddingLeft:'1em',paddingRight:'1em'},
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
    }
    getVehicles(){
        Wapi.vehicle.list(res=>{
            if(res.data.length>0){
                this.setState({
                    vehicles:res.data,
                });
            }
        },{
            uid:_user.uid
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

        // let _this=this;
        // if(car.drivers.length==0){
        //     W.confirm(___.confirm_driver_add,function(b){
        //         if(b){
        //             _this.setState({
        //                 curCar:car,
        //                 isEditingDriver:true,
        //                 fabDisplay:'none',
        //             });
        //         }else{
        //             return;
        //         }
        //     });
        // }else{
        //     this.setState({
        //         curCar:car,
        //         isEditingDriver:true,
        //     });
        // }
    }
    editDriverCancel(){
        this.setState({
            isEditingDriver:false,
            fabDisplay:'block',
        });
    }
    editDriverSubmit(){
        this.setState({
            isEditingDriver:false,
            fabDisplay:'block',
        });
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
    }
    showInfoSubmit(){
        this.setState({
            isShowingInfo:false,
            fabDisplay:'block',
        });
    }

    render() {
        return (
            <APP leftBar={false}>
                <div style={styles.main} >
                    <Cars data={this.state.vehicles} editDriver={this.editDriver} editDevice={this.editDevice} showInfo={this.showInfo} />
                </div>
                <Fab sty={{display:this.state.fabDisplay}} onClick={this.addCar}/>
                
                <SonPage open={this.state.isEditingDriver} back={this.editDriverCancel}>
                    <DriverDiv cancel={this.editDriverCancel} submit={this.editDriverSubmit} curCar={this.state.curCar}/>
                </SonPage>
                
                <SonPage open={this.state.isEditingDevice} back={this.editDeviceCancel}>
                    <DeviceDiv cancel={this.editDeviceCancel} submit={this.editDeviceSubmit} curCar={this.state.curCar}/>
                </SonPage>
                
                <SonPage open={this.state.isShowingInfo} back={this.showInfoCancel}>
                    <InfoDiv cancel={this.showInfoCancel} submit={this.showInfoSubmit} curCar={this.state.curCar}/>
                </SonPage>
            </APP>
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
                            <td>{___.carNum}</td>
                            <td>{ele.name}</td>
                        </tr>
                        <tr>
                            <td>{___.car_model}</td>
                            <td>{ele.brand+' '+ele.model}</td>
                        </tr>
                        <tr>
                            <td>{___.car_depart}</td>
                            <td>{ele.departId}</td>
                        </tr>
                        <tr>
                            <td>{___.device_type}</td>
                            <td>{ele.deviceType}</td>
                        </tr>
                        <tr>
                            <td>{___.service_type}</td>
                            <td>{ele.serviceType}</td>
                        </tr>
                        <tr>
                            <td>{___.service_expireIn}</td>
                            <td>{ele.serviceExpireIn}</td>
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
class DriverDiv extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            drivers:_drivers,
            isAdding:false,
        }
        this.submit=this.submit.bind(this);
        this.add=this.add.bind(this);
        this.addCancel=this.addCancel.bind(this);
        this.addSubmit=this.addSubmit.bind(this);
    }
    submit(){
        this.props.submit();
    }
    add(){
        this.setState({isAdding:true});
    }
    addCancel(){
        this.setState({isAdding:false});
    }
    addSubmit(driver){
        let car=this.props.curCar;
        let drivers=this.state.drivers;
        drivers.push(driver);
        Wapi.vehicle.update(res=>{
            this.setState({isAdding:false});
        },{
            _objectId:car.objectId,
            drivers:drivers,
        });
    }
    componentDidMount(){
        let drivers=this.props.curCar.drivers||[];
        this.setState({drivers:drivers});
    }
    componentWillReceiveProps(nextProps){
        let drivers=nextProps.curCar.drivers||[];
        this.setState({drivers:drivers});
    }
    render(){
        let data=this.state.drivers;
        // let data=_drivers;
        
        let main;
        let addPage;
        if(WiStorm.agent.mobile){
            let driverItems=data.map((ele,index)=>
                <Card key={index} style={{marginTop:'1em',padding:'0.5em 1em'}} >
                    <table>
                        <tbody>
                            <tr>
                                <td>{___.person}</td>
                                <td>{ele.name}</td>
                            </tr>
                            <tr>
                                <td>{___.driver_status}</td>
                                <td>{ele.status}</td>
                            </tr>
                            <tr>
                                <td>{___.distribute_time}</td>
                                <td>{ele.distributeTime?ele.distributeTime.slice(5,10):''}</td>
                            </tr>
                            <tr>
                                <td>{___.sync_time}</td>
                                <td>{ele.syncTime?ele.syncTime.slice(5,10):''}</td>
                            </tr>
                            <tr>
                                <td>{___.bind_time}</td>
                                <td>{ele.bindTime?ele.bindTime.slice(5,10):''}</td>
                            </tr>
                            <tr>
                                <td>{___.stop_time}</td>
                                <td>{ele.stopTime?ele.stopTime.slice(5,10):''}</td>
                            </tr>
                        </tbody>
                    </table>
                </Card>
            );
            main=driverItems;
            addPage=<SonPage open={this.state.isAdding} back={this.addCancel}>
                        <DriverAdd cancel={this.addCancel} submit={this.addSubmit}/>
                    </SonPage>;
        }else{
            let driverItems=data.map((ele,index)=>
                <TableRow key={index} >
                    <TableRowColumn>{ele.name}</TableRowColumn>
                    <TableRowColumn>{ele.status}</TableRowColumn>
                    <TableRowColumn>{ele.distributeTime?ele.distributeTime.slice(5,10):''}</TableRowColumn>
                    <TableRowColumn>{ele.syncTime?ele.syncTime.slice(5,10):''}</TableRowColumn>
                    <TableRowColumn>{ele.bindTime?ele.bindTime.slice(5,10):''}</TableRowColumn>
                    <TableRowColumn>{ele.stopTime?ele.stopTime.slice(5,10):''}</TableRowColumn>
                </TableRow>);
            main=<Table fixedHeader={true}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow key={0}>
                            <TableHeaderColumn>{___.person}</TableHeaderColumn>
                            <TableHeaderColumn>{___.driver_status}</TableHeaderColumn>
                            <TableHeaderColumn>{___.distribute_time}</TableHeaderColumn>
                            <TableHeaderColumn>{___.sync_time}</TableHeaderColumn>
                            <TableHeaderColumn>{___.bind_time}</TableHeaderColumn>
                            <TableHeaderColumn>{___.stop_time}</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} stripedRows={true}>
                        {driverItems}
                    </TableBody>
                </Table>;
            addPage=<Dialog
                        title={___.add_driver}
                        modal={false}
                        open={this.state.isAdding}
                        autoScrollBodyContent={true}
                        onRequestClose={this.addCancel}
                        >
                        <DriverAdd cancel={this.addCancel} submit={this.addSubmit}/>
                    </Dialog>;
        }

        return(
            <div style={styles.sonpage}>
                {main}
                <div style={{marginTop:'1em',marginLeft:'1em', display:data.length>0?'none':'block'}}>{___.confirm_driver_add}</div>
                <div style={styles.bottomBtn}>
                    <FlatButton
                        label={___.cancel}
                        primary={true}
                        onClick={this.props.cancel}
                    />
                    <FlatButton
                        label={___.add}
                        primary={true}
                        onClick={this.add}
                    />
                </div>
                {addPage}
            </div>
        )
    }
}
class DriverAdd extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            name:'',
            status:1,
            distributeTime:'',
            syncTime:'',
            bindTime:'',
            stopTime:'',

            statuses:[],
        }
        this.nameChange=this.nameChange.bind(this);
        this.statusChange=this.statusChange.bind(this);
        this.distributeTimeChange=this.distributeTimeChange.bind(this);
        this.syncTimeChange=this.syncTimeChange.bind(this);
        this.bindTimeChange=this.bindTimeChange.bind(this);
        this.stopTimeChange=this.stopTimeChange.bind(this);
        this.submit=this.submit.bind(this);
    }
    componentDidMount(){
        this.setState({statuses:_statuses});
    }
    nameChange(e,value){
        this.setState({name:value});
    }
    statusChange(e,value){
        this.setState({status:value});
    }
    distributeTimeChange(e,value){
        this.setState({distributeTime:W.dateToString(value).slice(0,10)});
    }
    syncTimeChange(e,value){
        this.setState({syncTime:W.dateToString(value).slice(0,10)});
    }
    bindTimeChange(e,value){
        this.setState({bindTime:W.dateToString(value).slice(0,10)});
    }
    stopTimeChange(e,value){
        this.setState({stopTime:W.dateToString(value).slice(0,10)});
    }
    submit(){
        let data={
            name:this.state.name,
            status:this.state.statuses[this.state.status],
            distributeTime:this.state.distributeTime,
            syncTime:this.state.syncTime,
            bindTime:this.state.bindTime,
            stopTime:this.state.stopTime,
        }
        this.props.submit(data);
    }
    render(){
        let statusItems=this.state.statuses.map((ele,index)=><MenuItem value={index} primaryText={ele} key={index}/>);
        return(
            <div style={styles.sonpage} >
                <table>
                    <tbody>
                        <tr>
                            <td>{___.person}</td>
                            <td><TextField id='name' onChange={this.nameChange} /></td>
                        </tr>
                        <tr>
                            <td>{___.driver_status}</td>
                            <td>
                                <SelectField id='status' value={this.state.status} onChange={this.statusChange}>
                                    {statusItems}
                                </SelectField>
                            </td>
                        </tr>
                        <tr>
                            <td>{___.distribute_time}</td>
                            <td>
                                <DatePicker 
                                    id='distributeTime' 
                                    hintText={___.please_pick_date}
                                    onChange={this.distributeTimeChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{___.sync_time}</td>
                            <td>
                                <DatePicker 
                                    id='syncTime' 
                                    hintText={___.please_pick_date}
                                    onChange={this.syncTimeChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{___.bind_time}</td>
                            <td>
                                <DatePicker 
                                    id='bindTime' 
                                    hintText={___.please_pick_date}
                                    onChange={this.bindTimeChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{___.bind_time}</td>
                            <td>
                                <DatePicker 
                                    id='stopTime' 
                                    hintText={___.please_pick_date}
                                    onChange={this.stopTimeChange}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div style={styles.bottomBtn}>
                    <FlatButton
                        label={___.cancel}
                        primary={true}
                        onClick={this.props.cancel}
                    />
                    <FlatButton
                        label={___.ok}
                        primary={true}
                        onClick={this.submit}
                    />
                </div>
            </div>
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
class DeviceDiv extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            did:'',
            model:'',
            verify:false,
            warnSpeed:'',
            time:'',
            noEdit:false,
            deviceStatus:'null',
        }
        this.edit=this.edit.bind(this);
        this.didChange=this.didChange.bind(this);
        this.verifyChange=this.verifyChange.bind(this);
        this.warnSpeedChange=this.warnSpeedChange.bind(this);
        this.timeChange=this.timeChange.bind(this);
        this.submit=this.submit.bind(this);
    }
    edit(){
        this.setState({noEdit:false});
    }
    didChange(e,value){
        this.setState({did:value});
        Wapi.device.get(res=>{
            console.log(res);
            if(res.data==null){
                this.setState({deviceStatus:'null'});
            }else if(res.data.vehicleId&&res.data.vehicleId!=this.props.curCar.objectId){
                W.alert("该设备已绑定其他车辆");
                this.setState({deviceStatus:'binded'});
            }else if(res.data.vehicleId){
                this.setState({
                    did:value,
                    model:res.data.model,
                    deviceStatus:'ok',
                });
            }
        },{
            did:value
        },{
            fields:'did,uid,status,commType,commSign,model,vehicleId'
        });
    }
    warnSpeedChange(e,value){
        this.setState({warnSpeed:value});
    }
    timeChange(e,value){
        this.setState({time:value});
    }
    verifyChange(e,value){
        this.setState({verify:value});
    }
    submit(){
        console.log('submit')
        if(this.state.did==''){
            alert(___.device_id_empty);
            return;
        }
        if(this.state.deviceStatus=='binded'){
            W.alert("该终端设备已绑定其他车辆,请确认后重新输入");
            return;
        }else if(this.state.deviceStatus=='null'){
            W.alert("请输入正确的终端编号")
            return;
        }

        //更新车辆的设备信息
        Wapi.vehicle.update(res=>{
            console.log(res);
        },{
            _objectId:this.props.curCar.objectId,
            did:this.state.did,
            deviceType:this.state.model,
        });

        //更新设备的信息
        let now=W.dateToString(new Date());
        Wapi.device.update(res=>{
            console.log(res);
            this.props.submit();
        },{
            _did:this.state.did,
            uid:_user.uid,
            bindDate:now,
            vehicleName:this.props.curCar.name,
            vehicleId:this.props.curCar.objectId,
        });

        //发送指令
        let command=false;
        if(command){
            Wapi.device.sendCommand(res=>{
                console.log(res);
            },{
                did:this.state.did,
                cmd_type:a.type,
                params:{}
            });
        }
    }
    componentDidMount(){
        if(this.props.curCar.did){//如果当前选中车辆已绑定终端，则显示其终端编号和终端型号
            this.setState({
                did:this.props.curCar.did,
                model:this.props.curCar.deviceType,
                noEdit:true,
            })
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.curCar.did){//如果当前选中车辆已绑定终端，则显示其终端编号和终端型号
            this.setState({
                did:nextProps.curCar.did,
                model:nextProps.curCar.deviceType,
                noEdit:true,
            });
        }else{//如果当前选中车辆未绑定终端，则重置其终端编号和终端型号为空
            this.setState({
                did:'',
                model:'',
                noEdit:false,
            });
        }
    }
    render(){
        console.log('device page render');
        console.log(this.props.curCar);
        let btnRight=<div/>
        if(this.state.noEdit){
            btnRight=<FlatButton
                        label={___.edit}
                        primary={true}
                        onClick={this.edit}
                    />
        }else{
            btnRight=<FlatButton
                        label={___.ok}
                        primary={true}
                        onClick={this.submit}
                    />
        }
        return(
            <div>
                <div style={styles.sonpage}>
                    <Input floatingLabelText={___.device_id} id='did' onChange={this.didChange} value={this.state.did}  disabled={this.state.noEdit}/>
                    <div style={{paddingBottom:'1em'}} ><span>{___.device_type+': '}</span><span id='model'>{this.state.model}</span></div>
                    <Checkbox id='verify' label={___.driver_verify} onCheck={this.verifyChange} defaultChecked={this.state.verify} disabled={this.state.noEdit} />
                    <Input floatingLabelText={___.warn_speed} id='warnSpeed' onChange={this.warnSpeedChange} value={this.state.warnSpeed}  disabled={this.state.noEdit}/>
                    <Input floatingLabelText={___.forbidden_time} id='time' onChange={this.timeChange} value={this.state.time}  disabled={this.state.noEdit}/>
                </div>
                <div style={styles.bottomBtn}>
                    <FlatButton
                        label={___.cancel}
                        primary={true}
                        onClick={this.props.cancel}
                    />
                    {btnRight}
                </div>
            </div>
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
class InfoDiv extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            onManage:false
        }
        this.onManageChange=this.onManageChange.bind(this);
        this.submit=this.submit.bind(this);
    }
    onManageChange(e,value){
        this.setState({onManage:value});
    }
    submit(){
        this.props.submit();
    }
    render(){
        let car=this.props.curCar;
        return(
            <div>
                <Tabs>
                    <Tab label={___.base_info}>
                        <table style={styles.sonpage}>
                            <tbody>
                                <tr>
                                    <td>{___.carNum}</td>
                                    <td>{car.name}</td>
                                </tr>
                                <tr>
                                    <td>{___.brand}</td>
                                    <td>{car.brand+' '+car.model}</td>
                                </tr>
                                <tr>
                                    <td>{___.frame_no}</td>
                                    <td>{car.frameNo}</td>
                                </tr>
                                <tr>
                                    <td>{___.engine_no}</td>
                                    <td>{car.engineNo}</td>
                                </tr>
                                <tr>
                                    <td>{___.buy_date}</td>
                                    <td>{car.buyDate?car.buyDate.slice(0,10):''}</td>
                                </tr>
                                <tr>
                                    <td>{___.car_depart}</td>
                                    <td>{car.departId}</td>
                                </tr>
                                <tr>
                                    <td>{___.on_manage}</td>
                                    <td><Checkbox id='onManage' onCheck={this.onManageChange} defaultChecked={this.state.onManage} /></td>
                                </tr>
                                <tr>
                                    <td>{___.management}</td>
                                    <td>{car.managers}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Tab>
                    <Tab label={___.insurance_info}>
                        <table style={styles.sonpage}>
                            <tbody>
                                <tr>
                                    <td>{___.mileage}</td>
                                    <td>{car.mileage}</td>
                                </tr>
                                <tr>
                                    <td>{___.maintain_mileage}</td>
                                    <td>{car.maintainMileage}</td>
                                </tr>
                                <tr>
                                    <td>{___.insurance_expire}</td>
                                    <td>{car.insuranceExpireIn?car.insuranceExpireIn.slice(0,10):''}</td>
                                </tr>
                                <tr>
                                    <td>{___.inspect_expireIn}</td>
                                    <td>{car.inspectExpireIn?car.inspectExpireIn.slice(0,10):''}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Tab>
                    <Tab label={___.financial_info}>
                        <table style={styles.sonpage}>
                            <tbody>
                                <tr>
                                    <td>{___.service_type}</td>
                                    <td>{car.serviceType}</td>
                                </tr>
                                <tr>
                                    <td>{___.charge_standard}</td>
                                    <td>{car.feeType}</td>
                                </tr>
                                <tr>
                                    <td>{___.service_reg_date}</td>
                                    <td>{car.serviceRegDate||''}</td>
                                </tr>
                                <tr>
                                    <td>{___.service_expire}</td>
                                    <td>{car.serviceExpireIn||''}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Tab>
                </Tabs>
                <div style={styles.bottomBtn}>
                    <FlatButton
                        label={___.cancel}
                        primary={true}
                        onClick={this.props.cancel}
                    />
                    <FlatButton
                        label={___.ok}
                        primary={true}
                        onClick={this.submit}
                    />
                </div>
            </div>
        )
    }
}

