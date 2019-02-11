//给对象原型添加equals方法，判断两个对象是否相等
export function ObjectEquals (object1,object2) {
  for (let propName in object1) {
      if (object1.hasOwnProperty(propName) !== object2.hasOwnProperty(propName)) {
          return false;
      }
      else if (typeof object1[propName] !== typeof object2[propName]) {
          return false;
      }
  }
  for(let propName in object2) {
      if (object1.hasOwnProperty(propName) !== object2.hasOwnProperty(propName)) {
          return false;
      }
      else if (typeof object1[propName] !== typeof object2[propName]) {
          return false;
      }
      if(!object1.hasOwnProperty(propName))
        continue;

      if (object1[propName] instanceof Array && object2[propName] instanceof Array) {
         if (!ObjectEquals(object1[propName],object2[propName]))
                    return false;
      }
      else if (object1[propName] instanceof Object && object2[propName] instanceof Object) {
         if (!ObjectEquals(object1[propName],object2[propName]))
                      return false;
      }
      else if(object1[propName] !== object2[propName]) {
         return false;
      }
  }
  return true;
}