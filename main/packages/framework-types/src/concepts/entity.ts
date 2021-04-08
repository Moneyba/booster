/**
 * Holds information about a user class annotated with `@Entity`
 */
import { Class } from '../typelevel'
import { RoleAccess, UUID } from './index'

export interface EntityInterface {
  id: UUID
}

export interface EntityMetadata {
  readonly class: Class<EntityInterface>
  readonly authorizeReadEvents: RoleAccess['authorize']
}
