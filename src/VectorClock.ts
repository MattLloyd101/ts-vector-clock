export type VectorIndex = number;
export type Version = number;
export default class VectorClock {
    readonly memberIndex: VectorIndex;
    readonly vector: Array<Version>;

    constructor(memberIndex: VectorIndex, vector: Array<Version> = []) {
        this.memberIndex = memberIndex;
        this.vector = vector;
    }

    get(index: VectorIndex): Version {
        return this.vector[index];
    }

    increment(): VectorClock {
        return this.updateIndex(this.memberIndex, (this.get(this.memberIndex) ?? 0) + 1);
    }

    updateIndex(index: VectorIndex, version: Version): VectorClock {
        const newVector = this.vector.concat([]);
        newVector[index] = version;
        return new VectorClock(this.memberIndex, newVector);
    }

    update(clock: VectorClock): VectorClock {
        const updated = this.increment();
        const mergedVector = updated.vector.map((v1, i) => {
            const v2 = clock.get(i);
            return Math.max(v1, v2);
        });
        return new VectorClock(this.memberIndex, mergedVector);
    }

    equalTo(clock: VectorClock): boolean {
        return VectorClock.equalTo(this, clock);
    }

    lessThanOrEqualTo(clock: VectorClock): boolean {
        return VectorClock.lessThanOrEqualTo(this, clock);
    }

    lessThan(clock: VectorClock): boolean {
        return VectorClock.lessThan(this, clock);
    }

    causallyRelatedTo(clock: VectorClock): boolean {
        return VectorClock.causallyRelatedTo(this, clock);
    }

    concurrentWith(clock: VectorClock): boolean {
        return VectorClock.concurrentWith(this, clock);
    }

    static equalTo(clock1: VectorClock, clock2: VectorClock): boolean {
        return clock1.vector.length === clock2.vector.length && clock1.vector.reduce((out, v1, i) => {
            const v2 = clock2.get(i);
            return out && v1 === v2;
        }, true);
    }

    static lessThanOrEqualTo(clock1: VectorClock, clock2: VectorClock): boolean {
        return clock1.vector.length === clock2.vector.length && clock1.vector.reduce((out, v1, i) => {
            const v2 = clock2.get(i);
            return out && v1 <= v2;
        }, true);
    }

    static lessThan = VectorClock.causallyRelatedTo;

    static causallyRelatedTo(clock1: VectorClock, clock2: VectorClock): boolean {
        return VectorClock.lessThanOrEqualTo(clock1, clock2) && clock1.vector.reduce((out, v1, i) => {
            const v2 = clock2.get(i);
            return out || v1 < v2;
        }, false);
    }

    static concurrentWith(clock1: VectorClock, clock2: VectorClock): boolean {
        return !VectorClock.lessThanOrEqualTo(clock1, clock2) && !VectorClock.lessThanOrEqualTo(clock2, clock1)
    }

    static compare(clock1: VectorClock, clock2: VectorClock): number {
        if(clock1.lessThan(clock2)) {
            return -1;
        }

        if(clock2.lessThan(clock1)) {
            return 1;
        }

        return clock1.memberIndex - clock2.memberIndex;
    }
}