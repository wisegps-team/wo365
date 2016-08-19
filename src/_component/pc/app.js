import React, {Component} from 'react';
import {ThemeProvider} from '../../_theme/default';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import HardwareKeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import IconMenu from 'material-ui/IconMenu';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';

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

//头部组件
var header_style={
    iconStyle:{
        fill:"#FFF"
    }
}
const sty={
    app:{
        position: 'fixed'
    }
}

class Header extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={openMenu:false};

        this.handleOnRequestChange = this.handleOnRequestChange.bind(this);
        this.handleOpenMenu = this.handleOpenMenu.bind(this);
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

    render() {
        return (
            <AppBar style={sty.app} title={___.app_name}>
                <div className="top_Mid">
                    <span>{'车辆监控'}</span>
                    <span>{___.car_manage}</span>
                    <span>{'报表管理'}</span>
                    <span>{___.device_manage}</span>
                    <span>
                        <IconMenu
                            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                            targetOrigin={{horizontal: 'left', vertical: 'top'}}
                            iconStyle={header_style.iconStyle}
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
                        <MenuItem value="1" primaryText={<a href={WiStorm.root+'src/moblie/home.html'}>{___.my_account}</a>} />
                        <MenuItem value="2" primaryText={<a href={WiStorm.root+'src/moblie/home.html'}>{___.company_info}</a>} />                           
                        </IconMenu>                           
                    </span>
                    <span onClick={W.logout}>{___.logout}</span>
                </div>
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