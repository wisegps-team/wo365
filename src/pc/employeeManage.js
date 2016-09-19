import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {Provider,connect} from 'react-redux';

import md5 from 'md5';
import STORE from '../_reducers/main';

import {ThemeProvider} from '../_theme/default';
import Card from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import ActionInfo from 'material-ui/svg-icons/action/info';
import ActionAccountBox from 'material-ui/svg-icons/action/account-box';
import MapsDirectionsCar from 'material-ui/svg-icons/maps/directions-car';

import AppBar from '../_component/base/appBar';
import Fab from '../_component/base/fab';
import SonPage from '../_component/base/sonPage';
import TypeSelect from '../_component/base/TypeSelect';
import DepartmentTree,{DepartmentSelcet} from'../_component/department_tree';
import APP from '../_component/pc/app';
import EditEmployee from'../_component/EditEmployee';
import Page from '../_component/base/page';


import {getDepart} from '../_modules/tool';
import {department_act} from '../_reducers/dictionary';

STORE.dispatch(department_act.get({uid:_user.customer.objectId}));//部门
let unsubscribe = STORE.subscribe(() =>{
    if(STORE.getState().department){
        ReactDOM.render(
            <App/>
        ,W('#APP'));
        unsubscribe();
    }}
);


const styles={
    table_main:{marginLeft:'25px',marginRight:'25px'},
    table_height:window.innerHeight-280,//应当对数据进行分页处理，所以表格高度需要限制，下方留出空位放页码，放上下页按钮
    Table_cells:{paddingLeft:'36px'},
    appbar:{position:'fixed',top:'0px'},
    main:{width:'90%',paddingTop:'50px',paddingBottom:'20px',marginLeft:'5%',marginRight:'5%'},
    // sonpage_main:{width:'90%',paddingBottom:'20px',marginLeft:'5%',marginRight:'5%'},
    // sonpage_main:{paddingBottom:'20px',marginLeft:(window.innerWidth-256)/2+'px',marginRight:(window.innerWidth-256)/2+'px'},
    sonpage_main:{marginLeft:'1em'},
    card:{marginTop:'1em',padding:'0.5em 1em'},
    table_tr:{height:'30px'},
    table_td_right:{paddingLeft:'1em'},
    bottom_btn_right:{width:'100%',display:'block',textAlign:'right',paddingTop:'5px'},
    bottom_btn_center:{width:'100%',display:'block',textAlign:'center',paddingTop:'2em'},
};

