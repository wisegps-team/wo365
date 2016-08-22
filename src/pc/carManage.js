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
import ActionAccountCircle from 'material-ui/svg-icons/action/account-circle';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
// import areIntlLocalesSupported from 'intl-locales-supported';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

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
    iconStyle:{
        marginRight: 24,
    }
}


class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            vehicles:[],
            height:window.innerHeight-120,
            addingCar:false,
        }
        this.addCar=this.addCar.bind(this);
        this.addCarCancel=this.addCarCancel.bind(this);
        this.addCarSubmit=this.addCarSubmit.bind(this);
    }

    componentDidMount(){
        Wapi.vehicle.list(res=>{
            console.log(res);
            if(res.data.length>0){
                this.setState({
                    vehicles:res.data,
                });
            }
        },{uid:_user.uid});
        this.setState({
            vehicles:_vehicles,
        });
    }

    addCar(){
        this.setState({addingCar:true});
    }
    addCarCancel(){
        this.setState({addingCar:false});
    }
    addCarSubmit(data){
        console.log(data);
        let _this=this;
        Wapi.vehicle.add(res=>{
            console.log(res);
            this.setState({addingCar:false});
        },data);
    }

    render() {
        let vehicleItems = this.state.vehicles.map(ele=>
            <TableRow key={ele.objectId}>
                <TableRowColumn>{ele.name}</TableRowColumn>
                <TableRowColumn>{ele.model}</TableRowColumn>
                <TableRowColumn>{ele.departId}</TableRowColumn>
                <TableRowColumn>{ele.deviceType}</TableRowColumn>
                <TableRowColumn>{ele.serviceType}</TableRowColumn>
                <TableRowColumn>{ele.serviceExpireIn}</TableRowColumn>
                <TableRowColumn>
                    <ActionAccountCircle style={styles.iconStyle}/>
                    <ActionAccountCircle style={styles.iconStyle}/>
                    <ActionAccountCircle style={styles.iconStyle}/>
                </TableRowColumn>
            </TableRow>);
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
                        <TableBody displayRowCheckbox={false} stripedRows={true}>
                            {vehicleItems}
                        </TableBody>
                    </Table>
                </div>
                <Feb onClick={this.addCar}/>
                <Dialog
                    title="新增车辆"
                    modal={false}
                    open={this.state.addingCar}
                    autoScrollBodyContent={true}
                    onRequestClose={this.addCarCancel}
                    >
                    <AddCar cancel={this.addCarCancel} submit={this.addCarSubmit}/>
                </Dialog>
            </APP>
        );
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
                <div style={{width:'100%',display:'block',textAlign:'right'}}>
                    <FlatButton
                        label="Cancel"
                        primary={true}
                        onTouchTap={this.props.cancel}
                    />
                    <FlatButton
                        label="Submit"
                        primary={true}
                        onTouchTap={this.submit}
                    />
                </div>
            </div>
        )
    }
}
