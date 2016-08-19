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
import areIntlLocalesSupported from 'intl-locales-supported';


/**
 * Use the native Intl.DateTimeFormat if available, or a polyfill if not.
 */
// if (areIntlLocalesSupported(['zh-CN'])) {
//   DateTimeFormat = global.Intl.DateTimeFormat;
// } else {
//   const IntlPolyfill = require('intl');
//   DateTimeFormat = IntlPolyfill.DateTimeFormat;
//   require('intl/locale-data/jsonp/zh-CN');
// }

// injectTapEventPlugin();//启用react触摸屏

// 打印初始状态
console.log(STORE.getState());

// 每次 state 更新时，打印日志
// 注意 subscribe() 返回一个函数用来注销监听器
let unsubscribe = STORE.subscribe(() =>
    console.log(STORE.getState())
)


window.addEventListener('load',function(){
    ReactDOM.render(
        <Provider store={STORE}>
            <APP/>
        </Provider>
        ,W('#APP'));
});

let _vehicle={
    name:'一个车牌',
    model:'一个车系',
    departId:'一个部门id',
    deviceType:'一个终端型号',//车辆表里面只有did，型号需要通过did另取
    serviceType:2,//服务类型
    serviceExpireIn:'2016-12-22',//服务到期日
}
let _vehicles=[];
for(let i=0;i<20;i++){
    let vehicle=Object.assign({},_vehicle);
    vehicle.name+=i;
    _vehicles[i]=vehicle;
}

let _driver={
    name:'明明',

}

const styles={
    main:{paddingTop:'50px',marginLeft:'25px',marginRight:'25px'},
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
        this.setState({addingCar:false});
        // let _this=this;
        // wapi.vehicle.add(function(){
        //     _this.setState({addingCar:false});
        // },data);
    }

    render() {
        let vehicleItems = this.state.vehicles.map(ele=>
            <TableRow key={ele.name}>
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
            <ThemeProvider>
            <div>
                <AppBar title={___.car_manage} style={{position:'fixed'}}/>
                <div style={styles.main} >
                    <Table height={this.state.height+'px'} fixedHeader={true}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
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
            </div>
            </ThemeProvider>
        );
    }
}

class AddCar extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={}
        this.data={
            carNum:'',
            brand:'',
            type:'',
            typeYear:'',
            frame:'',
            engine:'',
            buy_date:'',
            mileage:'',
            maintain:'',
            insurance_expiry:'',
            check_expiry:'',
            department:'',
        }
        this.submit=this.submit.bind(this);
    }
    submit(){
        this.props.submit(this.data);
    }
    render(){
        return(
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>车牌号码</td>
                            <td><TextField id='carNum'/></td>
                        </tr>
                        <tr>
                            <td>品牌</td>
                            <td><TextField id='brand'/></td>
                        </tr>
                        <tr>
                            <td>车系</td>
                            <td><TextField id='type'/></td>
                        </tr>
                        <tr>
                            <td>年款</td>
                            <td><TextField id='typeYear'/></td>
                        </tr>
                        <tr>
                            <td>车架号</td>
                            <td><TextField id='frame'/></td>
                        </tr>
                        <tr>
                            <td>发动机号</td>
                            <td><TextField id='engine'/></td>
                        </tr>
                        <tr>
                            <td>购置日期</td>
                            <td><DatePicker hintText="select date"/></td>
                        </tr>
                        <tr>
                            <td>行驶里程</td>
                            <td><TextField id='drive'/></td>
                        </tr>
                        <tr>
                            <td>下次保养里程</td>
                            <td><TextField id='maintain'/></td>
                        </tr>
                        <tr>
                            <td>保险到期日</td>
                            <td><DatePicker hintText="select date" /></td>
                        </tr>
                        <tr>
                            <td>年检到期日</td>
                            <td><DatePicker hintText="select date" /></td>
                        </tr>
                        <tr>
                            <td>使用部门</td>
                            <td><TextField id='department'/></td>
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


const APP=connect(function select(state) {
    let sta={};
    Object.assign(sta,state);
    return sta;
})(App);