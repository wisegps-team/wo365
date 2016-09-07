"use strict";
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

import AppBar from 'material-ui/AppBar';

import {ThemeProvider} from './_theme/default';
import FlatButton from 'material-ui/FlatButton';

import Register from './_component/login/register';
import AreaSelect from './_component/base/areaSelect';
import Input from './_component/base/input';
import SexRadio from './_component/base/sexRadio';

require('./_sass/index.scss');//包含css

window.addEventListener('load',function(){
    ReactDOM.render(<App/>,W('#main'));
});


class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.registerSuccess = this.registerSuccess.bind(this);
        this.data={
            sex:1
        };
        this.change = this.change.bind(this);
        this.nameChange = this.nameChange.bind(this);
    }
    registerSuccess(res){
        if(!this.data.name){
            W.alert(___.user_name_empty);
            return;
        }
        if(!this.data.cityId){
            W.alert(___.area_empty);
            return;
        }
        if(!this.data.contact){
            W.alert(___.contact_empty);
            return;
        }
        let cust=Object.assign({},this.data,{uid:res.uid,tel:res.mobile,custTypeId:4});
        cust.parentId=['771277603326791700'];
        Wapi.user.login(function(data){//先登录获取token
            if(data.status_code){
                if(data.status_code==2&&res.status_code==8){//密码错误且之前已经注册过用户
                    W.confirm(___.account_error,b=>b?location='index.html?intent=forget':null);
                    return;
                }
                W.errorCode(data);
                return;
            }
            let token=data.access_token;
            cust.access_token=token;

            function addCust(){//添加客户表资料
                Wapi.custType.get(type=>{
                    cust.custType=type.data.name;
                    Wapi.customer.add(function(res){
                        W.alert(___.register_success,()=>location='index.html');
                    },cust);
                },{
                    id:4,
                    access_token:token
                });
            }
            if(res.status_code==8)//如果是之前就已经注册过用户则先校验一下有没有添加过客户表
                Wapi.customer.get(function(cust){//如果有，则不能注册，提示去重置密码
                    return cust.data?W.confirm(___.account_error,b=>b?location='index.html?intent=forget':0):addCust();
                },{uid:cust.uid,access_token:token});
            else
                addCust();
        },{
            account:res.account,
            password:res.password
        });
    }

    nameChange(e,val){
        this.data[e.target.name]=val;
    }
    change(val,name){
        if(name){
            Object.assign(this.data,val);
        }else{
            this.data.sex=val;
        }
    }

    render() {
        return (
            <ThemeProvider>
                <div className='login'>
                    <form>
                        <Input name='name' floatingLabelText={___.company_name} onChange={this.nameChange}/>
                        <AreaSelect name='area' onChange={this.change}/>
                        <Input name='contact' floatingLabelText={___.person} onChange={this.nameChange}/>
                        <SexRadio onChange={this.change}/>
                    </form>
                    <Register onSuccess={this.registerSuccess}/>
                    <div style={{
                        textAlign: 'right',
                        marginTop: '10px'
                        }}
                    >
                        <FlatButton label={___.login} primary={true} onClick={()=>location.href='index.html'}/>
                    </div>
                </div>
            </ThemeProvider>
        );
    }
}