var VectorClock = /** @class */ (function () {
    function VectorClock(memberIndex, vector) {
        this.memberIndex = memberIndex;
        this.vector = vector;
    }
    VectorClock.prototype.increment = function () {
        this.vector[this.memberIndex] += 1;
    };
    return VectorClock;
}());
//# sourceMappingURL=vector-clock.js.map