import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {Provider,connect} from 'react-redux';

import STORE from '../_reducers/main';
import Feb from '../_component/base/fab';
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
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';


import CarBrand from '../_component/base/carBrand';
import APP from '../_component/pc/app';


/**
 * Use the native Intl.DateTimeFormat if available, or a polyfill if not.
 */
// let DateTimeFormat;
// if (areIntlLocalesSupported(['zh'])) {
//   DateTimeFormat = global.Intl.DateTimeFormat;
// } else {
//   const IntlPolyfill = require('intl');
//   DateTimeFormat = IntlPolyfill.DateTimeFormat;
//   require('intl/locale-data/jsonp/zh');
// }


window.addEventListener('load',function(){
    ReactDOM.render(
            <App/>
        ,W('#APP'));

    // thisView.prefetch('component/carBrand.js',1);
});

let _vehicle={
    name:'号车牌',
    model:'一个车系',
    departId:'一个部门id',
    deviceType:'一个终端型号',//车辆表里面只有did，型号需要通过did另取
    serviceType:2,//服务类型
    serviceExpireIn:'2016-12-22',//服务到期日
}
let _vehicles=[];
for(let i=0;i<20;i++){
    let vehicle=Object.assign({},_vehicle);
    vehicle.name=i+vehicle.name;
    _vehicles[i]=vehicle;
}

let _driver={
    name:'明明',

}

const styles={
    main:{marginLeft:'25px',marginRight:'25px'},
    iconStyle:{marginRight: 24},
    bottomBtn:{width:'100%',display:'block',textAlign:'right'},
}


