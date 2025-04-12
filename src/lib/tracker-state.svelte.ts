export class BuildTrackerState {
    buildTracker = $state({
        account: ''
    })

    // cart methods
    setBuildTracker(account: string) {
        this.buildTracker.account = account
    }

    resetBuildTracker() {
        this.buildTracker.account = ''
    }
}

export const buildTrackerState = new BuildTrackerState()