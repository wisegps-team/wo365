import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {Provider,connect} from 'react-redux';

import {ThemeProvider} from '../_theme/default';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

import CarBrand from '../_component/base/carBrand';
import Input from '../_component/base/input';


const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<AddCar/>,thisView);
});


const styles={
    main:{width:'100%',paddingLeft:'25px',paddingRight:'25px'},
    iconStyle:{marginRight: '12px'},
    bottomBtn:{width:'100%',display:'block',textAlign:'right',padding:'10px'},
}

class AddCar extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            name:'',
            uid:'',
            brand:'',
            brandId:'',
            model:'',
            modelId:'',
            type:'',
            typeId:'',
            frameNo:'',
            engineNo:'',
            buyDate:'',
            mileage:'',
            maintainMileage:'',
            insuranceExpireIn:'',
            inspectExpireIn:'',
            departId:1,
        }
        this.changeNum=this.changeNum.bind(this);
        this.changeBrand=this.changeBrand.bind(this);
        this.changeFrame=this.changeFrame.bind(this);
        this.changeEngine=this.changeEngine.bind(this);
        this.changeBuyDate=this.changeBuyDate.bind(this);
        this.changeMileage=this.changeMileage.bind(this);
        this.changeMaintainMileage=this.changeMaintainMileage.bind(this);
        this.changeInsuranceExpiry=this.changeInsuranceExpiry.bind(this);
        this.changeCheckExpiry=this.changeCheckExpiry.bind(this);
        this.changeDepartment=this.changeDepartment.bind(this);

        this.submit=this.submit.bind(this);
    }
    getChildContext() {
        return {
            view:thisView
        };
    }
    componentDidMount(){
        this.setState({uid:_user.uid});
    }
    changeNum(e,name){
        this.setState({name:name});
    }
    changeBrand(data){
        let brand=data.brand;
        let brandId=data.brandId;
        let serie=data.serie;
        let serieId=data.serieId;
        let type=data.type;
        let typeId=data.typeId;
        this.setState({
            brand:brand,
            brandId:brandId,
            model:serie,
            modelId:serieId,
            type:type,
            typeId:typeId,
        });
    }
    changeFrame(e,frameNo){
        this.setState({frameNo:frameNo});
    }
    changeEngine(e,engineNo){
        this.setState({engineNo:engineNo});
    }
    changeBuyDate(e,date){
        date=W.dateToString(date).slice(0,10);
        this.setState({buyDate:date});
    }
    changeMileage(e,mileage){
        this.setState({mileage:mileage});
    }
    changeMaintainMileage(e,maintainMileage){
        this.setState({maintainMileage:maintainMileage});
    }
    changeInsuranceExpiry(e,date){
        date=W.dateToString(date).slice(0,10);
        this.setState({insuranceExpireIn:date});
    }
    changeCheckExpiry(e,date){
        date=W.dateToString(date).slice(0,10);
        this.setState({inspectExpireIn:date});
    }
    changeDepartment(e,departId){
        this.setState({departId:departId});
    }
    submit(){
        if(this.state.name==''){
            alert('车牌号 不能为空');
            return;
        }
        if(this.state.brand==''){
            alert('车辆型号 不能为空');
            return;
        }
        if(this.state.frameNo==''){
            alert('车架号 不能为空');
            return;
        }
        if(this.state.engineNo==''){
            alert('发动机号 不能为空');
            return;
        }
        if(this.state.buyDate==''){
            alert('购置日期 不能为空');
            return;
        }
        if(this.state.mileage==''){
            alert('行驶里程 不能为空');
            return;
        }
        if(this.state.maintainMileage==''){
            alert('下次保养里程 不能为空');
            return;
        }
        if(this.state.insuranceExpireIn==''){
            alert('保险到期日 不能为空');
            return;
        }
        if(this.state.inspectExpireIn==''){
            alert('年检到期日 不能为空');
            return;
        }
        this.addData(this.state);
    }
    cancel(){
        history.back();
    }
    addData(data){
        Wapi.vehicle.add(res=>{
            history.back();
        },data);
    }
    render(){
        return(
            <ThemeProvider>
            <div>
                <AppBar
                    title={___.add_car}
                    iconElementLeft={<IconButton onClick={this.cancel}><NavigationArrowBack/></IconButton>}
                />
                <div style={{paddingLeft:'1.5em',paddingRight:'1.5em'}} >
                    <Input floatingLabelText={___.carNum} id='name' onChange={this.changeNum} value={this.state.name} />
                    <CarBrand id='carBrand' onChange={res=>this.changeBrand(res)}/>
                    <Input floatingLabelText={___.frame_no} id='frameNo' onChange={this.changeFrame} value={this.state.frameNo} />
                    <Input floatingLabelText={___.engine_no} id='engineNo' onChange={this.changeEngine} value={this.state.engineNo} />
                    <DatePicker 
                        id='buyDate'  
                        floatingLabelText={___.buy_date}
                        hintText={___.please_pick_date}
                        onChange={this.changeBuyDate}
                    />
                    <Input floatingLabelText={___.mileage} id='mileage' onChange={this.changeMileage} value={this.state.mileage} />
                    <Input floatingLabelText={___.maintain_mileage} id='maintainMileage' onChange={this.changeMaintainMileage} value={this.state.maintainMileage} />
                    <DatePicker 
                        id='insuranceExpireIn' 
                        floatingLabelText={___.insurance_expire}
                        hintText={___.please_pick_date}
                        onChange={this.changeInsuranceExpiry}
                    />
                    <DatePicker 
                        id='inspectExpireIn' 
                        floatingLabelText={___.inspect_expireIn}
                        hintText={___.please_pick_date}
                        onChange={this.changeCheckExpiry}
                    />
                    <SelectField id='departId' floatingLabelText={___.car_depart} value={this.state.departId} onChange={this.changeDepartment}>
                        <MenuItem key={0} value={0} primaryText="department0" />
                        <MenuItem key={1} value={1} primaryText="department1" />
                        <MenuItem key={2} value={2} primaryText="department2" />
                        <MenuItem key={3} value={3} primaryText="department3" />
                        <MenuItem key={4} value={4} primaryText="department4" />
                    </SelectField>
                </div>
                <div style={styles.bottomBtn}>
                    <FlatButton
                        label={___.cancel}
                        primary={true}
                        onTouchTap={this.cancel}
                    />
                    <FlatButton
                        label={___.ok}
                        primary={true}
                        onTouchTap={this.submit}
                    />
                </div>
            </div>
            </ThemeProvider>
        )
    }
}
AddCar.childContextTypes = {
    view: React.PropTypes.object
};