class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            vehicles:[],
            height:window.innerHeight-120,
            isAddingCar:false,
            isEditingDriver:false,
            drivers:{},
            isEditingDevice:false,
            did:{},
        }
        this.addCar=this.addCar.bind(this);
        this.addCarCancel=this.addCarCancel.bind(this);
        this.addCarSubmit=this.addCarSubmit.bind(this);
        this.editDriver=this.editDriver.bind(this);
        this.editDriverCancel=this.editDriverCancel.bind(this);
        this.editDriverSubmit=this.editDriverSubmit.bind(this);
        this.editDevice=this.editDevice.bind(this);
        this.editDeviceCancel=this.editDeviceCancel.bind(this);
        this.editDeviceSubmit=this.editDeviceSubmit.bind(this);
    }

    componentDidMount(){
        this.getVehicles();
    }
    getVehicles(){
        Wapi.vehicle.list(res=>{
            console.log(res);
            if(res.data.length>0){
                this.setState({
                    vehicles:res.data,
                });
            }
        },{
            uid:_user.uid
        },{
            fields:'objectId,name,uid,departId,brandId,brand,model,modelId,type,typeId,desc,frameNo,engineNo,buyDate,mileage,maintainMileage,insuranceExpireIn,inspectExpireIn,serviceType,feeType,serviceRegDate,serviceExpireIn,did'
        });
    }

    addCar(){
        this.setState({isAddingCar:true});
    }
    addCarCancel(){
        this.setState({isAddingCar:false});
    }
    addCarSubmit(data){
        console.log(data);
        let _this=this;
        Wapi.vehicle.add(res=>{
            console.log(res);
            this.setState({isAddingCar:false});
            this.getVehicles();
        },data);
    }

    editDriver(){
        this.setState({isEditingDriver:true});
    }
    editDriverCancel(){
        console.log('editDriverCancel');
        this.setState({isEditingDriver:false});
    }
    editDriverSubmit(){
        console.log('editDriverSubmit');
        this.setState({isEditingDriver:false});
    }

    editDevice(did){
        console.log('edit device')
        let _this=this;
        if(!did){
            W.confirm('所选车辆尚未绑定终端，是否现在绑定？',function(b){
                if(b){
                    _this.setState({
                        isEditingDevice:true,
                        did:did,
                    });
                }else{
                    return;
                }
            });
        }
    }
    editDeviceCancel(){
        console.log('editDriverCancel');
        this.setState({isEditingDevice:false});
    }
    editDeviceSubmit(data){
        console.log('editDriverSubmit');
        this.setState({isEditingDevice:false});
    }

    render() {
        let vehicleItems = this.state.vehicles.map(ele=>
            <TableRow key={ele.objectId} style={{marginRight:'20px'}}>
                <TableRowColumn>{ele.name}</TableRowColumn>
                <TableRowColumn>{ele.brand+' '+ele.model}</TableRowColumn>
                <TableRowColumn>{ele.departId}</TableRowColumn>
                <TableRowColumn>{ele.deviceType}</TableRowColumn>
                <TableRowColumn>{ele.serviceType}</TableRowColumn>
                <TableRowColumn>{ele.serviceExpireIn}</TableRowColumn>
                <TableRowColumn>
                    <DriverBtn data={ele} onClick={this.editDriver} />
                    <DeviceBtn did={ele.did} onClick={this.editDevice} />
                    <InfoBtn data={ele} onClick={this.editDevice}/>
                </TableRowColumn>
            </TableRow>);
        vehicleItems.push(<TableRow key={-1}/>);//最后加上一条空的信息，防止最下面一个车辆元素右侧图标被“添加”按钮挡住
        return (
            <APP>
                <div style={styles.main} >
                    <Table height={this.state.height+'px'} fixedHeader={true}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow key={0}>
                                <TableHeaderColumn>{___.carNum}</TableHeaderColumn>
                                <TableHeaderColumn>{___.car_model}</TableHeaderColumn>
                                <TableHeaderColumn>{___.car_depart}</TableHeaderColumn>
                                <TableHeaderColumn>{___.device_type}</TableHeaderColumn>
                                <TableHeaderColumn>{___.service_type}</TableHeaderColumn>
                                <TableHeaderColumn>{___.service_expireIn}</TableHeaderColumn>
                                <TableHeaderColumn>{ }</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false} stripedRows={true} style={{paddingRigth:'20px'}}>
                            {vehicleItems}
                        </TableBody>
                    </Table>
                </div>
                <Feb onClick={this.addCar}/>
                <Dialog
                    title="新增车辆"
                    modal={false}
                    open={this.state.isAddingCar}
                    autoScrollBodyContent={true}
                    onRequestClose={this.addCarCancel}
                    >
                    <AddCar cancel={this.addCarCancel} submit={this.addCarSubmit}/>
                </Dialog>
                
                <Dialog
                    title="驾驶人员"
                    modal={false}
                    open={this.state.isEditingDriver}
                    autoScrollBodyContent={true}
                    onRequestClose={this.editDriverCancel}
                    >
                    <DriverDiv cancel={this.editDriverCancel} submit={this.editDriverSubmit} data={this.state.drivers}/>
                </Dialog>
                
                <Dialog
                    title={___.device_manage}
                    modal={false}
                    open={this.state.isEditingDevice}
                    autoScrollBodyContent={true}
                    onRequestClose={this.editDeviceCancel}
                    >
                    <DeviceDiv cancel={this.editDeviceCancel} submit={this.editDeviceSubmit} data={this.state.did}/>
                </Dialog>
            </APP>
        );
    }
}

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
const driver={
    contact:'123',
    state:'0',
    distributeTime:'昨天',
    syncTime:'今天',
    bindTime:'明天',
    stopTime:'后天',
}
const drivers=[];
for(let i=0;i<3;i++){
    drivers[i]=driver;
}
class DriverDiv extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    submit(){
        this.props.submit();
    }
    render(){
        let data=this.props.drivers;
        return(
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>联系人</td>
                            <td>{123}</td>
                        </tr>
                        <tr>
                            <td>当前状态</td>
                            <td>{123}</td>
                        </tr>
                        <tr>
                            <td>分配时间</td>
                            <td>{123}</td>
                        </tr>
                        <tr>
                            <td>同步时间</td>
                            <td>{123}</td>
                        </tr>
                        <tr>
                            <td>绑定时间</td>
                            <td>{123}</td>
                        </tr>
                        <tr>
                            <td>停用时间</td>
                            <td>{123}</td>
                        </tr>
                    </tbody>
                </table>
                <div style={styles.bottomBtn}>
                    <FlatButton
                        label={___.cancel}
                        primary={true}
                        onTouchTap={this.props.cancel}
                    />
                    <FlatButton
                        label={___.ok}
                        primary={true}
                        onTouchTap={this.submit.bind(this)}
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
        this.props.onClick(this.props.did);
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
    didChange(){}
    verifyChange(){}
    warnSpeedChange(){}
    timeChange(){}
    submit(){
        let data={
            did:this.state.did,
            verify:this.state.verify,
            warnSpeed:this.state.warnSpeed,
            time:this.state.time,
        }
        this.props.submit();
    }
    componentDidMount(){
        let did=this.props.did;
        // this.setState({
        //     did:'123',
        //     model:'123',
        //     verify:true,
        //     warnSpeed:'123',
        //     time:'123',
        //     noEdit:true,
        // });
    }
    render(){
        let btnLeft=<div/>
        if(this.state.noEdit){
            btnLeft=<FlatButton
                        label={___.edit}
                        primary={true}
                        onTouchTap={this.edit}
                    />
        }else{
            btnLeft=<FlatButton
                        label={___.cancel}
                        primary={true}
                        onTouchTap={this.props.cancel}
                    />
        }
        return(
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>终端编号</td>
                            <td><TextField id='did' hintText={this.state.did} disabled={this.state.noEdit} /></td>
                        </tr>
                        <tr>
                            <td>终端型号</td>
                            <td><TextField id='model' hintText={this.state.model} disabled={true} /></td>
                        </tr>
                        <tr>
                            <td>超速报警</td>
                            <td><TextField id='warnSpeed' hintText={this.state.warnSpeed} disabled={this.state.noEdit} /></td>
                        </tr>
                        <tr>
                            <td>禁行时段</td>
                            <td><TextField id='time' hintText={this.state.time} disabled={this.state.noEdit} /></td>
                        </tr>
                        <tr>
                            <td>司机身份识别</td>
                            <td><Checkbox id='verify' defaultChecked={this.state.verify} disabled={this.state.noEdit} /></td>
                        </tr>
                    </tbody>
                </table>
                <div style={styles.bottomBtn}>
                    {btnLeft}
                    <FlatButton
                        label={___.ok}
                        primary={true}
                        onTouchTap={this.submit}
                    />
                </div>
            </div>
        )
    }
}

class InfoBtn extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    render(){
        return(
            <div/>
        )
    }
}

