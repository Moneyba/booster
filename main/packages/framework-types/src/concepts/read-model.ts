import { RoleAccess, UUID } from './index'
import { Class } from '../typelevel'
import { PropertyMetadata } from 'metadata-booster'

export interface ReadModelInterface {
  id: UUID
  boosterMetadata?: {
    version: number
  }
  [key: string]: any
}

export interface ReadModelMetadata {
  readonly class: Class<ReadModelInterface>
  readonly properties: Array<PropertyMetadata>
  readonly authorizedRoles: RoleAccess['authorize']
}
