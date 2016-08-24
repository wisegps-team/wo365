import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import {List, ListItem} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import P from '../_modules/public';


const sty={
    ids:{fontSize:'14px',borderBottom:'solid 1px #ccc',paddingTop:'10px',paddingBottom:'10px',paddingLeft:'50px'},
    nls:{paddingLeft:'15px',paddingTop:'0px',paddingBottom:'0px'},
    cb:{marginLeft:'-10px',marginTop:'-5px'}
}

export class UserTree extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            checked:true,
            name:props.data.cust_name
        }
    }

    componentWillReceiveProps(nextProps) {
        let state={
            name:nextProps.data.cust_name,
            checked:(nextProps.parentChecked!=this.props.parentChecked)?nextProps.parentChecked:this.state.checked
        }
        this.setState(state);
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        return !P.requal(this.state,nextState);
    }
    
    handleTouch(e){
        this.setState({checked:!this.state.checked});
        let taht=this;
        setTimeout(function(){
            if(!taht.state.checked){
                taht.props.userClick(taht.props.data,"delete");
            }else{
                taht.props.userClick(taht.props.data,"add");
            }
        },500);
        
    }
    render(){
        let fun=this.props.userClick;
        let children=[];
        if(this.props.data.children)
            children=this.props.data.children.map(function (ele) {
                return <UserTree key={ele.cust_id} data={ele} userClick={fun} parentChecked={this.state.checked}/>;
            },this);
        return (
            <ListItem
                primaryText={this.state.name}
                initiallyOpen={true}
                primaryTogglesNestedList={true}
                innerDivStyle={sty.ids}
                nestedItems={children}
                nestedListStyle={sty.nls}
                leftCheckbox={<Checkbox style={sty.cb} defaultChecked={this.state.checked} onClick={this.handleTouch.bind(this)}/>}
                
            />
        );
    }
}

export default UserTree;