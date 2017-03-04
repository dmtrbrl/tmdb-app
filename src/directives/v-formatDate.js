let setValue = function(el, binding) {
  let value = binding.value;
  let dateArray = value.split('-');
  let monthsArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  el.innerText =  `${dateArray[2]} ${monthsArray[+dateArray[1] - 1]} ${dateArray[0]}`;
};
module.exports = {
  isLiteral: true,
  bind(el, binding) {
    setValue(el, binding);
  },
  update(el, binding) {
    setValue(el, binding);
  }
}
