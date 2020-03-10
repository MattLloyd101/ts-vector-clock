import VectorClock from '../src/VectorClock';
import { twoPermutations,
  equalsTrueCases,
  equalsFalseCases,
  lessThanOrEqualToTrueCases,
  lessThanOrEqualToFalseCases,
  causallyRelatedTrueCases,
  causallyRelatedFalseCases,
  concurrentTrueCases,
  concurrentFalseCases,
} from './fixtures/VectorClock.fixtures';

describe('vector-clock', () => {
  it('initalise correctly', () => {
    const clock = new VectorClock(0);
    expect(clock).not.toBeNull();
    expect(clock.vector).toEqual([]);
    expect(clock.memberIndex).toEqual(0);
  });

  it('initalise correctly', () => {
    const clock = new VectorClock(2, [1, 2, 3]);
    expect(clock).not.toBeNull();
    expect(clock.vector).toEqual([1, 2, 3]);
    expect(clock.memberIndex).toEqual(2);
  });

  describe('incrementing', () => {
    it('increments', () => {
      const clock = new VectorClock(0);

      const updatedClock = clock.increment();

      expect(updatedClock).toEqual(new VectorClock(0, [1]));
    });

    it('increments non 0 indexes', () => {
      const clock = new VectorClock(2, [1, 2, 3]);

      const updatedClock = clock.increment();

      expect(updatedClock).toEqual(new VectorClock(2, [1, 2, 4]));
    });
  });

  describe('updating', () => {
    it.each(twoPermutations)('merges (%o, %o) correctly', (v1, v2, expected) => {
      const clock1 = new VectorClock(0, v1);
      const clock2 = new VectorClock(1, v2);

      const updatedClock = clock1.update(clock2);

      expect(updatedClock).toEqual(new VectorClock(0, expected))
    });
  });

  describe('equalTo', () => {
    it.each(equalsTrueCases)('%o is equal to %o', (clock1, clock2) => {
      const actual = VectorClock.equalTo(clock1, clock2);
      expect(actual).toBeTruthy();

      const actual2 = clock1.equalTo(clock2);
      expect(actual2).toBeTruthy();
    });
    it.each(equalsFalseCases)('%o is NOT equal to %o', (clock1, clock2) => {
      const actual = VectorClock.equalTo(clock1, clock2);
      expect(actual).not.toBeTruthy();

      const actual2 = clock1.equalTo(clock2);
      expect(actual2).not.toBeTruthy();
    });
  });

  describe('lessThanOrEqualTo', () => {
    it.each(lessThanOrEqualToTrueCases)('%o is less than or equal to %o', (clock1, clock2) => {
      const actual = VectorClock.lessThanOrEqualTo(clock1, clock2);
      expect(actual).toBeTruthy();

      const actual2 = clock1.lessThanOrEqualTo(clock2);
      expect(actual2).toBeTruthy();
    });

    it.each(lessThanOrEqualToFalseCases)('%o is NOT less than or equal to %o', (clock1, clock2) => {
      const actual = VectorClock.lessThanOrEqualTo(clock1, clock2);
      expect(actual).not.toBeTruthy();

      const actual2 = clock1.lessThanOrEqualTo(clock2);
      expect(actual2).not.toBeTruthy();
    });
  });

  describe('causallyRelatedTo', () => {
    it.each(causallyRelatedTrueCases)('%o is causally related to %o', (clock1, clock2) => {
      const actual = VectorClock.causallyRelatedTo(clock1, clock2);
      expect(actual).toBeTruthy();

      const actual2 = clock1.causallyRelatedTo(clock2);
      expect(actual2).toBeTruthy();
    });

    it.each(causallyRelatedFalseCases)('%o is NOT causally related to %o', (clock1, clock2) => {
      const actual = VectorClock.causallyRelatedTo(clock1, clock2);
      expect(actual).not.toBeTruthy();

      const actual2 = clock1.causallyRelatedTo(clock2);
      expect(actual2).not.toBeTruthy();
    });
  });

  describe('lessThan', () => {
    it.each(causallyRelatedTrueCases)('%o is lessThan to %o', (clock1, clock2) => {
      const actual = VectorClock.lessThan(clock1, clock2);
      expect(actual).toBeTruthy();

      const actual2 = clock1.lessThan(clock2);
      expect(actual2).toBeTruthy();
    });

    it.each(causallyRelatedFalseCases)('%o is NOT lessThan to %o', (clock1, clock2) => {
      const actual = VectorClock.lessThan(clock1, clock2);
      expect(actual).not.toBeTruthy();

      const actual2 = clock1.lessThan(clock2);
      expect(actual2).not.toBeTruthy();
    });
  });

  describe('concurrentWith', () => {
    it.each(concurrentTrueCases)('%o is concurrent with %o', (clock1, clock2) => {
      const actual = VectorClock.concurrentWith(clock1, clock2);
      expect(actual).toBeTruthy();

      const actual2 = clock1.concurrentWith(clock2);
      expect(actual2).toBeTruthy();
    });
    it.each(concurrentFalseCases)('%o is NOT concurrent with %o', (clock1, clock2) => {
      const actual = VectorClock.concurrentWith(clock1, clock2);
      expect(actual).not.toBeTruthy();

      const actual2 = clock1.concurrentWith(clock2);
      expect(actual2).not.toBeTruthy();
    });
  });

  describe('component test', () => {
    it('should work in this scenario', () => {
      const p1 = new VectorClock(0, [0, 0, 0]);
      const p2 = new VectorClock(1, [0, 0, 0]);
      const p3 = new VectorClock(2, [0, 0, 0]);

      const a = p1.increment();
      const h = p3.increment();
      const e = p2.update(h);
      const b = a.increment();
      const c = b.increment();
      const f = e.update(b);
      const i = h.increment();
      const g = f.increment();
      const d = c.update(g);
      const e2 = d.increment();
      const j = i.update(e2);

      expect(a).toEqual(new VectorClock(0, [1, 0, 0]));
      expect(h).toEqual(new VectorClock(2, [0, 0, 1]));
      expect(e).toEqual(new VectorClock(1, [0, 1, 1]));
      expect(b).toEqual(new VectorClock(0, [2, 0, 0]));
      expect(c).toEqual(new VectorClock(0, [3, 0, 0]));
      expect(f).toEqual(new VectorClock(1, [2, 2, 1]));
      expect(i).toEqual(new VectorClock(2, [0, 0, 2]));
      expect(g).toEqual(new VectorClock(1, [2, 3, 1]));
      expect(d).toEqual(new VectorClock(0, [4, 3, 1]));
      expect(e2).toEqual(new VectorClock(0, [5, 3, 1]));
      expect(j).toEqual(new VectorClock(2, [5, 3, 3]));
    });
  });
  
  describe('compare', () => {
    it('sorts arrays based on basic increment ordering', () => {
      const a = new VectorClock(0, [0]);
      const b = a.increment();
      const c = b.increment();
      
      const actual = [c, b, a]
      actual.sort(VectorClock.compare);
      
      expect(actual).toEqual([a, b, c]);
    });
    
    it('Identival vector clocks are sorted by their memberIndex.', () => {
      const a = new VectorClock(0, [0, 0]);
      const b = new VectorClock(1, [0, 0]);
      
      const actual = [b, a];
      actual.sort(VectorClock.compare);
      
      expect(actual).toEqual([a, b]);
    });
    
    it('sorts clocks across multiple members', () => {
      const a = new VectorClock(0, [0, 0]);
      const b = new VectorClock(1, [0, 0]);
      const c = a.increment();
      const d = b.update(c);
      const e = d.increment();
      
      const actual = [c, d, e, b, a];
      actual.sort(VectorClock.compare);
      
      expect(actual).toEqual([a, b, c, d, e]);
    });
    
  });
});
