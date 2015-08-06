angular.module("MTPOC")



.filter('testfilter',function(){
    return function(text){
        if(parseInt(text)<10)
            return "0"+text;
        else return text;
        
    }
})