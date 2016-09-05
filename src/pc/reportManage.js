import React from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';

import {List, ListItem} from 'material-ui/List';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import APP from '../_component/pc/app';
import Input from '../_component/base/input';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import WTable from '../_component/table';

window.addEventListener('load',function(){
    ReactDOM.render(
            <App/>
        ,W('#APP'));
});
const styles={
    table_height:window.innerHeight-280,
    main:{padding:'0px 20px'},
    empty:{},
    input_margin:{marginLeft:'1em',height:'3em'},
    table_cell:{display:'table-cell'},
    Table_cells:{paddingLeft:'36px'},
}

const _types=[
    {id:'1',desc:___.all_type},
    {id:'2',desc:___.alarm_alert},
    {id:'3',desc:___.fence_alert},
    {id:'4',desc:___.sos_alert},
];
class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        const now=new Date();
        now.setHours(0, 0, 0, 0);
        this.state={
            main_page:'history',
            user_name:'',
            alert_type:1,
            alert_types:[],
            car_num:'',
            start_time:now,
            end_time:now,
        };
        this.nameChange=this.nameChange.bind(this);
        this.typeChange=this.typeChange.bind(this);
        this.carNumChange=this.carNumChange.bind(this);
    }
    toHistoryPage(){
        this.setState({
            main_page:'history',
        });
    }
    toAlertPage(){
        this.setState({
            main_page:'alert',
        });
    }
    toSpeedPage(){
        this.setState({
            main_page:'speed',
        });
    }
    nameChange(e,value){
        this.setState({user_name:value});
    }
    typeChange(e,value,selected){
        this.setState({alert_type:selected});
    }
    carNumChange(e,value){
        this.setState({car_num:value});
    }
    componentDidMount(){
        this.setState({alert_types:_types});
    }
    render() {
        let left=<List>
                    <ListItem primaryText={___.history_record} onClick={this.toHistoryPage.bind(this)} />
                    <ListItem primaryText={___.alert_record} onClick={this.toAlertPage.bind(this)} />
                    <ListItem primaryText={___.over_speed_record} onClick={this.toSpeedPage.bind(this)} />
                </List>
        let main;
        switch(this.state.main_page){
            case 'history':
                main=<HistoryPage/>;
                break;
            case 'alert':
                main=<AlertPage/>;
                break;
            case 'speed':
                main=<SpeedPage/>;
                break;
            default:
                break;
        }
        let typeItems=this.state.alert_types.map(ele=><MenuItem value={ele.id} key={ele.id} primaryText={ele.desc} />);
        return (
            <APP leftContent={left}>
                <div style={styles.main}>
                    <table>
                        <tbody>
                            <tr>
                                <td style={{display:this.state.main_page=='history'?'table-cell':'none'}} >{___.user_name}</td>
                                <td style={{display:this.state.main_page=='history'?'table-cell':'none'}} >
                                    <TextField style={styles.input_margin} value={this.state.user_name} name='username' onChange={this.nameChange} />
                                </td>
                                <td style={{display:this.state.main_page=='alert'?'table-cell':'none'}} >{___.alert_type}</td>
                                <td style={{display:this.state.main_page=='alert'?'table-cell':'none'}} >
                                    <SelectField style={styles.input_margin} value={this.state.alert_type} onChange={this.typeChange}>
                                        {typeItems}
                                    </SelectField>
                                </td>
                                <td >{___.carNum}</td>
                                <td >
                                    <TextField style={styles.input_margin} value={this.state.car_num} name='carnum' onChange={this.carNumChange} />
                                </td>
                            </tr>

                            <tr>
                                <td >{___.start_time}</td>
                                <td ><DatePicker style={styles.input_margin} hintText={___.start_time} defaultDate={this.state.start_time}/></td>
                                <td >{___.end_time}</td>
                                <td ><DatePicker style={styles.input_margin} hintText={___.end_time} defaultDate={this.state.end_time}/></td>
                                <td ><RaisedButton label={___.filter} primary={true} /></td>
                            </tr>
                        </tbody>
                    </table>
                    {main}
                </div>
            </APP>
        );
    }
}

