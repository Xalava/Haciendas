import globalEvents from "./globalEvents.js"
export default class Quests {
    constructor(){
   }

    addQuest(questName, giver, activateMessage, completeMessage, nextQuest){
        let quest = {}
        quest.name = questName
        quest.isActive = false
        quest.isComplete = false

        quest.activate = () => {
            quest.isActive = false
            giver.says(activateMessage)
        }

        quest.completed = () => {
            globalGame.scene.getScene('interfaceScene').sound.play("holy")
            giver.says(completeMessage)
            quest.isComplete = true
            if (nextQuest) {
                if (this.quests[nextQuest]){
                    this.quests[nextQuest].activate()
                } else {
                    console.error('Quest', nextQuest, 'does not exist')
                }
            }
        }

        globalEvents.on(quest.name+"-complete", () => {

            quest.completed()

        })        

        this[questName] = quest        
    }
}
