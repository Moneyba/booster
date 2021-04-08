import { EventInterface } from './event'
import { Register } from './register'

export interface EventHandlerInterface {
  handle(event: EventInterface, register: Register): Promise<void>
}
