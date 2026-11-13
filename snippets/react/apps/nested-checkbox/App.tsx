import { useEffect, useRef, useState, type ChangeEventHandler} from 'react';
import { MOCK_DATA } from './data.ts';
import type { CheckboxItem, CheckboxTreeState } from './types.ts'

interface CheckboxTreeProps  {
  items: CheckboxItem[]
}

const process = (acc: CheckboxTreeState, item: CheckboxItem , parent?: CheckboxItem) => {
  acc[item.id] = item
  item.parent = parent
  item.selected = item.selected || !!parent?.selected
  if (item.children && item.children.length > 0) {
    item.children.forEach((child) => { process(acc, child, item)})

    const allSelected = item.children.every((child)=> child.selected)
    const someSelected = item.children.some((child)=> child.selected || child.indeterminate)

    item.selected = allSelected
    item.indeterminate = !allSelected && someSelected
  }

  return acc
}
const propagate = (children: CheckboxItem[], value: boolean) => {
  for (const child of children) {
    child.selected = value
    child.indeterminate = false
    propagate(child.children ?? [] ,value)
  }
}
const bubble = (state: CheckboxTreeState, target: CheckboxItem) => {
  if (!target || !target.parent) return
  const parent = target.parent
  const children = parent.children ?? []
  if (children.length > 0) {
    const allSelected = children.every((child) => child.selected)
    const someSelected  = children.some((child)=> child.selected || child.indeterminate )
    parent.selected = allSelected
    parent.indeterminate = !allSelected && someSelected
    bubble(state, parent)
  }
}
const CheckboxTree = ({ items }: CheckboxTreeProps) => {
  const [state, setState] = useState<CheckboxTreeState>({})
  useEffect(() => {
    const cloneItems = structuredClone(items)
    const newState = cloneItems.reduce((acc, item) => process(acc, item), {})

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(newState)

  }, [items])
  const onSelect: ChangeEventHandler<HTMLUListElement> = ({ target }) => {

    if (target instanceof HTMLInputElement) {
      const { id } = target.dataset
      if (!id) return
      const newState = structuredClone(state)
      const element = newState[id]
      if (!element) return

      element.selected = target.checked
      element.indeterminate = false
      propagate(element.children ?? [], target.checked)
      bubble(newState, element)
      setState(newState)
    }
  }
  return <>

    <ul onChangeCapture={onSelect} className='checkbox-tree'>
      {Object.values(state)
        .filter((item) => !item.parent)
        .map((item) => (
          <li className='checkbox-tree__item' key={item.id}>
            <Checkbox {...item} />
          </li>
        ))}
    </ul>

  </>
}

const Checkbox = (props: CheckboxItem) => {
  const { label, id, children, selected = false, indeterminate = false } = props
  const ref = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  return <>
    <label>
      <input
        id={id}
        type="checkbox"
        checked={selected }
        ref={ref}
        data-id={ id }
        readOnly
      />
      <span>{label}</span>
    </label>
    {children && children.length > 0 && <ul className='checkbox-tree'>
      {children.map((item) => <li
        className='checkbox-tree__item'
        key={item.id}
      >
          <Checkbox {...item} />
      </li>
      )}
    </ul>}
  </>
}

export function App() {
  return (
    <main className="demo">
      <CheckboxTree items={ MOCK_DATA } />
    </main>
  );
}
