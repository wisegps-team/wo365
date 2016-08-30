import React from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';

import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import {ThemeProvider} from '../_theme/default';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ActionAssignmentInd from 'material-ui/svg-icons/action/assignment-ind';
import MapsDirectionsCar from 'material-ui/svg-icons/maps/directions-car';
import ActionInfo from 'material-ui/svg-icons/action/info';

import Fab from '../_component/base/fab';
import APP from '../_component/pc/app';
import Input from '../_component/base/input';

window.addEventListener('load',function(){
    ReactDOM.render(
            <App/>
        ,W('#APP'));
});
const styles={
    main:{width:'100%',paddingLeft:'25px',paddingRight:'25px'},
    tableHeight:window.innerHeight-120,
    bottomBtn:{width:'100%',display:'block',textAlign:'right',paddingTop:'5px'},
    iconStyle:{marginRight: '12px'},
}
const _employee={
    name:'小明',
    departId:'1',
    sex:1,
    type:1,
    tel:'12345678909',
}
const _employees=[];
for(let i=0;i<=4;i++){
    _employees.push(_employee);
}
const _sex=[___.woman,___.man];
const _type=[___.manage,___.driver,___.account_manager];
const _depar=['部门A','部门B','部门C'];

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            employees:[],
            isAddingEmployee:false,
            isShowingLicense:false,
            isShowingCar:false,
            isShowingInfo:false,
        }
        this.addEmployee=this.addEmployee.bind(this);
        this.addEmployeeCancel=this.addEmployeeCancel.bind(this);
        this.addEmployeeSubmit=this.addEmployeeSubmit.bind(this);
        this.showInfo=this.showInfo.bind(this);
        this.showInfoCancel=this.showInfoCancel.bind(this);
        this.showInfoSubmit=this.showInfoSubmit.bind(this);
        this.showCar=this.showCar.bind(this);
        this.showCarCancel=this.showCarCancel.bind(this);
        this.showCarSubmit=this.showCarSubmit.bind(this);
        this.showLicense=this.showLicense.bind(this);
        this.showLicenseCancel=this.showLicenseCancel.bind(this);
        this.showLicenseSubmit=this.showLicenseSubmit.bind(this);
    }
    componentDidMount(){
        this.setState({employees:_employees});
    }

    addEmployee(){
        this.setState({isAddingEmployee:true});
    }
    addEmployeeCancel(){
        this.setState({isAddingEmployee:false});
    }
    addEmployeeSubmit(){
        this.setState({isAddingEmployee:false});
    }

    showLicense(){
        this.setState({isShowingLicense:true});
    }
    showLicenseCancel(){
        this.setState({isShowingLicense:false});
    }
    showLicenseSubmit(){
        this.setState({isShowingLicense:false});
    }

    showCar(){
        this.setState({isShowingCar:true});
    }
    showCarCancel(){
        this.setState({isShowingCar:false});
    }
    showCarSubmit(){
        this.setState({isShowingCar:false});
    }

    showInfo(employee){
        this.setState({
            isShowingInfo:true,
            curEmployee:employee
        });
    }
    showInfoCancel(){
        this.setState({isShowingInfo:false});
    }
    showInfoSubmit(){
        this.setState({isShowingInfo:false});
    }

    render() {
        return (
            <APP leftBar={false}>
                <div style={styles.main} >
                    <Employees data={this.state.employees} showLicense={this.showLicense} showCar={this.showCar} showInfo={this.showInfo}/>
                </div>
                <Fab onClick={this.addEmployee}/>
                <Dialog
                    title={___.add_employee}
                    modal={false}
                    open={this.state.isAddingEmployee}
                    autoScrollBodyContent={true}
                    onRequestClose={this.addEmployeeCancel}
                    >
                    <AddEmployee cancel={this.addEmployeeCancel} submit={this.addEmployeeSubmit}/>
                </Dialog>
                <Dialog
                    title={___.driving_license}
                    modal={false}
                    open={this.state.isShowingLicense}
                    autoScrollBodyContent={true}
                    onRequestClose={this.showLicenseCancel}
                    >
                    <DrivingLicenseDiv employee={this.state.curEmployee} cancel={this.showLicenseCancel} submit={this.showLicenseSubmit}/>
                </Dialog>
                <Dialog
                    title={___.car}
                    modal={false}
                    open={this.state.isShowingCar}
                    autoScrollBodyContent={true}
                    onRequestClose={this.showCarCancel}
                    >
                    <CarDiv employee={this.state.curEmployee} cancel={this.showCarCancel} submit={this.showCarSubmit}/>
                </Dialog>
                <Dialog
                    title={___.more_info}
                    modal={false}
                    open={this.state.isShowingInfo}
                    autoScrollBodyContent={true}
                    onRequestClose={this.showInfoCancel}
                    >
                    <InfoDiv employee={this.state.curEmployee} cancel={this.showInfoCancel} submit={this.showInfoSubmit}/>
                </Dialog>
            </APP>
        );
    }
}
class Employees extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            curEmployee:{},
        }
    }
    render(){
        let employeeItems = this.props.data.map((ele,index)=>
            <TableRow key={index} >
                <TableRowColumn>{ele.name}</TableRowColumn>
                <TableRowColumn>{_depar[ele.departId]}</TableRowColumn>
                <TableRowColumn>{_sex[ele.sex]}</TableRowColumn>
                <TableRowColumn>{_type[ele.type]}</TableRowColumn>
                <TableRowColumn>{ele.tel}</TableRowColumn>
                <TableRowColumn>
                    <OptionBtn data={ele} onClick={this.props.showLicense}>
                        <ActionAssignmentInd/>
                    </OptionBtn>
                    <OptionBtn data={ele} onClick={this.props.showCar}>
                        <MapsDirectionsCar/>
                    </OptionBtn>
                    <OptionBtn data={ele} onClick={this.props.showInfo}>
                        <ActionInfo/>
                    </OptionBtn>
                </TableRowColumn>
            </TableRow>);
        employeeItems.push(<TableRow key={-1}/>);//最后加上一条空的信息，防止最下面一个车辆元素右侧图标被“添加”按钮挡住
        return(
            <Table height={styles.tableHeight+'px'} fixedHeader={true}>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow key={0}>
                        <TableHeaderColumn>{___.name}</TableHeaderColumn>
                        <TableHeaderColumn>{___.department}</TableHeaderColumn>
                        <TableHeaderColumn>{___.sex}</TableHeaderColumn>
                        <TableHeaderColumn>{___.role}</TableHeaderColumn>
                        <TableHeaderColumn>{___.cellphone}</TableHeaderColumn>
                        <TableHeaderColumn>{___.operation}</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false} stripedRows={true} >
                    {employeeItems}
                </TableBody>
            </Table>
        );
    }
}
class OptionBtn extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    handleClick(){
        this.props.onClick(this.props.data||'');
    }
    render(){
        return(
            <span onClick={this.handleClick.bind(this)}  style={styles.iconStyle}>
                {this.props.children}
            </span>
        )
    }
}