class AddCar extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            name:'',
            uid:'',
            brand:'',
            brandId:'',
            model:'',
            modelId:'',
            type:'',
            typeId:'',
            frameNo:'',
            engineNo:'',
            buyDate:'',
            mileage:'',
            maintainMileage:'',
            insuranceExpireIn:'',
            inspectExpireIn:'',
            departId:1,
        }
        this.changeNum=this.changeNum.bind(this);
        this.changeBrand=this.changeBrand.bind(this);
        this.changeFrame=this.changeFrame.bind(this);
        this.changeEngine=this.changeEngine.bind(this);
        this.changeBuyDate=this.changeBuyDate.bind(this);
        this.changeMileage=this.changeMileage.bind(this);
        this.changeMaintainMileage=this.changeMaintainMileage.bind(this);
        this.changeInsuranceExpiry=this.changeInsuranceExpiry.bind(this);
        this.changeCheckExpiry=this.changeCheckExpiry.bind(this);
        this.changeDepartment=this.changeDepartment.bind(this);
        this.submit=this.submit.bind(this);
    }
    componentDidMount(){
        this.setState({uid:_user.uid});
    }
    changeNum(e,name){
        this.setState({name:name});
    }
    changeBrand(data){
        console.log(data);
        let brand=data.brand;
        let brandId=data.brandId;
        let serie=data.serie;
        let serieId=data.serieId;
        let type=data.type;
        let typeId=data.typeId;
        this.setState({
            brand:brand,
            brandId:brandId,
            model:serie,
            modelId:serieId,
            type:type,
            typeId:typeId,
        });
    }
    changeFrame(e,frameNo){
        this.setState({frameNo:frameNo});
    }
    changeEngine(e,engineNo){
        this.setState({engineNo:engineNo});
    }
    changeBuyDate(e,date){
        date=W.dateToString(date).slice(0,10);
        this.setState({buyDate:date});
    }
    changeMileage(e,mileage){
        this.setState({mileage:mileage});
    }
    changeMaintainMileage(e,maintainMileage){
        this.setState({maintainMileage:maintainMileage});
    }
    changeInsuranceExpiry(e,date){
        date=W.dateToString(date).slice(0,10);
        this.setState({insuranceExpireIn:date});
    }
    changeCheckExpiry(e,date){
        date=W.dateToString(date).slice(0,10);
        this.setState({inspectExpireIn:date});
    }
    changeDepartment(e,departId){
        this.setState({departId:departId});
    }
    submit(){
        if(this.state.name==''){
            alert('车牌号 不能为空');
            return;
        }
        if(this.state.brand==''){
            alert('车辆型号 不能为空');
            return;
        }
        if(this.state.frameNo==''){
            alert('车架号 不能为空');
            return;
        }
        if(this.state.engineNo==''){
            alert('发动机号 不能为空');
            return;
        }
        if(this.state.buyDate==''){
            alert('购置日期 不能为空');
            return;
        }
        if(this.state.mileage==''){
            alert('行驶里程 不能为空');
            return;
        }
        if(this.state.maintainMileage==''){
            alert('下次保养里程 不能为空');
            return;
        }
        if(this.state.insuranceExpireIn==''){
            alert('保险到期日 不能为空');
            return;
        }
        if(this.state.inspectExpireIn==''){
            alert('年检到期日 不能为空');
            return;
        }
        this.props.submit(this.state);
    }
    render(){
        return(
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>车牌号码</td>
                            <td><TextField id='name' onChange={this.changeNum}/></td>
                        </tr>
                        <tr>
                            <td>车型</td>
                            <td><CarBrand id='carBrand' onChange={res=>this.changeBrand(res)}/></td>
                        </tr>
                        <tr>
                            <td>车架号</td>
                            <td><TextField id='frameNo' onChange={this.changeFrame}/></td>
                        </tr>
                        <tr>
                            <td>发动机号</td>
                            <td><TextField id='engineNo' onChange={this.changeEngine}/></td>
                        </tr>
                        <tr>
                            <td>购置日期</td>
                            <td>
                                <DatePicker 
                                    id='buyDate' 
                                    hintText="请选择日期" 
                                    onChange={this.changeBuyDate}
                                    
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>行驶里程(km)</td>
                            <td><TextField id='mileage' onChange={this.changeMileage}/></td>
                        </tr>
                        <tr>
                            <td>下次保养里程(km)</td>
                            <td><TextField id='maintainMileage' onChange={this.changeMaintainMileage}/></td>
                        </tr>
                        <tr>
                            <td>保险到期日</td>
                            <td>
                                <DatePicker 
                                    id='insuranceExpireIn' 
                                    hintText="请选择日期"  
                                    onChange={this.changeInsuranceExpiry}
                                    
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>年检到期日</td>
                            <td>
                                <DatePicker 
                                    id='inspectExpireIn' 
                                    hintText="请选择日期"  
                                    onChange={this.changeCheckExpiry}
                                    
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>使用部门</td>
                            <td>
                                <SelectField id='departId' value={this.state.departId} onChange={this.changeDepartment}>
                                    <MenuItem value={0} primaryText="department0" />
                                    <MenuItem value={1} primaryText="department1" />
                                    <MenuItem value={2} primaryText="department2" />
                                    <MenuItem value={3} primaryText="department3" />
                                    <MenuItem value={4} primaryText="department4" />
                                </SelectField>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div style={styles.bottomBtn}>
                    <FlatButton
                        label={___.cancel}
                        primary={true}
                        onTouchTap={this.props.cancel}
                    />
                    <FlatButton
                        label={___.ok}
                        primary={true}
                        onTouchTap={this.submit}
                    />
                </div>
            </div>
        )
    }
}
