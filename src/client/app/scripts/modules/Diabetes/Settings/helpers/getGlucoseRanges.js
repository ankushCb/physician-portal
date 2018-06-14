export default (target, factor, emergency, maxRange = 5) => {
  // console.log(target, factor, emergency, maxRange);
  const ranges = [];
  let max = target;
  let min;
  do {
    min = max;
    max += factor;
    if (ranges.length === maxRange) {
      ranges.push({ min, max: emergency });
      break;
    }
    if (max <= emergency) {
      ranges.push({ min, max });
    }
  } while (max < emergency);
  // console.log('ranges ', ranges);
  return ranges;
};
