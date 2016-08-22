import React, {Component} from 'react';

import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import IconButton from 'material-ui/IconButton';

import {randomStr} from '../../_modules/tool';

const sty={
    p:{
        padding: '10px',
    }
}
class Sonpage extends Component {
    constructor(props, context) {
        super(props, context);
        this.key=randomStr();//获取32位随机字符串作为标识
        this.historyChange = this.historyChange.bind(this);
        this.back = this.back.bind(this);
        this.setHistory();
    }
    componentWillReceiveProps(nextProps) {
        this.setHistory(nextProps);
    }

    componentWillUnmount() {
        this.removeAndBack();
    }
    

    setHistory(props){//每次展示的时候都设置一下历史
        if(!WiStorm.agent.mobile)return;
        if((props&&props.open!=this.props.open&&props.open)||(!props&&this.props.open)){
            history.pushState(this.key,'id',location.href);//算是透明的层,一旦到这个层，会马上执行historyChange
            history.pushState(this.key+'1','id',location.href);//用户真正见到的地址
            window.addEventListener('popstate',this.historyChange);
            this.listening=true;
            this.history=2;//标记设置了多少个pushState
        }else if(!this.props.open){
            this.removeAndBack();
        }
    }

    historyChange(e){//移除事件监听，并且退回一个地址，然后执行props.back()
        if(e.state==this.key){
            this.history--;
            this.removeListener();
            this.props.back();
        }
    }

    removeAndBack(){//卸载事件同时回到最初的地址
        if(WiStorm.agent.mobile&&this.listening){
            this.removeListener();
            if(this.history--){
                history.back();
            } 
        }
    }
    removeListener(){//移除事件监听，并且退回一个地址
        if(this.listening){
            window.removeEventListener('popstate',this.historyChange);
            this.listening=false;
            if(this.history--){
                history.back();
            } 
        }
    }

    back(){
        if(WiStorm.agent.mobile)
            history.back();
        else
            this.props.back();
    }

    render() {
        let w=WiStorm.agent.mobile?window.screen.width:300;
        return (
            <Drawer
                width={w} 
                openSecondary={true} 
                open={this.props.open} 
            >
                <AppBar
                    title={this.props.title}
                    iconElementLeft={<IconButton onClick={this.back}><NavigationArrowBack/></IconButton>}
                />
                <div style={sty.p}>
                    {this.props.children}
                </div>
            </Drawer>
        );
    }
}

export default Sonpage;