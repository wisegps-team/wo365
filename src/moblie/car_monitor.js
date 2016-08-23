import React from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';

import Drawer from 'material-ui/Drawer';

import STORE from '../_reducers/monitor';
import {ACT} from '../_actions';

import APP from '../_component/pc/app';
import {CarList} from '../_component/car_list';
import {UserTree} from '../_component/user_tree';
import Map from '../_component/map';
import MapManager from '../_component/map_manager';
import AppBar from '../_component/base/appBar';
import SonPage from '../_component/base/sonPage';
import {ThemeProvider} from '../_theme/default';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconButton from 'material-ui/IconButton';

const styles = {
  container: {
    textAlign: 'center',
    paddingLeft:'256px'
  },
  userTreeBox:{
      display:'block',
      height:'35vh',
      overflow:'auto'
  },
  carListBox:{
      display:'block',
      height:'55vh',
      borderTop:'solid 1px #999',
      overflow:'auto'
  },
    manager:{
        position: 'absolute',
        zIndex: 1,
        width: '300px',
        right: 0,
        top:'50px',
        maxHeight: '100%'
    }
};

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(
    <Provider store={STORE}>
        <ConnectAPP/>
    </Provider>
    ,thisView);
});



class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            drawer:false
        }
        this.handleUser = this.handleUser.bind(this);

    }

    componentDidMount(){
        STORE.dispatch(ACT.fun.getUsers(true));//异步的action
    }

    handleUser(){
        this.setState({drawer:!this.state.drawer});
    }

    render() {
        return (
            <ThemeProvider>
                <div>
                    <AppBar
                        iconElementRight={<IconButton onClick={this.handleUser}><MoreVertIcon /></IconButton>}
                    />
                    <Map id='monitor_map' style={{width:'100%',height: 'calc(100vh - 50px)'}} cars={this.props.show_cars} active={this.props.select_car} carClick={carClick}/>
                    <SonPage open={this.state.drawer} back={this.handleUser}>
                        <div style={styles.userTreeBox}>
                            <UserTree data={this.props.user} userClick={userClick} select_users={this.props.select_users} />
                        </div>
                        <div style={styles.carListBox}>
                            <CarList 
                                data={this.props.show_cars} 
                                carClick={carClick} 
                                active={this.props.select_car}
                            />
                        </div>
                    </SonPage>
                </div>
            </ThemeProvider>
        );
    }
}

const ConnectAPP=connect(function select(state) {
    let sta={};
    Object.assign(sta,state);
    sta.show_cars=(sta.show_cars==ACT.const.all)?sta.cars:sta.show_cars;
    return sta;
})(App);

function  carClick(data) {
    STORE.dispatch(ACT.fun.selectCar(data));
}

function userClick(data,intent){
    if(intent=="delete"){
        STORE.dispatch(ACT.fun.selectUsersDelete(data));
    }else if(intent=="add"){
        STORE.dispatch(ACT.fun.selectUsersAdd(data));
    }
}