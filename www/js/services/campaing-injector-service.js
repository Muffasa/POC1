angular.module("MTPOC")

.factory("CampaignInjector",function($q,$http){

      return{
      	getCampaignByUser:function(user){
      		var d = $q.defer();
      		          $http.get('http://188.226.198.99:3000/CampaignSlector/'+user.uid)
                     .success(function(cid){
                        d.resolve(cid);
                      },function(error){
                        d.reject(error);
                      });
      		return d.promise;
      	}
      }

})