let _hReport={
    carnum:'铝厂基建办希铝CC-132',
    distance:'200',
    stop:'9',
    forbid:'3',
    overspeed:'2',
    theft:'1',
    fence:'0',
}
let _hReports=[];
for(let i=0;i<12;i++){
    _hReports.push(_hReport);
}
// let _hHeader=[
//     {'name':'carnum','key':'carnum'},
//     {'name':'distance','key':'distance'},
//     {'name':'stop','key':'stop'},
//     {'name':'forbid','key':'forbid'},
//     {'name':'overspeed','key':'overspeed'},
//     {'name':'theft','key':'theft'},
//     {'name':'fence','key':'fence'}
// ];
class HistoryPage extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            data:[],
            total:0,
            limit:10,
        };
        // this.keys=[];
    }
    componentDidMount(){
        // Wapi._iotStat.list(res=>{
        //     this.setState({
        //         data:res.data,
        //         total:res.total,
        //     });
        // },{
        //     uid:_user.customer.objectId
        // });

        this.setState({
            data:_hReports,
            total:_hReports.length,
        });

        // this.keys=_hHeader.map(ele=>{
        //     return ({'name':ele.name,'key':ele.key});
        // });
    }
    render(){
        let tableItems = this.state.data.map((ele,index)=>
            <TableRow key={index} >
                <TableRowColumn style={{width:'25%'}} >{ele.carnum}</TableRowColumn>
                <TableRowColumn style={styles.Table_cells} >{ele.distance}</TableRowColumn>
                <TableRowColumn style={styles.Table_cells} >{ele.overspeed}</TableRowColumn>
                <TableRowColumn style={styles.Table_cells} >{ele.theft}</TableRowColumn>
                <TableRowColumn style={styles.Table_cells} >{ele.fence}</TableRowColumn>
            </TableRow>);
        return(
                <Table fixedHeader={true} height={styles.table_height+'px'}>
                    <TableHeader style={{borderTop:'solid 1px #cccccc'}} displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn style={{width:'25%'}} >{___.carNum}</TableHeaderColumn>
                            <TableHeaderColumn >{___.mileage}</TableHeaderColumn>
                            <TableHeaderColumn >{___.overSpeed_alert+'('+___.times+')'}</TableHeaderColumn>
                            <TableHeaderColumn >{___.alarm_alert+'('+___.times+')'}</TableHeaderColumn>
                            <TableHeaderColumn >{___.fence_alert+'('+___.times+')'}</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody style={{borderBottom:'solid 1px #cccccc'}} displayRowCheckbox={false} stripedRows={true}>
                        {tableItems}
                    </TableBody>
                </Table>
        )
    }
}