class DrivingLicenseDiv extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    handleClick(){
        this.props.onClick(this.props.data);
    }
    render(){
        return(
            <div>
                inifo div
            </div>
        )
    }
}

class CarDiv extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    handleClick(){
        this.props.onClick(this.props.data);
    }
    render(){
        return(
            <div>
                inifo div
            </div>
        )
    }
}
class InfoDiv extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    handleClick(){
        this.props.onClick(this.props.data);
    }
    render(){
        return(
            <div>
                inifo div
            </div>
        )
    }
}


class AddEmployee extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            name:'',
            departId:'',
            sex:1,
            type:'',
            tel:'',
            if_allow_login:false,
            if_driver:false,
            licenseType:'',
            firstGetLicense:'2016-01-01',
            licenseExpireIn:'2026-01-01',
        }
    }
    nameChange(e,value){
        console.log(e.target.name);
        this.setState({name:value});
    }
    departIdChange(e,value){
        console.log(e);
        this.setState({departId});
    }
    telChange(e,value){
        this.setState({tel:value});
    }
    render(){
        return(
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>{___.name}</td>
                            <td><TextField name='name' onChange={this.nameChange.bind(this)} /></td>
                        </tr>
                        <tr>
                            <td>{___.department}</td>
                            <td><TextField name='departId' onChange={this.nameChange.bind(this)}/></td>
                        </tr>
                        <tr>
                            <td>{___.sex}</td>
                            <td><TextField name='sex'/></td>
                        </tr>
                        <tr>
                            <td>{___.role}</td>
                            <td><TextField name='type'/></td>
                        </tr>
                        <tr>
                            <td>{___.cellphone}</td>
                            <td><TextField name='tel' onChange={this.telChange.bind(this)}/></td>
                        </tr>
                        <tr>
                            <td>{___.if_allow_login}</td>
                            <td><TextField name='if_allow_login'/></td>
                        </tr>
                        <tr>
                            <td>{___.if_driver}</td>
                            <td><TextField name='if_driver'/></td>
                        </tr>
                        <tr>
                            <td>{___.licenseType}</td>
                            <td><TextField name='licenseType'/></td>
                        </tr>
                        <tr>
                            <td>{___.firstGetLicense}</td>
                            <td><TextField name='firstGetLicense'/></td>
                        </tr>
                        <tr>
                            <td>{___.licenseExpireIn}</td>
                            <td><TextField name='licenseExpireIn'/></td>
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
                        onClick={this.props.submit}
                    />
                </div>
            </div>
        )
    }
}