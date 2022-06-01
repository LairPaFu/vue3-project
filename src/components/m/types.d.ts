
type verify = {
  required?: boolean,
  validate?: Validate,
  tip?: string
}

interface Validate {
  (value: string): boolean
}