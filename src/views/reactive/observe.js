import Observer from './Observer';

export default function observe(value) {
  if (typeof value !== 'object') {
    return;
  }
  let ob = null;

  if (typeof value.__ob__ === 'undefined') {
    ob = new Observer(value);
  } else {
    /* 这种是什么情况下产生的？ */
    ob = value.__ob__;
  }
  return ob;
}
