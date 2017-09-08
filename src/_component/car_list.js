import React from 'react';

import {List , ListItem,MakeSelectable} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
import {getStatusDesc} from '../_modules/car_state';

export class CarList extends React.Component {
    render(){
        let items=this.props.data.map(e=>{
            let sty=null;
            if(e.objectId==this.props.active)
                sty={background:'#ccc'};
            return (<CarItem 
                click={this.props.carClick} 
                data={e} 
                key={e.objectId}
                style={sty}
            />)
        });
        return (
            <List>
                {items}
            </List>
        );
    }
}

class CarItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.click = this.click.bind(this);
    }
    click(){
        this.props.click(this.props.data.objectId);
        if(WiStorm.agent.mobile)
            setTimeout(()=>history.back(),300);
    }
    
    render(){
        let ele=this.props.data;
        let status_show=___.null_device;
        let time='';
        if(ele._device){
            let data=ele._device.activeGpsData;
            if(data){
                time=W.dateToString(W.date(data.rcvTime));
                status_show=getStatus(data,ele);
            }else
                status_show=___.null_gps;
        }

        let ist=Object.assign({paddingTop:'5px',paddingBottom:'5px',fontSize:'14px'},this.props.style);
        let color = (<span style={{color: '#999',fontSize:'12px'}}>{status_show}</span>);
        if(this.props.data._device){
            let state=getStatusDesc(this.props.data._device,2);
            if(state.state==0){
                color=(<span style={{color: '#999',fontSize:'12px'}}>{status_show}</span>)
            }else if(state.state == 1){
                color=(<span style={{color: 'green',fontSize:'12px'}}>{status_show}</span>)
            }else if(state.state == 2){
                color=(<span style={{color: '#000',fontSize:'12px'}}>{status_show}</span>)
            }else if(state.state >= 3){
                color=(<span style={{color: 'red',fontSize:'12px'}}>{status_show}</span>)
            }
        }
        
        return <ListItem
            primaryText={<div>{ele.name}<span style={{float: 'right'}}>{time.slice(5,-3)}</span></div>}
            secondaryText={color}
            innerDivStyle={ist}
            onClick={this.click}
        />
    }
}


function formatStopTime(stop_time){
    stop_time=stop_time/1000/60;
    if(stop_time < 60){
        stop_time=stop_time.toFixed(0);
        stop_time=(stop_time<10)?'0'+stop_time.toString():stop_time.toString();
        return stop_time+ ___.m;
    }else{
        var stop_hour = (stop_time / 60).toFixed(0);
        var stop_min = (stop_time % 60).toFixed(0);
        stop_hour=(stop_hour<10)?'0'+stop_hour.toString():stop_hour.toString();
        stop_min=(stop_min<10)?'0'+stop_min.toString():stop_min.toString();
        return stop_hour + ___.h + stop_min + ___.m;
    }
}

function getStatus(data,ele){
    let status_show='';
    let status=getStatusDesc(ele._device,1);//status.desc行驶
    let uni_status=status.status_desc;
    let stopTime=W.date(data.gpsTime).getTime();
    let nowTime=new Date().getTime();
    let stop_duration=formatStopTime(nowTime-stopTime);
    let speed=data.speed.toFixed(0) + "km/h";
    status_show=uni_status+" "+status.desc+" "+stop_duration;
    if(status.desc==___.travel){
        status_show=uni_status+" "+status.desc+" "+speed;
    }else if(status.desc.slice(0,2)==___.offline){
        status_show=uni_status+" "+status.desc;
    }
    return status_show;
}

export default CarList;
