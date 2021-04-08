import { v4 as uuid } from 'framework-types/src/concepts/uuid'
/**
 * `UUID` type to work globally as a identifier for Entities,
 * Commands, Events or any other booster artifact.
 * New unique identifiers can be created using the
 * `UUID.generate` method.
 */
export class UUID extends String {
  public static generate(): UUID {
    return uuid()
  }
}