const _employee={
    uid:1,
    departId:1,
    type:1,
    name:'小明',
    sex:1,
    tel:'1234567890',
}
const _employees=[];
for(let i=0;i<=4;i++){
    let e=Object.assign({},_employee);
    e.uid=i;
    e.tel+=i;
    _employees.push(e);
}
const _sex=[___.woman,___.man];
const _type=['角色A','角色B','角色C'];
// const _depar=[{name:'部门A',id:1234},'部门B','部门C'];

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            employees:[],
            edit_employee:{},
            show_driver:false,
            show_car:false,
            show_details:false,
            intent:'add',
            departIds:[],

            limit:8,
        }

        this.departChange=this.departChange.bind(this);
        this.getEmployees=this.getEmployees.bind(this);
        this.showDriver=this.showDriver.bind(this);
        this.showDriverCancel=this.showDriverCancel.bind(this);
        this.showCar=this.showCar.bind(this);
        this.showCarCancel=this.showCarCancel.bind(this);
        this.addEmployee=this.addEmployee.bind(this);
        this.showDetails=this.showDetails.bind(this);
        this.editEmployeeCancel=this.editEmployeeCancel.bind(this);
        this.editEmployeeSubmit=this.editEmployeeSubmit.bind(this);
    }
    getChildContext(){
        return {
            ACT:this.act,
            custType:this.props.custType
        };
    }
    componentDidMount(){
        let departs=STORE.getState().department;
        let departIds=departs.map(ele=>ele.objectId);
        this.setState({departIds:departIds});

        this.getEmployees();
    }
    departChange(value){
        let departIds=this.state.departIds;

        if(value.checked){
            if(value.objectId)departIds.push(value.objectId);

            let childrenId=getChildrenId(value);
            departIds=departIds.concat(childrenId);
        }else{
            if(value.open){
                departIds=[0];
            }else{
                departIds=departIds.filter(ele=>ele!=value.objectId);
                let childrenId=getChildrenId(value);
                for(let i=childrenId.length;i>=0;i--){
                    departIds=departIds.filter(item=>item!=childrenId[i]);
                }
            }
        }

        let strDepartIds=departIds.join('|');
        let data={departId:strDepartIds};
        this.getEmployees(data);
    }
    getEmployees(data){//获取当前人员表数据
        let op={
            fields:'objectId,uid,companyId,name,tel,sex,departId,type',
            limit:this.state.limit
        }
        if(data){
            op=Object.assign(op,data);
        }
        
        Wapi.employee.list(res=>{
            this.setState({employees:res.data});
        },{
            companyId:_user.customer.objectId
        },op);

        //测试用数据
        // this.setState({employees:_employees});
    }

    showDriver(data){
        this.setState({
            edit_employee:data,
            show_driver:true,
        });
    }
    showDriverCancel(){
        this.setState({
            edit_employee:{},
            show_driver:false,
        });
    }
    showCar(data){
        this.setState({
            edit_employee:data,
            show_car:true,
        });
    }
    showCarCancel(){
        this.setState({
            edit_employee:{},
            show_car:false,
        });
    }
    showDetails(data){
        this.setState({
            edit_employee:data,
            show_details:true,
            intent:'edit',
        });
    }
    addEmployee(){
        this.setState({
            edit_employee:{},
            show_details:true,
            intent:'add',
        });
    }
    editEmployeeCancel(){
        this.setState({show_details:false});
    }
    editEmployeeSubmit(data){
        this.setState({show_details:false});
        if(this.state.intent=='edit'){//修改人员
            Wapi.employee.update(res=>{
                this.getEmployees();//添加、修改完成后重新获取人员表数据
            },{
                _uid:data.uid,
                name:data.name,
                tel:data.tel,
                sex:data.sex,
                departId:data.departId,
                type:data.type,
            });
        }else if(this.state.intent=='add'){//添加人员
            let that=this;

            let par={                
                userType:9,
                mobile:data.tel,
                password:md5(data.tel.slice(-6))
            };
            Wapi.user.add(function (res) {
                let params={
                    companyId:_user.customer.objectId,
                    name:data.name,
                    tel:data.tel,
                    sex:data.sex,
                    departId:data.departId,
                    type:data.type,
                };
                params.uid=res.uid;
                Wapi.employee.add(function(res){
                    that.getEmployees();//添加、修改完成后重新获取人员表数据
                    Wapi.role.update(function(role){
                        W.confirm(___.create_user_su,function(b){if(b)history.back()});
                        data.objectId=res.objectId;
                        STORE.dispatch(action.fun.add(data));
                        let sms=___.cust_sms_content;
                        let tem={
                            name:data.name,
                            sex:data.sex?___.sir:___.lady,
                            account:data.tel,
                            pwd:data.tel.slice(-6)
                        }
                        Wapi.comm.sendSMS(function(res){
                            W.errorCode(res);
                        },data.tel,0,W.replace(sms,tem));
                    },{
                        _objectId:'773344067361837000',
                        users:'+"'+res.objectId+'"'
                    })
                },params);

            },par);
        }
    }

    render() {
        // let left=<div><DepartmentTree mode={'select'} onChange={this.departChange}/></div>;
        let left=<DepartmentTree check={true} onSelect={this.departChange} checked={true} open={true}/>;
        return (
            <APP leftContent={left}>
                <EmployeeTable 
                    employees={this.state.employees} 
                    showDriver={this.showDriver} 
                    showCar={this.showCar} 
                    showDetails={this.showDetails}
                />
                <Fab onClick={this.addEmployee}/>
                <SonPage open={this.state.show_details} back={this.editEmployeeCancel}>
                    <EditEmployee data={this.state.edit_employee} submit={this.editEmployeeSubmit}/>
                </SonPage>
                <SonPage open={this.state.show_driver} back={this.showDriverCancel}>
                    <DriverInfo data={this.state.edit_employee} submit={this.showDriverCancel}/>
                </SonPage>
                <SonPage open={this.state.show_car} back={this.showCarCancel}>
                    <CarInfo data={this.state.edit_employee} submit={this.showCarCancel}/>
                </SonPage>
            </APP>
        );
    }
}
App.childContextTypes={
    custType: React.PropTypes.array,
    ACT: React.PropTypes.object
}

