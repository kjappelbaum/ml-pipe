import { repeat } from '../../utils/array';
import { testables, getStratificationIndices } from '../trainTestSplit';

const { expectedFraction, uniqueValuesIndicesAndCounts } = testables;

describe('test expected fraction', () => {
  it('three 50/50 case', () => {
    // have three points and 50/50 split
    expect(expectedFraction(3, 2)).toBe(1);
  });
  it('two 50/50 case', () => {
    // have two points and 50/50 split
    expect(expectedFraction(2, 2)).toBe(1);
  });
});

describe('test unique valuesIndicesAndCounts', () => {
  it('constant array', () => {
    let { uniqueValues, indices, counts } = uniqueValuesIndicesAndCounts([
      1, 1, 1, 1,
    ]);
    expect(uniqueValues).toStrictEqual([1]);
    expect(indices).toStrictEqual([0, 0, 0, 0]);
    expect(counts).toStrictEqual({ 1: 4 });
  });

  it('two kinds array', () => {
    let { uniqueValues, indices, counts } = uniqueValuesIndicesAndCounts([
      1, 2, 1, 1,
    ]);
    expect(uniqueValues).toStrictEqual([1, 2]);
    expect(indices).toStrictEqual([0, 1, 0, 0]);
    expect(counts).toStrictEqual({ 1: 3, 2: 1 });
  });
});

describe('test stratification', () => {
  it('easy case, even split', () => {
    const { aIndices, bIndices } = getStratificationIndices([1, 1, 2, 2], 1);
    expect(aIndices).toHaveLength(bIndices.length);
  });

  it('easy case, uneven', () => {
    const array = repeat([1, 2], [50, 50]);
    const { aIndices, bIndices } = getStratificationIndices(array, 4);
    expect(aIndices.length).toBeLessThan(86);
    expect(aIndices.length).toBeGreaterThan(74);
    expect(bIndices.length + aIndices.length).toBe(array.length);
    let aSubset = array.filter((_, i) => aIndices.includes(i));
    let bSubset = array.filter((_, i) => bIndices.includes(i));
    let { counts: aUniqueCounts } = uniqueValuesIndicesAndCounts(aSubset);
    let { counts: bUniqueCounts } = uniqueValuesIndicesAndCounts(bSubset);
    let ratioDifference = Math.abs(
      Math.abs(1 - aUniqueCounts[1] / aUniqueCounts[2]) -
        Math.abs(1 - bUniqueCounts[1] / bUniqueCounts[2]),
    );
    expect(ratioDifference).toBeLessThan(0.25);
  });
});
