
// Hàm validator
function Validator(options){
      function getParent(element,selector){
            while(element.parentElement){
                  if(element.parentElement.matches(selector)){
                        return element.parentElement
                  }
                  element = element.parentElement;
            }
      }

      var selectorRules = {};

      //ham thuc hien validate
      function validate (inputElement,rule){
            var erroMessage;
            var errorElement = 
            getParent(inputElement, options.formGroupSelector).querySelector(options.erroMessage)         
            // lấy ra các rules của selector
            var rules = selectorRules[rule.selector];
            // lặp qua từng rule
            for (var i = 0; i < rules.length; ++i){
                  switch (inputElement.type){
                        case 'checkbox':
                        case 'radio':
                              erroMessage = rules[i](
                                    formElement.querySelector(rule.selector + ':checked')
                              )
                              break;
                        default:
                        erroMessage = rules[i](inputElement.value);
                  }
                 
                  if(erroMessage) break;
            }
            if(erroMessage){
               errorElement.innerText = erroMessage;
               getParent(inputElement, options.formGroupSelector).classList.add('invalid')
            }else{
               errorElement.innerText = '';
               getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
            }
            return !erroMessage;
      }

      //lay element cua form can validate
    var formElement = document.querySelector(options.form);
    if(formElement){
      formElement.onsubmit = function(e){
            // bỏ hành vi mặc định khi submit
            e.preventDefault(); 

            var isFormValid = true;
            // thực hiện lặp qua từng rule và validate hết
            options.rules.forEach(function(rule){
                  var inputElement  = formElement.querySelector(rule.selector)
                  var isValid = validate(inputElement,rule);
                  if(!isValid){
                        isFormValid = false;
                  }
            });
            
            if (isFormValid){
                  // submit form theo js
                  if(typeof options.onsubmit === 'function'){
                        var enableInputs = formElement.querySelectorAll('[name]')
                        var formValues = Array.from(enableInputs).reduce(function(values, input){
                              

                              switch(input.type){
                                    case 'checkbox':
                                          if(!values[input.name]) {
                                                values[input.name] = []
                                            }
                                          if(input.matches(':checked')) {
                                                values[input.name].push(input.value)
                                            }
                                          break;
                                    case 'radio':
                                          // values[input.name] = formElement.querySelector('input[name="'+input.name + '"]:checked').value;
                                          if(!values[input.name]) {
                                                values[input.name] = ''
                                            }
                                            if(input.matches(':checked')) {
                                                values[input.name] = input.value
                                            }
                                          break;
                                    case 'file':
                                          values[input.name] = (input.files);
                                          break;

                                    default:
                                          values[input.name] = input.value
                              }
                              return values;
                        },{});
                        options.onsubmit(formValues);
                        
                  }
                  // submit form với hành vi mặc định
                  else{
                        formElement.submit();
                  }
              
                
            }
      }

      // xử lý lặp qa mỗi rule và xử lý ...
      options.rules.forEach(function(rule){

            //  lưu lại rules cho mỗi input
            if(Array.isArray(selectorRules[rule.selector])){
                  selectorRules[rule.selector].push(rule.test);
            }else{
                  selectorRules[rule.selector] = [rule.test]
            }
           

            var inputElements = formElement.querySelectorAll(rule.selector);

            Array.from(inputElements).forEach(function(inputElement){
                        //xử lý blur khỏi input
                        inputElement.onblur = function(){
                              //value: inputElement.value
                              //test func: rule.test
                           validate(inputElement,rule);
                        }
                        // xử lý mỗi khi user nhập vào input
                        inputElement.oninput = function(){
                              var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.erroMessage)         
                              errorElement.innerText = '';
                              getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
                        }
            })
          
      });
     
    }
}

// Định nghĩa rules
//nguyên tắc của rules:
//1. khi có lỗi thì trả ra messega lỗi
//2. khi ko lỗi thì ko trả ra gì(undefined)
Validator.isRequired = function(selector){
      return {
            selector:selector,
            test:function(value){
                  return value? undefined :'Vui lòng nhập trường này !'
            }
      }
}

Validator.isEmail = function(selector){
  return {
            selector:selector,
            test:function(value){
                  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                  return regex.test(value) ? undefined : 'Trường này phải là Email !'
            }
      }
}  

Validator.minLength = function(selector,min){
      return {
                selector:selector,
                test:function(value){
                    
                      return value.length >= min? undefined : `Vui lòng nhập tối thiểu ${min} ký tự !`
                }
          }
    }  

Validator.isConfirm = function(selector, getConfirm,message) {
      return {
                selector:selector,
                test:function(value){
                      return value === getConfirm()? undefined :message || 'Giá trị nhập vào không khớp, Vui lòng nhập lại!'
                }
          }
    }  