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
            show_sonpage:false,
            intent:'add',
        }
        this.getEmployees=this.getEmployees.bind(this);
        this.addEmployee=this.addEmployee.bind(this);
        this.showDetails=this.showDetails.bind(this);
        this.editEmployeeCancel=this.editEmployeeCancel.bind(this);
        this.editEmployeeSubmit=this.editEmployeeSubmit.bind(this);
        this.departChange=this.departChange.bind(this);
    }
    getChildContext(){
        return {
            ACT:this.act,
            custType:this.props.custType
        };
    }
    componentDidMount(){
        this.getEmployees();
    }
    getEmployees(data){//获取当前人员表数据
        let op={
            fields:'objectId,uid,companyId,name,tel,sex,departId,type'
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

    addEmployee(){
        this.setState({
            edit_employee:{},
            show_sonpage:true,
            intent:'add',
        });
    }
    showDetails(data){
        this.setState({
            edit_employee:data,
            show_sonpage:true,
            intent:'edit',
        });
    }
    editEmployeeCancel(){
        this.setState({show_sonpage:false});
    }
    editEmployeeSubmit(data){
        this.setState({show_sonpage:false});
        if(this.state.intent=='edit'){
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
        }else if(this.state.intent=='add'){
            let par={                
                userType:9,
                mobile:data.tel,
                password:md5(data.tel.slice(-6))
            };
            let params={
                companyId:_user.customer.objectId,
                name:data.name,
                tel:data.tel,
                sex:data.sex,
                departId:data.departId,
                type:data.type,
            };
            Wapi.user.add(res_u=>{
                params.uid=res_u.uid;
                Wapi.employee.add(res_e=>{
                    this.getEmployees();//添加、修改完成后重新获取人员表数据
                },params);
            },par);
        }
    }
    departChange(value){
        console.log(value);
        let data={departId:value.id.toString()};
        this.getEmployees(data);
    }

    render() {
        let left=<div><DepartmentTree onChange={this.departChange}/></div>;
        return (
            <APP leftContent={left}>
                <EmployeeTable employees={this.state.employees} showDetails={this.showDetails}/>
                <Fab onClick={this.addEmployee}/>
                <SonPage open={this.state.show_sonpage} back={this.editEmployeeCancel}>
                    <EditEmployee data={this.state.edit_employee} submit={this.editEmployeeSubmit}/>
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
                    <TableRowColumn >{_type[ele.type]}</TableRowColumn>
                    <TableRowColumn >{ele.tel}</TableRowColumn>
                    <TableRowColumn >
                        <ActionInfo onClick={()=>this.props.showDetails(ele)} />
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
                            <TableHeaderColumn >{___.role}</TableHeaderColumn>
                            <TableHeaderColumn >{___.phone}</TableHeaderColumn>
                            <TableHeaderColumn >{___.details}</TableHeaderColumn>
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