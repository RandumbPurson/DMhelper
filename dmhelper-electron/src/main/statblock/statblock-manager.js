
class StatblockManager {
    setActiveStatblock(statblock) {
        this.statblock = statblock;
    }
}

const statblockManager = new StatblockManager();

exports.statblockManager = statblockManager;