import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';

import Input from './base/input';
import PhoneInput from './base/PhoneInput';
import SexRadio from './base/sexRadio';
import {DepartmentTree,DepartmentSelcet} from'./department_tree';

const _type=['角色A','角色B','角色C'];
const styles={
    sonpage_main:WiStorm.agent.mobile?
        {paddingBottom:'20px',marginLeft:(window.innerWidth-256)/2+'px',marginRight:(window.innerWidth-256)/2+'px'}
        :{marginLeft:'1em'},
    bottom_btn_center:{width:'100%',display:'block',textAlign:'center',paddingTop:'2em'},
};

//使用时需要传入数据data和点击提交方法submit，submit会返回编辑后的data
class EditEmployee extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            allowLogin:false,
            show_quit:false,
            quit:false,
            quit_time:'',
        }
        this.data={
            uid:'',
            name:'',
            tel:'',
            sex:1,
            departId:0,
            type:0,
        }
        this.nameChange=this.nameChange.bind(this);
        this.sexChange=this.sexChange.bind(this);
        this.telChange=this.telChange.bind(this);
        this.deparChange=this.deparChange.bind(this);
        this.typeChange=this.typeChange.bind(this);
        this.allowLogin=this.allowLogin.bind(this);
        this.quit=this.quit.bind(this);
        this.submit=this.submit.bind(this);
    }
    componentWillReceiveProps(nextProps){
        let data=nextProps.data;
        if(data.uid){
            this.data.uid=data.uid;
            this.data.name=data.name;
            this.data.tel=data.tel;
            this.data.departId=data.departId;
            this.data.sex=data.sex;
            this.data.type=data.type;
            this.setState({
                show_quit:true,
                quit:false,
            });
        }else{
            this.data.name='';
            this.data.tel='';
            this.data.departId=0;
            this.data.sex=1;
            this.data.type=0;
            this.setState({
                show_quit:false,
                allowLogin:false,
            });
        }
    }
    setParams(data){
        console.log('setParams');
    }
    nameChange(e,value){
        this.data.name=value;
    }
    telChange(value,str){
        this.data.tel=value;
    }
    sexChange(value){
        this.data.sex=value;
    }
    deparChange(value){
        console.log(value);

        this.data.departId=value.id;
        this.forceUpdate();
    }
    typeChange(e,k,value){
        this.data.type=value;
        this.forceUpdate();
    }
    allowLogin(e,value){
        this.setState({allowLogin:value});
    }
    quit(e,value){
        this.setState({quit:value});
    }
    submit(){
        let data=this.data;
        this.props.submit(data);
        this.data={
            uid:'',
            name:'',
            tel:'',
            sex:1,
            departId:0,
            type:0,
        }
    }
    render(){
        return(
            <div style={styles.sonpage_main}>
                <Input floatingLabelText={___.person_name} value={this.data.name} onChange={this.nameChange} />
                
                <p style={{fontSize:'0.75em', color:'rgba(0, 0, 0, 0.498039)',marginBottom:'0px'}}>{___.sex}</p>
                <SexRadio style={{paddingTop:'10px'}} value={this.data.sex} onChange={this.sexChange}/>
                
                <PhoneInput floatingLabelText={___.phone} value={this.data.tel} onChange={this.telChange} />
                
                <p style={{fontSize:'0.75em', color:'rgba(0, 0, 0, 0.498039)'}}>{___.department}</p>
                <DepartmentSelcet value={this.data.departId} onChange={this.deparChange}/>
              
                <SelectField floatingLabelText={___.role} value={this.data.type} onChange={this.typeChange} >
                    <MenuItem key={0} value={0} primaryText={_type[0]} />
                    <MenuItem key={1} value={1} primaryText={_type[1]} />
                    <MenuItem key={2} value={2} primaryText={_type[2]} />
                </SelectField>

                <Checkbox 
                    style={{paddingTop:'10px',display:this.state.show_quit?'none':'block'}} 
                    label={___.allow_login} 
                    onCheck={this.allowLogin } 
                />

                <Checkbox 
                    style={{paddingTop:'10px',display:this.state.show_quit?'block':'none'}} 
                    label={___.quit} 
                    onCheck={this.quit } 
                />

                <DatePicker
                    style={{display:this.state.quit?'block':'none'}}
                    floatingLabelText="离职日期"
                    defaultDate={new Date()}
                    okLabel={___.ok}
                    cancelLabel={___.cancel}
                />

                <div style={styles.bottom_btn_center}>
                    <RaisedButton label={___.ok} primary={true} onClick={this.submit }/>
                </div>
            </div>
        )
    }
}

export default EditEmployee;