class EmployeeTable extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            page_no:1,
            total_page:0,
        }
    }
    changePage(){}
    render(){
        let tableItems = this.props.employees.map((ele,index)=>{
            let departs=STORE.getState().department;
            let _depart=departs.find(item=>item.objectId.toString()==ele.departId);
            let _departName='';
            if(_depart)_departName=_depart.name;
            
            return(
                <TableRow key={index} >
                    <TableRowColumn >{ele.name}</TableRowColumn>
                    <TableRowColumn >{_sex[ele.sex]}</TableRowColumn>
                    <TableRowColumn >{_departName}</TableRowColumn>
                    {/*<TableRowColumn >{_type[ele.type]}</TableRowColumn>*/}
                    <TableRowColumn >{ele.tel}</TableRowColumn>
                    <TableRowColumn >
                        <ActionInfo onClick={()=>this.props.showDetails(ele)} />
                        {/*<ActionAccountBox onClick={()=>this.props.showDriver(ele)} />
                        <MapsDirectionsCar onClick={()=>this.props.showCar(ele)} />*/}
                    </TableRowColumn>
                </TableRow>
            )
        });
        return(
            <div style={styles.table_main}>
                <Table fixedHeader={true} height={this.state.total_page>1?styles.table_height+'px':'auto'}>
                    <TableHeader style={{borderTop:'solid 1px #cccccc'}} displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn >{___.person_name}</TableHeaderColumn>
                            <TableHeaderColumn >{___.sex}</TableHeaderColumn>
                            <TableHeaderColumn >{___.department}</TableHeaderColumn>
                            {/*<TableHeaderColumn >{___.role}</TableHeaderColumn>*/}
                            <TableHeaderColumn >{___.phone}</TableHeaderColumn>
                            <TableHeaderColumn >{___.edit}</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody style={{borderBottom:'solid 1px #cccccc'}} displayRowCheckbox={false} stripedRows={true}>
                        {tableItems}
                    </TableBody>
                </Table>
                <Page curPage={this.state.page_no} totalPage={this.state.total_page} changePage={this.changePage} />
            </div>
        )
    }
}

class DriverInfo extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    render(){
        return(
            <div style={{paddingLeft:'1em',width:'280px',wordWrap:'break-word'}}>
                {JSON.stringify(this.props.data)}
                准驾车型
                领证日期
                有效期限
            </div>
        )
    }
}

class CarInfo extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    render(){
        return(
            <div style={{paddingLeft:'1em',width:'280px',wordWrap:'break-word'}}>
                {JSON.stringify(this.props.data)}
                车牌号码
                当前状态
                分配时间
                同步时间
                绑定时间
                停用时间
            </div>
        )
    }
}

function getChildrenId(obj){//传入一个obj，返回这个obj的所有children的objectId(不包含这个obj自己的objectId)
    let ids=[];
    if(obj.children.length>0){
        obj.children.map(ele=>{
            ids.push(ele.objectId);
            ids=ids.concat(getChildrenId(ele));
        })
    }
    return ids;
}