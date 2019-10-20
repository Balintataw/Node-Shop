// ex =>  "user-16a4f83e-43d7-4000-8ac0-7f28010fb000"
module.exports = createProductUID = () => {
  var r = (new Date()).getTime().toString(16) + 
      Math.random().toString(16).substring(2) + "0".repeat(16);
  return 'product-' + r.substr(0,8) + '-' + r.substr(8,4) + '-4000-8' + 
      r.substr(12,3) + '-' + r.substr(15,12);
};