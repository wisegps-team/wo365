import React, {Component} from 'react';
import {ThemeProvider} from '../../_theme/default';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import HardwareKeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import IconMenu from 'material-ui/IconMenu';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';

import MyAccount from '../my_account';
import CompanyInfo from '../company_info';
import SonPage from '../base/sonPage';

require('../../_sass/pc_index.scss');

class APP extends Component {
    render() {
        return (
            <ThemeProvider>
                <div>
                    <Header/>
                    <div id="main">
                    <Left>
                        {this.props.leftContent}
                    </Left>
                    <div className="main_R">
                        {this.props.children}
                    </div>
                </div>
                </div>
            </ThemeProvider>
        );
    }
}

export default APP;

const sty={
    iconStyle:{
        fill:"#FFF"
    },
    app:{
        position: 'fixed'
    },
    p:{
        padding: '10px',
    }
}

class Header extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            openMenu:false,
            account_open:false,
            info_open:false
        };

        this.handleOnRequestChange = this.handleOnRequestChange.bind(this);
        this.handleOpenMenu = this.handleOpenMenu.bind(this);
        this.openAccount = this.openAccount.bind(this);

    }

    handleOpenMenu(){
        this.setState({
            openMenu: true,
        });
    }

    handleOnRequestChange(value){
        this.setState({
            openMenu:false,
        });
    }

    openAccount(){
        this.setState({account_open:true});
    }

    render() {
        return (
            <AppBar style={sty.app} title={___.app_name}>
                <div className="top_Mid">
                    <span>{'车辆监控'}</span>
                    <span><a href={WiStorm.root+'src/pc/carManage.html'}>{___.car_manage}</a></span>
                    <span>{'报表管理'}</span>
                    <span><a href={WiStorm.root+'src/pc/deviceManage.html'}>{___.device_manage}</a></span>
                    <span>
                        <IconMenu
                            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                            targetOrigin={{horizontal: 'left', vertical: 'top'}}
                            iconStyle={sty.iconStyle}
                        >
                        <MenuItem primaryText="人员管理" />
                        <MenuItem primaryText="部门管理" />
                        <MenuItem primaryText="角色定义" />                           
                        </IconMenu>
                    </span>
                </div>
                <div className="top_R">
                    <span>
                        <span onClick={this.handleOpenMenu}>{_user.username}</span>
                        <IconMenu
                            iconButtonElement={<IconButton><div>{_user.username}</div></IconButton>}
                            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                            targetOrigin={{horizontal: 'right', vertical: 'top'}}                        
                            open={this.state.openMenu}
                            style={{width:"5px"}}
                            onRequestChange={this.handleOnRequestChange}
                        >
                        <MenuItem value="1" primaryText={___.my_account} onClick={this.openAccount}/>
                        <MenuItem value="2" primaryText={___.company_info} onClick={()=>this.setState({info_open:true})}/>                           
                        </IconMenu>                           
                    </span>
                    <span onClick={W.logout}>{___.logout}</span>
                </div>
                <SonPage open={this.state.account_open} back={()=>this.setState({account_open:false})}>
                    <MyAccount/>
                </SonPage>
                <SonPage open={this.state.info_open} back={()=>this.setState({info_open:false})}>
                    <CompanyInfo/>
                </SonPage>
            </AppBar>
        );
    }
}

class Left extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={onoff:false};
        this.handlClick = this.handlClick.bind(this);
    }

    handlClick(){
       if(this.state.onoff){
           this.setState({onoff:false});
       }else{
           this.setState({onoff:true});
       }
   }
    render() {
        return (
            <div className='main_L'>
                <HardwareKeyboardArrowLeft className="Put_on" onClick={this.handlClick}/>
                {this.props.children}
            </div>
        );
    }
}