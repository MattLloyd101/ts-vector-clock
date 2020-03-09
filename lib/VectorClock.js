System.register([], function (exports_1, context_1) {
    "use strict";
    var VectorClock;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            VectorClock = class VectorClock {
                constructor(memberIndex, vector = []) {
                    this.memberIndex = memberIndex;
                    this.vector = vector;
                }
                get(index) {
                    return this.vector[index];
                }
                increment() {
                    var _a;
                    return this.updateIndex(this.memberIndex, ((_a = this.get(this.memberIndex)) !== null && _a !== void 0 ? _a : 0) + 1);
                }
                updateIndex(index, version) {
                    const newVector = this.vector.concat([]);
                    newVector[index] = version;
                    return new VectorClock(this.memberIndex, newVector);
                }
                update(clock) {
                    const updated = this.increment();
                    const mergedVector = updated.vector.map((v1, i) => {
                        const v2 = clock.get(i);
                        return Math.max(v1, v2);
                    });
                    return new VectorClock(this.memberIndex, mergedVector);
                }
                equalTo(clock) {
                    return VectorClock.equalTo(this, clock);
                }
                lessThanOrEqualTo(clock) {
                    return VectorClock.lessThanOrEqualTo(this, clock);
                }
                lessThan(clock) {
                    return VectorClock.lessThan(this, clock);
                }
                causallyRelatedTo(clock) {
                    return VectorClock.causallyRelatedTo(this, clock);
                }
                concurrentWith(clock) {
                    return VectorClock.concurrentWith(this, clock);
                }
                static equalTo(clock1, clock2) {
                    return clock1.vector.length === clock2.vector.length && clock1.vector.reduce((out, v1, i) => {
                        const v2 = clock2.get(i);
                        return out && v1 === v2;
                    }, true);
                }
                static lessThanOrEqualTo(clock1, clock2) {
                    return clock1.vector.length === clock2.vector.length && clock1.vector.reduce((out, v1, i) => {
                        const v2 = clock2.get(i);
                        return out && v1 <= v2;
                    }, true);
                }
                static causallyRelatedTo(clock1, clock2) {
                    return VectorClock.lessThanOrEqualTo(clock1, clock2) && clock1.vector.reduce((out, v1, i) => {
                        const v2 = clock2.get(i);
                        return out || v1 < v2;
                    }, false);
                }
                static concurrentWith(clock1, clock2) {
                    return !VectorClock.lessThanOrEqualTo(clock1, clock2) && !VectorClock.lessThanOrEqualTo(clock2, clock1);
                }
            };
            exports_1("default", VectorClock);
            VectorClock.lessThan = VectorClock.causallyRelatedTo;
        }
    };
});
//# sourceMappingURL=VectorClock.js.map