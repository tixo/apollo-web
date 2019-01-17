define(function(require, exports, module) {
	function initKeyPersonnel(sceneEvent,setting) { 
		keyPersonnelParam.sceneEvent = sceneEvent;
		keyPersonnelParam.setting = setting;
	}
	function ztreeKeyPersonnel(){
 		var config={
			dataName:"HTC02:重点人员",
			sql:"",
			url:services.queryUrl,
			successCallback:onQueryArea,
			failCallback:processFailed
		};
        keyPersonnelParam.sceneEvent.supermap3DUtils.query3DUtil.getSqlBydata(config);
        //查询成功返回结果函数			
		function onQueryArea(queryEventArgs){
			//每一条数据是一条子项
			var selectedFeatures = queryEventArgs.result.features;
			var treeNodes = getNode(selectedFeatures);
			keyPersonnelParam.setting.check.enable=true;
			$.fn.zTree.init($("#zTreeKeyPersonnel"), keyPersonnelParam.setting,treeNodes );
	    }
 	}
	function processFailed(e){
		console.log(e);
	}
	function getNode(selectedFeatures){
		var orgArray =[],newOrg=[];
		$.each(selectedFeatures, function(i,item) {
			item = item.attributes;
			var org = [];
			org.push(item.ORG);
			orgArray = orgArray.concat(org);
			orgArray = unique(orgArray);
		});
		$.each(orgArray, function(i,name) {
			var childrenArray = [];
			$.each(selectedFeatures, function(j,obj) {
				obj = obj.attributes;
				if(name==obj.ORG){
					obj.name = obj.NAME;
					obj.icon = "../../config/common/rightResource/img/key-person.png";
					childrenArray.push(obj);
				}
			});
			var newOrgObj =  {"id":i+1,"name":name,"open":true}; 
			newOrgObj.children = childrenArray;
			newOrg.push(newOrgObj);
		});
		var treeNodes = {"id":"parent1","pid":"0","name":"航天分局","open":true};
		treeNodes.children = newOrg;
	return treeNodes;
}
	var unique = function(elems) {
		 for (var i = 0; i < elems.length; ++i) {  
                for (var j = i + 1; j < elems.length; ++j) {  
                    if (elems[i] === elems[j]) {  
                        elems.splice(i--, 1);  
                        break;  
                    }  
                }  
            }  
            return elems;  
		};
	var keyPersonnelParam = {
		sceneEvent :{},
		setting:{}
	};
	var keyPersonnel = {
		initKeyPersonnel:initKeyPersonnel,
		ztreeKeyPersonnel:ztreeKeyPersonnel
	};
	module.exports = keyPersonnel;
});