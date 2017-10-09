const is = (origin, checkType) => {
  const varType = Object.prototype.toString.call(origin).slice(8, -1).toLowerCase();
  return checkType ? varType === checkType : varType;
};

export default is;
