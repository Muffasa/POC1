angular.module("converters",[])

.factory('PhoneNumberFormater',function($rootScope,Countries){ 
        
         return{
          format: function(phone_number)
          {
            console.log("try to format this number:" + phone_number);
            var result = phone_number;
            var fullNumber;
            var shortNumber;
            var prefix=Countries.getPrefixByName($rootScope.MainUser.country);

            if(phone_number.charAt(0)=='0'){

                if(phone_number.charAt(1)=='0')//number with 00 insted of "+" prefix
                    result = "+"+phone_number.slice(2,phone_number.lenght);

                else// number number without prefix
                   prefix = Countries.getPrefixByName($rootScope.MainUser.country);

            }


            result.replace(new RegExp("-", "gi"),"");
            result.trim();

            if(result.charAt(0)=='+'){


              
              result = result.slice(0,prefix.lenght);

              if(result.charAt(0)!='0')
                result='0'+result;

              return prefix+"-"+result;

              
            }

            else{
               return prefix+"-"+result;
            }

            

          }
         }
    })