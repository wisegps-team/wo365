import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import CarBrand from '../_component/base/carBrand';
import AppBar from '../_component/base/appBar';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);

    thisView.prefetch('component/carBrand.js',1);
});

class App extends Component {
    getChildContext() {
        return {
            view:thisView
        };
    }
    render() {
        return (
            <ThemeProvider>
            <div>
                <AppBar title={___.car_manage}/>
                <div>
                    <h1>撑高度</h1>
                    <h1>撑高度</h1>
                    <h1>撑高度</h1>
                    <CarBrand onChange={res=>console.log(res)}/>
                </div>
            </div>
            </ThemeProvider>
        );
    }
}

App.childContextTypes = {
    view: React.PropTypes.object
};