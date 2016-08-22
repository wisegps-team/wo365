import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import APP from '../_component/pc/app';

window.onload=function (){           
    ReactDOM.render(<App/>,W('#APP'));
}

class App extends Component{
    constructor(props, context) {
        super(props, context);
        
    }
    
    render() {
        return (
            <APP
                leftContent={<h4>侧边栏放这里</h4>}
                leftBar={false}
            >
                <h4>主要内容放这里</h4>
            </APP>
        );
    }
}