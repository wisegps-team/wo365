import React from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';

import STORE from '../_reducers/main';
import {ACT} from '../_actions';

import {ThemeProvider} from '../_theme/default';
import {CarList} from '../_component/car_list';
import {DepartList} from '../_component/user_tree';
import Map from '../_component/map';
import MapManager from '../_component/map_manager';


// 打印初始状态
console.log(STORE.getState());

// 每次 state 更新时，打印日志
// 注意 subscribe() 返回一个函数用来注销监听器
let unsubscribe = STORE.subscribe(() =>
    console.log(STORE.getState())
)

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

window.addEventListener('load',function(){
    ReactDOM.render(
        <Provider store={STORE}>
            <APP/>
        </Provider>
        ,W('#APP'));
});



class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            drawer:true
        }
    }

    componentDidMount(){
        STORE.dispatch(ACT.fun.getCars());
    }

    render() {
        return (
            <ThemeProvider>
                <div>
                    <AppBar
                        title=''
                        iconClassNameRight="muidocs-icon-navigation-expand-more"
                        onLeftIconButtonTouchTap={()=>this.setState({drawer:true})}
                        className='appbar'
                    />
                    <Drawer open={this.state.drawer}>
                        <AppBar
                        title={___.title}
                        onLeftIconButtonTouchTap={()=>this.setState({drawer:false})}
                        />
                        <div style={styles.userTreeBox}>
                            <DepartList userClick={userClick}/>
                        </div>
                        <div style={styles.carListBox}>
                            <CarList 
                                data={this.props.show_cars} 
                                carClick={carClick} 
                                active={this.props.select_car}
                            />
                        </div>
                    </Drawer>
                    <div className='container'>
                        <Map id='monitor_map' cars={this.props.show_cars} style={{width:'100%',height: 'calc(100vh - 50px)'}} active={this.props.select_car} carClick={carClick}/>
                        {/*<MapManager style={styles.manager} key='MapManager' />*/}
                    </div>
                </div>
            </ThemeProvider>
        );
    }
}

const APP=connect(function select(state) {
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