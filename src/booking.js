/**
 * 2016-09-26
 * 用户预定页,因为是活动页，所以需要优化加载速度，所以不能和common.js一起用了
 */
"use strict";
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

import Wapi from './_modules/Wapi';
import {ThemeProvider} from './_theme/default';

import Input from './_component/base/input';
import PhoneInput from './_component/base/PhoneInput';
import VerificationCode from './_component/base/verificationCode';

import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import ActionAccountBox from 'material-ui/svg-icons/action/account-box';
import ActionVerifiedUser from 'material-ui/svg-icons/action/verified-user';
import HardwareSmartphone from 'material-ui/svg-icons/hardware/smartphone';
import MapsDirectionsCar from 'material-ui/svg-icons/maps/directions-car';


const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

const sty={
    p:{
        padding:'10px'
    },
    f:{
        padding:'10px',
        boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
        borderRadius: '2px'
    },
    r:{
        display:'flex',
        alignItems:'flex-end'
    },
    i:{
        margin:'9px'
    },
    b:{
        width:'100%',
        textAlign:'center',
        padding:'16px 5px 5px 0'
    },
    w:{
        width:'100%'
    },
    ex:{
        color:'#999999',
        marginTop:'30px',
        marginLeft:'10px',
        fontSize:'0.6em',
    }
}


class App extends Component {
    getChildContext(){
        return{
            'view':thisView
        }
    }

    render() {
        return (
            <ThemeProvider>
                <div style={sty.p}>
                    <From/>
                </div>
            </ThemeProvider>
        );
    }
}
App.childContextTypes={
    view:React.PropTypes.object,
}

class From extends Component{
    constructor(props, context) {
        super(props, context);
        this.valid=false;
        this.data={
            sellerId:_g.sellerId,
            uid:_g.uid,
            status:0,
            status0:1,
            status1:0,
            status2:0,
            status3:0,
            name:null,
            mobile:null,
            carType:null,
            openId:_g.openid,
        }
        this.change = this.change.bind(this);
        this.changeVerifi=this.changeVerifi.bind(this);
        this.changeCarName = this.changeCarName.bind(this);
        this.submit = this.submit.bind(this);
        this.mobileChange = this.mobileChange.bind(this);
    }
    
    mobileChange(val){
        let that=this;
        Wapi.booking.get(function(res){
            if(res.data){
                W.alert(___.booked);
            }else{
                that.data.mobile=val;
                that.forceUpdate();
            }
        },{
            mobile:val
        })
    }
    change(e,val){
        this.data[e.target.name]=val;
    }
    changeVerifi(val){
        this.valid=true;
    }
    changeCarName(val){
        this.data.carType={car_num:val};
    }
    submit(){
        if(!this.valid){
            W.alert(___.code_err);
            return;
        }
        let submit_data=Object.assign({},this.data);
        for(let k in submit_data){
            if(submit_data[k]==null||typeof submit_data[k]=='undefined'){
                W.alert(___.data_miss);
                return;
            }
        }
        let _this=this;
        Wapi.booking.add(function(res){
            Wapi.comm.sendSMS(function(res){//发短信给客户
                if(res.status_code){
                    W.errorCode(res);
                    return;
                }
            },_this.data.mobile,0,"预约成功");
            
            Wapi.comm.sendSMS(function(res){//发短信给代理商
                if(res.status_code){
                    W.errorCode(res);
                    return;
                }
            },_g.agent_tel,0,"您有一个新的预定信息");
            
            Wapi.comm.sendSMS(function(res){//发送短信给客户经理
                if(res.status_code){
                    W.errorCode(res);
                    return;
                }
                W.alert(___.booking_success,()=>history.back());
            },_g.mobile,0,W.replace(___.booking_sms,submit_data));

        },submit_data);
    }
    render() {
        return (
            <div style={sty.f}>
                <div style={sty.r}>
                    <ActionAccountBox style={sty.i}/>
                    <Input name='name' floatingLabelText={___.person_name} onChange={this.change}/>
                </div>
                <div style={sty.r}>
                    <HardwareSmartphone style={sty.i}/>
                    <PhoneInput name='mobile' floatingLabelText={___.booking_phone} onChange={this.mobileChange} needExist={true}/>
                </div>
                <div style={sty.r}>
                    <ActionVerifiedUser style={sty.i}/>
                    <VerificationCode 
                        name='valid_code'
                        type={1}
                        account={this.data.mobile} 
                        onSuccess={this.changeVerifi}
                    />
                </div>
                <div style={sty.r}>
                    <MapsDirectionsCar style={sty.i}/>
                    <Input floatingLabelText={___.carNum} name='carNum' onChange={this.changeCarName}/>
                </div>
                <div style={sty.b}>
                    <RaisedButton label={___.submit_booking} primary={true} onClick={this.submit}/>
                </div>

                <div style={sty.ex}>
                    {___.please_consult+___.phone+": "+_g.mobile}
                </div>
            </div>
        );
    }
}