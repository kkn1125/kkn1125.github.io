'use strict';

function User(uuid, isNew){
    this.uuid = uuid;
    this.isNew = isNew;
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {
  console.log(options.expires)
    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }
  
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  
    for (let optionKey in options) {
      updatedCookie += "; " + optionKey;
      let optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
      }
    }
    console.log(updatedCookie)
    document.cookie = updatedCookie;
}

function deleteCookie(name) {
    setCookie(name, "", {
      'max-age': -1
    })
}

function UUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

// setCookie('user', 'John', {secure: true, 'max-age': 3600});
// window.addEventListener('load',function(){
//   let date = new Date();
//   let newdate = new Date(date.getTime() + 9*60*60*1000 + 10*1000);

//   if(getCookie('user')==undefined){
//     let user = new User(UUID(), true);
//     setCookie('user', user.uuid, {
//         path:'/',
//         expires: newdate
//     });
//   }
// });