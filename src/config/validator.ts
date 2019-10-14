export class Validator {
    public validateLevelSkill(level:number):number{
        let validLevel = level
        if(validLevel<1){
            validLevel = 1
        } else if(validLevel>3) {
            validLevel = 3
        }
        return validLevel
    }   
}
    