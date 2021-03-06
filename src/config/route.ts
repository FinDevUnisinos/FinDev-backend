const apiUrl = '/api'

export class Route {
    getProjectRoute() {
        return apiUrl + '/project'
    }

    getProjectWorkersRoute() {
        return this.getProjectRoute() + '/workers'
    }

    getProjectInterestsRoute() {
        return this.getProjectRoute() + '/interests'
    }

    getProjectSkillsRoute() {
        return this.getProjectRoute() + '/skills'
    }

    getValidatorRoute() {
        return apiUrl + '/validator'
    }

    getUserRoute() {
        return apiUrl + '/user'
    }

    getUserSkillsRoute() {
        return this.getUserRoute() + '/skills'
    }

    getSkillRoute() {
        return apiUrl + '/skill'
    }

    getUserProjectsRoute() {
        return this.getUserRoute() + '/projects'
    }

}