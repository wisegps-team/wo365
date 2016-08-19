import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../../../_theme/default';

import Input from '../input';
import carBrandAction from './action';
import AppBar from '../appBar';

import Select from './select';

const sty={
    box:{
        position: 'relative',
        height: '58px'
    },
}

class CarBrand extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            name:''
        }
        if(props.value){
            this.state.name=CarBrand.getName(props.value);
        }
        this.callSelect = this.callSelect.bind(this);
        this.action=new carBrandAction();
    }
    componentDidMount() {
        let that=this;
        this.action.on('change',function(e){//监听change
            let val=e.params;
            that.setState({name:CarBrand.getName(val)});
            that.props.onChange(e.params);
        });
    }

    componentWillUnmount() {
        this.action.clearEvent();
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.value){
            let name=CarBrand.getName(nextProps.value);
            if(name!=this.state.name)
                this.setState({name});
        } 
    }

    callSelect(e){
        this.action.emit('select',this.action.key);//触发选择事件，发送自身的key
        if(WiStorm.agent.mobile)
            this.context.view.goTo(WiStorm.root+'src/moblie/component/carBrand.js');
        else{
            let h=e.clientY/window.screen.height;
            let w=window.screen.width-e.clientX;
            let s={
                top:'auto',
                botton:'auto',
                left:'auto',
                right:'auto',
                transform: 'scale(1, 1)',
                transformOrigin: '',
            }
            let or='';
            if(w<300){
                s.right=w+'px';
                s.transformOrigin='right ';
            }else{
                s.left=e.clientX+'px';
                s.transformOrigin='left ';
            } 

            if(h<0.2){
                s.top=e.clientY+'px';
                s.transformOrigin+='top ';
            }else if(h>0.8){
                s.botton=(window.screen.height-e.clientY)+'px';
                s.transformOrigin+='botton ';
            }else{
                if(h<0.5){
                    s.top='20%';
                    s.transformOriginr+='top ';
                }else{
                    s.botton='20%';
                    s.transformOrigin+='botton ';
                }
            }
            Object.assign(view.style,s);
        }
    }

    render() {
        let s=Object.assign({},sty.box,this.props.style);
        return (
            <div style={s} >
                <Input hintText='请选择车型' value={this.state.name} onClick={this.callSelect}/>
            </div>
        );
    }
}

CarBrand.contextTypes = {
    muiTheme: React.PropTypes.object,
    view: React.PropTypes.object
};

CarBrand.getName=function(val){
    if(val.brandId)
        return val.brand+' '+val.serie+' '+(val.type||'');
    else
        return '';
}

export default CarBrand;

const action=new carBrandAction();
let view;
action.on('load',function(e){
    let id=e.params;
    view=document.querySelector('#'+id);
    ReactDOM.render(<App/>,view);
});

class App extends Component{
    constructor(props, context) {
        super(props, context);
        this.change = this.change.bind(this);
    }
    
    componentDidMount() {
        let that=this;
        action.on('select',function(e){
            action.key=e.params;
        });
    }

    componentWillUnmount() {
        action.clearEvent();
    }

    change(res){
        action.emit('change',res);
        if(WiStorm.agent.mobile)
            history.back();
        else{
            view.style.transform='scale(0, 0)';
        }
    }
    render() {
        let appbar=WiStorm.agent.mobile?(<AppBar title={___.select_type}/>):null;
        return (
            <ThemeProvider>
            <div>
                {appbar}
                <Select onChange={this.change}/>
            </div>
            </ThemeProvider>
        );
    }
}

window.addEventListener('load',function(){
if(!WiStorm.agent.mobile){//pc端直接创建一个div
    let div=document.createElement('div');
    div.id='a'+action.getkey();//获得随机字符串

    let style={
        width:'300px',
        maxHeight: '80%',
        overflowY:'auto',
        overflowX: 'hidden',
        color: 'rgba(0, 0, 0, 0.870588)',
        transition: 'transform 250ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, opacity 250ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        boxSizing: 'border-box',
        webkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
        boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
        borderRadius: '2px',
        opacity: 1,
        transform: 'scale(0, 0)',
        transformOrigin: 'right top 0px',
        position: 'fixed',
        zIndex: 2100,
        backgroundColor: 'rgb(255, 255, 255)',
    }
    Object.assign(div.style,style);
    document.body.appendChild(div);
    action.emitLoad(div.id);
}
})