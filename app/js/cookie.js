cookie = (function () {

  return {
    // Creates a cookie for user from params
    // @param name [String] The name of the cookie
    // @param value [Integer / String] The value saved for the cookie
    // @param days [Integer] The number of days until the cookie expires
    create : function (name, value, days) {
      var expires = '',
          date = new Date();

      if (days) {
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = '; expires='+date.toGMTString();
      }

      document.cookie = name+'='+value+expires+''+'; path=/';
    },

    // Reads cookie passed back in params
    // @param name [String] The name of the cookie
    read : function (name) {
      var nameEqual = name + '=',
          cArray = document.cookie.split(';'),
          i = 0,
          cArrayLeng = cArray.length,
          cookieName = '';

      for (i; i < cArrayLeng; i++) {
        cookieName = cArray[i];

        while (cookieName.charAt(0) === ' ') {
          cookieName = cookieName.substring(1, cookieName.length);
        }

        if (cookieName.indexOf(nameEqual) === 0) {
          return cookieName.substring(nameEqual.length, cookieName.length);
        }
      }
      return null;
    }
  }

}) ();