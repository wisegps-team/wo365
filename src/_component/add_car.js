import React, {Component} from 'react';

import DatePicker from 'material-ui/DatePicker';
import FlatButton from 'material-ui/FlatButton';
import DepartmentTree,{DepartmentSelcet} from'../_component/department_tree';

import CarBrand from '../_component/base/carBrand';
import Input from '../_component/base/input';


const styles={
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
            departId:0,
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
        this.cancel = this.cancel.bind(this);
    }

    componentDidMount(){
        this.setState({uid:_user.customer.objectId});
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
    changeDepartment(e){
        this.setState({departId:e.id});
    }
    submit(){
        if(this.state.name==''){
            alert(___.carNum+' '+___.not_null);
            return;
        }
        if(this.state.brand==''){
            alert(___.brand+' '+___.not_null);
            return;
        }
        if(this.state.frameNo==''){
            alert(___.frame_no+' '+___.not_null);
            return;
        }
        if(this.state.engineNo==''){
            alert(___.engine_no+' '+___.not_null);
            return;
        }
        if(this.state.buyDate==''){
            alert(___.buy_date+' '+___.not_null);
            return;
        }
        if(this.state.mileage==''){
            alert(___.mileage+' '+___.not_null);
            return;
        }
        if(this.state.maintainMileage==''){
            alert(___.maintain_mileage+' '+___.not_null);
            return;
        }
        if(this.state.insuranceExpireIn==''){
            alert(___.insurance_expire+' '+___.not_null);
            return;
        }
        if(this.state.inspectExpireIn==''){
            alert(___.inspect_expireIn+' '+___.not_null);
            return;
        }
        this.addData(this.state);
    }
    cancel(){
        this.props.cancel();
    }
    addData(data){
        Wapi.vehicle.add(res=>{
            this.setState({//添加成功后重置state里面的内容
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
            });
            this.props.success(data);
        },data);
    }
    render(){
        return(
            <div style={this.props.style||{paddingTop:'0px'}}>
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
                        okLabel={___.ok}
                        cancelLabel={___.cancel}
                    />
                    <Input floatingLabelText={___.mileage} id='mileage' onChange={this.changeMileage} value={this.state.mileage} />
                    <Input floatingLabelText={___.maintain_mileage} id='maintainMileage' onChange={this.changeMaintainMileage} value={this.state.maintainMileage} />
                    <DatePicker 
                        id='insuranceExpireIn' 
                        floatingLabelText={___.insurance_expire}
                        hintText={___.please_pick_date}
                        onChange={this.changeInsuranceExpiry}
                        okLabel={___.ok}
                        cancelLabel={___.cancel}
                    />
                    <DatePicker 
                        id='inspectExpireIn' 
                        floatingLabelText={___.inspect_expireIn}
                        hintText={___.please_pick_date}
                        onChange={this.changeCheckExpiry}
                        okLabel={___.ok}
                        cancelLabel={___.cancel}
                    />
                    <p style={{fontSize:'0.75em', color:'rgba(0, 0, 0, 0.498039)'}}>{___.car_depart}</p>
                    <DepartmentSelcet value={this.state.departId}  onChange={this.changeDepartment}/>
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
        )
    }
}

export default AddCar;