let _wReport={
    type:'GPS天线断线报警',
    time:'2016-08-31 14:00:00',
    place:'新疆维吾尔自治区昌吉回族自治州吉木萨尔县，离五彩湾东方希望350米',
}
let _wReports=[];
for(let i=0;i<8;i++){
    _wReports.push(_wReport);
}
// let _wHeader=[
//     {'name':'type','key':'type'},
//     {'name':'time','key':'time'},
//     {'name':'place','key':'place'},
// ];
class AlertPage extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            data:[],
            total:0,
            limit:10,
        };
        // this.keys=[];
    }
    componentDidMount(){
        // Wapi._iotAlert.list(res=>{
        //     this.setState({
        //         data:res.data,
        //         total:res.total,
        //     });
        // },{
        //     uid:_user.customer.objectId
        // },{});

        this.setState({
            data:_wReports,
            total:_wReports.length,
        });
        // this.keys=_wHeader.map(ele=>{
        //     return ({'name':ele.name,'key':ele.key});
        // });
    }
    render(){
        let tableItems = this.state.data.map((ele,index)=>
            <TableRow key={index}>
                <TableRowColumn style={{width:'20%'}}>{ele.type}</TableRowColumn>
                <TableRowColumn style={{width:'25%'}}>{ele.time}</TableRowColumn>
                <TableRowColumn style={{width:'55%'}}>{ele.place}</TableRowColumn>
            </TableRow>);
        return(
                <Table fixedHeader={true}>
                    <TableHeader style={{borderTop:'solid 1px #cccccc'}} displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn style={{width:'20%'}}>{___.alert_type}</TableHeaderColumn>
                            <TableHeaderColumn style={{width:'25%'}}>{___.alert_time}</TableHeaderColumn>
                            <TableHeaderColumn style={{width:'55%'}}>{___.place}</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody style={{borderBottom:'solid 1px #cccccc'}} displayRowCheckbox={false} stripedRows={true}>
                        {tableItems}
                    </TableBody>
                </Table>
        )
    }
}

let _sReport={
    carnum:'粤123456',
    alertType:'超速报警',
    createdAt:'2016-08-31 14:00:00',
    speed:'50',
    place:'新疆维吾尔自治区昌吉回族自治州吉木萨尔县，离五彩湾东方希望350米',
}
let _sReports=[];
for(let i=0;i<9;i++){
    _sReports.push(_sReport);
}
// let _sHeader=[
//     {'name':'carnum','key':'carnum'},
//     {'name':'alertType','key':'alertType'},
//     {'name':'createdAt','key':'createdAt'},
//     {'name':'speed','key':'speed'},
//     {'name':'place','key':'place'},
// ];
class SpeedPage extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            data:[],
            total:0,
            limit:10,
        };
        // this.keys=[];
    }
    componentDidMount(){
        // Wapi._iotAlert.list(res=>{
        //     let data=res.data;
        //     let d={
        //         lat:data.lat,
        //         lon:data.lon
        //     }
        //     Wapi.base.geocoder(place_data=>{
        //         sth;
        //     },d);
        //     this.setState({
        //         data:res.data,
        //         total:res.total
        //     });
        // },{
        //     uid:_user.customer.objectId,
        //     alertType:0x3002
        // });

        this.setState({
            data:_sReports,
            total:_sReports.length,
        });
        // this.keys=_sHeader.map(ele=>{
        //     return ({'name':ele.name,'key':ele.key});
        // });
    }
    render(){
        let tableItems = this.state.data.map((ele,index)=>
            <TableRow key={index}>
                <TableRowColumn style={{width:'15%'}}>{ele.carnum}</TableRowColumn>
                <TableRowColumn style={{width:'10%'}}>{ele.alertType}</TableRowColumn>
                <TableRowColumn style={{width:'20%'}}>{ele.createdAt}</TableRowColumn>
                <TableRowColumn style={{width:'10%'}}>{ele.speed}</TableRowColumn>
                <TableRowColumn style={{width:'45%'}}>{ele.place}</TableRowColumn>
            </TableRow>);
        return(
                <Table fixedHeader={true}>
                    <TableHeader style={{borderTop:'solid 1px #cccccc'}} displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn style={{width:'15%'}}>{___.carNum}</TableHeaderColumn>
                            <TableHeaderColumn style={{width:'10%'}}>{___.alert_type}</TableHeaderColumn>
                            <TableHeaderColumn style={{width:'20%'}}>{___.alert_time}</TableHeaderColumn>
                            <TableHeaderColumn style={{width:'10%'}}>{___.speed}</TableHeaderColumn>
                            <TableHeaderColumn style={{width:'45%'}}>{___.place}</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody style={{borderBottom:'solid 1px #cccccc'}} displayRowCheckbox={false} stripedRows={true}>
                        {tableItems}
                    </TableBody>
                </Table>
        )
    }
}