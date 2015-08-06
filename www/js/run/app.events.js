angular.module("MTPOC")

.run(function($rootScope,$state,$ionicPlatform,$firebaseObject,$firebaseArray,ConversationF){
		$ionicPlatform.ready(function() {
          
			if(!$rootScope.binds)
			$rootScope.binds={};

           $rootScope.$on('convManagerSet',function(){
		              

		              var unWatch = $rootScope.binds.convManager.$watch(function(e){

		              	if(e.event=="child_changed"){
		              		var callStatus=$rootScope.MainUserBinding.convManager.status;
		              		if(e.key=="status"){
		              			
		                        if(callStatus=="idle"){
		                             console.log("user convManager is idle");
		                        }
		                        if(callStatus=="connecting"){
		                        	console.log("peer user connected to this convManager, starting incoming call protocol");
		                        	$rootScope.callType="incoming";		                        	
		                        	$state.go("app.live-connection");
		                        	//$rootScope.$broadcast('incomingCall',$rootScope.MainUser.convManager.peerCaller);
		                        }
		                        if(callStatus=="ongoing"){
		                        	console.log("you answered and changed the status to ongoing");
		                        }
		                        if(callStatus=="canceled"){
		                        	console.log("peer user canceled the call and changed the status to canceled");
		                        	$rootScope.$broadcast('incomingCall:canceled');
		                        	
		                        }
		                        if(callStatus=="rejected"){
		                        	console.log("you rejected the incoming call");
		                        }
		                        if(callStatus=="ended"){
		                        	console.log("converstion over, going to home view");
		                        	$rootScope.$broadcast('connection-ended');
		                        	
		                        	//$state.go("app.allUsers");
		                        }

		              		}

		              	}
		              });
            });

            $rootScope.$on("outgoingCall",function(event,peer_user_id){
            	if(peer_user_id!=$rootScope.peerUser.uid){
            		console.log("error, no peer user after outgoingcall");
            	}	
            	else{
            		$rootScope.callType="outgoing";
            		        $state.go("app.live-connection");
            		              var unWatch = $rootScope.binds.peerConvManager.$watch(function(e){

					              	if(e.event=="child_changed"){
					              		
					              		if(e.key=="status"){
							              			var callStatus=$rootScope.peerUser.convManager.status;

							              			if(callStatus!=$rootScope.lastStatus)
							              			{
							              			
									                        if(callStatus=="idle"){
									                             console.log("peer user convManager status is idle,impossible.");
									                            // $rootScope.$broadcast('connection-ended');
									                             //$rootScope.binds.peerConvManager.$destroy();
									                        }
									                        if(callStatus=="connecting"){
									                        	console.log("peer user convManager status is connecting, default state when connecting to remote convManager");
									                        }
									                        if(callStatus=="ongoing"){
									                        	console.log("peer user answered and changed convManager status to ongoing.");
									                        	$rootScope.$broadcast("outgoingCall:answered");
									                        }
									                        if(callStatus=="rejected"){
									                        	console.log("peer user rejected the incoming call, remote convManager status is rejected.");
									                        	$rootScope.$broadcast("outgoingCall:rejected");
									                        	//$rootScope.$broadcast('connection-ended');
									                        }
									                        if(callStatus=="ended"){
									                        	console.log("peer user remote convManager status is ended, unmounting...");
									                        	$rootScope.binds.peerConvManager.$destroy();
									                        	//unWatch();
									                        	
									                        	
									                        	$rootScope.$broadcast('connection-ended');


									                        }
							                    }

					              		}

					              	}
					              	$rootScope.lastStatus=callStatus;
					              })
					}              	
            })
            
              
              
           


		   
	})

})