export type CheckboxItem = {
  id: string
  label: string
  parent?: CheckboxItem
  selected?: boolean
  indeterminate?: boolean
  children?: CheckboxItem[]
}

export type CheckboxTreeState = Record<string, CheckboxItem>
