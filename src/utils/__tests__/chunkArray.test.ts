import { chunkArray } from '../chunkArray';

describe('chunkArray', () => {
  it('chunks array into smaller arrays', () => {
    const result = chunkArray([1,2,3,4,5], 2);
    expect(result).toEqual([[1,2],[3,4],[5]]);
  });
});
