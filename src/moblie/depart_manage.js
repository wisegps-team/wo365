import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import AppBar from '../_component/base/appBar';
import DepartmentTree from'../_component/department_tree';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

const sty={
    main:{
        padding:'10px'
    }
}

class App extends Component {
    render() {
        return (
            <ThemeProvider>
                <AppBar title={___.depart_manage}/>
                <div style={sty.main}>
                    <DepartmentTree/>
                </div>
            </ThemeProvider>
        );
    }
}