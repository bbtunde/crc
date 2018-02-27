/* istanbul ignore next */
module.exports = class TestHelper {
    static resetStubAndSpys (stubsAndSpysArray) {
        stubsAndSpysArray.forEach(function(element) {
            try { element.restore() } catch (error) { }
        }, this);
    };
}
