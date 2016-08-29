import {Redux,createStore,applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';

import customerReducer from './customer';
import dictionaryReducer from './dictionary';
import {carsReducer,showCarsReducer,selectCarReducer} from './monitor';

const initialState = {
    custType:[],//用户类型字典
    brand:[],//品牌类型字典
    cars:[],
    show_cars:[],
    select_car:0
};

function main(state = initialState, action) {
    return {
        custType:dictionaryReducer(state.custType,action,'custType'),
        brand:dictionaryReducer(state.brand,action,'brand'),
        cars:carsReducer(state.cars,action),
        show_cars:showCarsReducer(state.show_cars,action),
        select_car:selectCarReducer(state.select_car,action),
    };
}





let STORE=createStore(
    main,
    applyMiddleware(//应用中间件，为了可以使用异步action
        thunkMiddleware //为了可以使用异步action
    )
);

window.STORE=STORE;



export default STORE;