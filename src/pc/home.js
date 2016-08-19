import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import APP from '../_component/pc/app';

window.onload=function (){           
    ReactDOM.render(<App/>,W('#APP'));
}

class App extends Component{
    render() {
        return (
            <APP
                leftContent={<h4>侧边栏放这里</h4>}
            >
                <h4>主要内容放这里</h4>
            </APP>
        );
    }
}