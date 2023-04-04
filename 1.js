const body =
  '{"first_name":"Ho\\u00e0ng","last_name":"V\\u0169","profile_pic":"https:\\/\\/scontent-sin6-1.xx.fbcdn.net\\/v\\/t1.30497-1\\/84628273_176159830277856_972693363922829312_n.jpg?stp=dst-jpg_p720x720&_nc_cat=1&ccb=1-7&_nc_sid=12b3be&_nc_ohc=GCswlcCrBvYAX_-1uTI&_nc_ht=scontent-sin6-1.xx&edm=AP4hL3IEAAAA&oh=00_AfANHk3XH1XAqU3zjDQPG5RyI2qRpBOE-BMRZJxbRpiF5g&oe=64530799","locale":"vi_VN","timezone":7,"gender":"male","id":"6297586176927503"}';

const bodyObj = JSON.parse(body);

console.log(bodyObj.first_name);
