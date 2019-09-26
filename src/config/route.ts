const baseUrl = '/'
const apiUrl = '/api'

export class Route {
    getProjectRoute(){
        return apiUrl + '/project'
    }

    getValidatorRoute(){
        return apiUrl + '/validator'
    }

    getUserRoute(){
        return apiUrl + '/user'
    }

}