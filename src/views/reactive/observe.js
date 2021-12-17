import Observer from './Observer';

export default function observe(value) {
  if (typeof value !== 'object') {
    return;
  }
  let ob = null;

  if (typeof value.__ob__ === 'undefined') {
    ob = new Observer(value);
  } else {
    ob = value.__ob__;
  }
  return ob;
}
