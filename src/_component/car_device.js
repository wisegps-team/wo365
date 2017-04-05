import React, {Component} from 'react';

import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import Slider from 'material-ui/Slider';

import Input from '../_component/base/input';


const styles={
    bottomBtn:{width:'100%',display:'block',textAlign:'right',paddingTop:'5px'},
    sonpage:{paddingLeft:'1em',paddingRight:'1em'},
    td_left:{whiteSpace:'nowrap'},
    td_right:{paddingLeft:'1em'}
}

export default class CarDevice extends React.Component{
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
            speed:200,
            check:false,
            command:{},
            close:true
        }
        this.edit=this.edit.bind(this);
        this.didChange=this.didChange.bind(this);
        this.verifyChange=this.verifyChange.bind(this);
        this.warnSpeedChange=this.warnSpeedChange.bind(this);
        this.timeChange=this.timeChange.bind(this);
        this.cancel=this.cancel.bind(this);
        this.submit=this.submit.bind(this);
        this.Changevalue = this.Changevalue.bind(this);
        this.Check = this.Check.bind(this);
    }
    edit(){
        this.setState({noEdit:false});
        this.setState({deviceStatus:'ok'})
    }
    didChange(e,value){
        this.setState({did:value});
        Wapi.device.get(res=>{
            if(res.data==null){
                this.setState({deviceStatus:'null'});
            }else if(res.data.binded){
                W.alert(___.binded_other_vehicle);
                this.setState({deviceStatus:'binded'});
            }else{
                this.setState({
                    did:value,
                    model:res.data.model,
                    deviceStatus:'ok',
                });
            }
        },{
            did:value,
            uid:_user.customer.objectId
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
    cancel(){
        history.back();
        this.props.cancel();
    }
    submit(){
        if(this.state.did==''){
            W.alert(___.device_id_empty);
            return;
        }
        if(this.state.deviceStatus=='binded'){
            W.alert(___.please_re_input_device_num);
            return;
        }else if(this.state.deviceStatus=='null'){
            W.alert(___.please_input_correct_device_num);
            return;
        }

        //更新车辆的设备信息
        Wapi.vehicle.update(res=>{
            
        },{
            _objectId:this.props.curCar.objectId,
            did:this.state.did,
            deviceType:this.state.model,
        });

        //更新设备的信息
        let deviceInfo={
            did:this.state.did,
            deviceType:this.state.model,
        };
        let now=W.dateToString(new Date());
        Wapi.device.update(res=>{
            // history.back();
            if(this.state.close){
                 this.props.submit(deviceInfo);
            }
        },{
            _did:this.state.did,
            bindDate:now,
            binded:true,
            vehicleName:this.props.curCar.name,
            vehicleId:this.props.curCar.objectId,
        });

        //发送指令
        let command=false;
        if(command){
            Wapi.device.sendCommand(res=>{
                
            },{
                did:this.state.did,
                cmd_type:a.type,
                params:{}
            });
        }
       

        if(this.state.check){
            if(!this.state.command.data){
                Wapi.command.add(resp => {
                    if(resp.status_code==0){
                        console.log(13)
                        Wapi.device.update(respond => {
                            this.forceUpdate();
                            
                        },{
                            _did:this.state.command.data.did,
                            params:{speedLimit:this.state.speed}
                        })
                    }else {
                        console.log(1)
                        W.alert('设备无法设置超速报警');
                        this.setState({close:false})
                    }
                },{
                    did:this.state.did,
                    params: {param_id: 0x0055, param_value: this.state.speed},
                    cmd_type:0x8103
                })
            }else if(this.state.command.data&&!this.state.command.data.params){
                Wapi.command.update(resp => {
                    console.log(resp,'resp')
                    if(resp.status_code==0){
                        Wapi.device.update(respond => {
                            this.forceUpdate();
                            
                        },{
                            _did:this.state.command.data.did,
                            params:{speedLimit:this.state.speed}
                        })
                    }else {
                        W.alert('设备无法设置超速报警')
                        this.setState({close:false})
                    }
                },{
                    _objectId:this.state.command.data.objectId,
                    params: {param_id: 0x0055, param_value: this.state.speed},
                    cmd_type:0x8103
                })
            }else if(this.state.command.data.params&&this.state.command.data.params.hasOwnProperty('param_value')){
                Wapi.command.update(resp => {
                    if(resp.status_code==0){
                        Wapi.device.update(respond => {
                            this.forceUpdate();
                            
                        },{
                            _did:this.state.command.data.did,
                            params:{speedLimit:this.state.speed}
                        })
                    }else {
                        W.alert('设备无法设置超速报警')
                        this.setState({close:false})
                    }
                },{
                    _objectId:this.state.command.data.objectId,
                    params:{param_id: 0x0055,param_value: this.state.speed},
                    cmd_type:0x8103
                })
            }
        }else {
            if(this.state.command.data&&this.state.command.data.params&&this.state.command.data.params.hasOwnProperty('param_value')){
                Wapi.command.update(resp => {
                    if(resp.status_code==0){
                        Wapi.device.update(respond => {
                            this.forceUpdate();
                        },{
                            _did:this.state.command.data.did,
                            params:{}
                        })
                    }else {
                        W.alert('设备无法设置超速报警');
                        this.setState({close:false})
                    }
                },{
                    _objectId:this.state.command.data.objectId,
                    params: {},
                    cmd_type:''
                })
            }
        }
        
    }
   
    componentWillReceiveProps(nextProps){
        if(nextProps.curCar.did){//如果当前选中车辆已绑定终端，则显示其终端编号和终端型号
            this.setState({
                did:nextProps.curCar.did,
                model:nextProps.curCar.deviceType,
                noEdit:true,
            });
            // if()
            Wapi.command.get(res => {
                this.setState({command:res})
            },{
                did:nextProps.curCar.did
            },{fields:'did,params,cmd_type,objectId'})
            if(this.state.command){
                Wapi.device.get(res => {
                    console.log(res.data.params,'paramsssssssssss')
                    if(res.data.params&&res.data.params.hasOwnProperty('speedLimit')){
                        this.setState({check:true})
                        this.setState({speed:res.data.params.speedLimit})
                    }else {
                        this.setState({speed:200})
                        this.setState({check:false})
                    }
                },{did:nextProps.curCar.did})
            }
        }else{//如果当前选中车辆未绑定终端，则重置其终端编号和终端型号为空
            this.setState({
                did:'',
                model:'',
                noEdit:false,
                verify:false,
            });
        }
    }
    
    Changevalue(e, value){
        this.setState({speed:value})
    }
    Check(e,value){
        // console.log(isInputChecked,'isInputChecked')
        // console.log(event,'event')
        // console.log(this.state.speed,'speed')
        this.setState({check:value})
    }
    render(){
        // console.log(this.state.deviceStatus,'deviceStatus')
        // console.log(this.state.did,'did')
        // console.log(this.state.model,'model')
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
                    <Input 
                        name='did' 
                        floatingLabelText={___.device_id} 
                        onChange={this.didChange} 
                        value={this.state.did}  
                        disabled={this.state.noEdit}
                    />
                    <div style={{paddingTop:'10px',paddingBottom:'1em',color:'rgba(0, 0, 0, 0.298039)'}} >
                        <span>{___.device_type+': '}</span><span name='model'>{this.state.model}</span>
                    </div>
                    <div style={{paddingTop:'10px',paddingBottom:'1em'}} >
                        <div style={this.state.noEdit?{display:'flex',alignItems: 'center',padding:'0',color:'rgba(0, 0, 0, 0.298039)',width:'100%'}:{display:'flex',alignItems: 'center',padding:'0',width:'100%'}}>
                            <Checkbox
                                label={(<div style={{width: 80}}>{'超速报警'+': '}</div>)}
                                style={{flexGrow: 0,width: 'auto'}}
                                iconStyle={{marginRight:2,marginLeft:-1}}
                                disabled={this.state.noEdit}
                                checked={this.state.check}
                                onCheck={this.Check}
                                />
                            {/*<label style={{flexGrow: 0, marginRight: '5px',width: 80}}>{'超速报警'+': '}</label>*/}
                            <div style={{flexGrow: 2,width:'45%'}}>
                                <Slider 
                                    max={200}
                                    step={5}
                                    defaultValue={200} 
                                    value={this.state.speed}
                                    style={{width:'100%'}} 
                                    disabled={this.state.noEdit}
                                    onChange={this.Changevalue}
                                />
                            </div>
                            <span style={{marginLeft:10}}>{this.state.speed+"km/h"}</span>
                        </div> 
                    </div>
                    {/*<Checkbox 
                        name='verify' 
                        label={___.driver_verify} 
                        labelStyle={{color:'rgba(0, 0, 0, 0.298039)'}}
                        onCheck={this.verifyChange} 
                        checked={this.state.verify} 
                        disabled={this.state.noEdit} 
                    />
                    <Input 
                        name='warnSpeed' 
                        floatingLabelText={___.warn_speed} 
                        onChange={this.warnSpeedChange} 
                        value={this.state.warnSpeed}  
                        disabled={this.state.noEdit}
                    />
                    <Input 
                        name='time' 
                        floatingLabelText={___.forbidden_time} 
                        onChange={this.timeChange} 
                        value={this.state.time}  
                        disabled={this.state.noEdit}
                    />*/}
                </div>
                <div style={styles.bottomBtn}>
                    {/*<FlatButton
                        label={___.cancel}
                        primary={true}
                        onClick={this.cancel}
                    />*/}
                    {btnRight}
                </div>
            </div>
        )
    }
}