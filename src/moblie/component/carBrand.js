import carBrandAction from '../../_component/base/carBrand/action';

const act=new carBrandAction();
const thisView=window.LAUNCHER.getView();//获取view
thisView.addEventListener('load',function(){
    act.emitLoad(thisView.id);
});