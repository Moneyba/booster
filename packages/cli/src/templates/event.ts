export const template = `{{#imports}}
import { {{#componentNames}}
  {{.}},{{/componentNames}}
} from '{{{packagePath}}}'
{{/imports}}

@Event
export class {{{ name }}} {
  public constructor(
    {{#fields}}
    readonly {{{name}}}: {{{type}}},
    {{/fields}}
  ) {}

  public entityID(): UUID {
    return /* the associated entity ID */
  }
}
`
