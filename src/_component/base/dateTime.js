import React, {Component} from 'react';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

const sty={
    w:{
        width:'50%'
    },
    f:{display: 'flex'},
    tf:{
        width:'100%'
    }
}

class DateTime extends Component {
    constructor(props, context) {
        super(props, context);

        this.value=props.value;
        this.value.setSeconds(0);
        this.value.setMilliseconds(0);

        this.dateChange = this.dateChange.bind(this);
        this.timeChange = this.timeChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.value=nextProps.value;
        this.value.setSeconds(0);
        this.value.setMilliseconds(0);
    }
    
    dateChange(e,val){
        if(this.value){
            this.value.setFullYear(val.getFullYear());
            this.value.setMonth(val.getMonth());
            this.value.setDate(val.getDate());
        }else
            this.value=val;
        this.props.onChange(this.value,this.props.name);
    }
    timeChange(e,val){
        if(this.value){
            this.value.setHours(val.getHours());
            this.value.setMinutes(val.getMinutes());
        }else
            this.value=val;
        this.props.onChange(this.value,this.props.name);
    }
    
    render() {
        return (
            <div {...this.props} onChange={null} style={Object.assign({},sty.f,this.props.style)} >
                <DatePicker 
                    style={sty.w} 
                    hintText={___.select_date} 
                    textFieldStyle={sty.tf} 
                    value={this.props.value} 
                    onChange={this.dateChange}
                />
                <TimePicker 
                    style={sty.w} 
                    hintText={___.select_time} 
                    format="24hr" 
                    textFieldStyle={sty.tf} 
                    value={this.props.value} 
                    onChange={this.timeChange}
                />
            </div>
        );
    }
}

export default DateTime;