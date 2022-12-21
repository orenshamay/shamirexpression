import Task from './Task'
import Form from './Form'

export class UserSession {
    constructor(id) {
        this.id = id
        this.task = new Task()
        this.form = new Form()
    }
}

