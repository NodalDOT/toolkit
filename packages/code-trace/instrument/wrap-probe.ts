export type Probe = { start: number; end: number }

const PROBE_START = (id:number):string  =>  `__trace$(${id}, (`
const PROBE_END = ():string => "))"

type Insert = { at: number; text: string; isOpen: boolean; other: number }

export const wrap = (source: string, probes: Probe[]) => {
  const sortedInserts = probes.flatMap(({start, end}, id): Insert[] => {
    return [{ at:start, text: PROBE_START(id), isOpen :true, other:end  },
      {at:end , text: PROBE_END(),isOpen: false, other:end}]

  }).sort(
    (a:Insert, b: Insert) => {
      if (a.at !== b.at) return a.at - b.at
      if (a.isOpen !== b.isOpen) return a.isOpen ? 1 : -1
      return b.other - a.other
    }
  )
  let result = ''
  let cursor = 0
  for (const { at, text } of sortedInserts) {
    result += source.slice(cursor, at) + text
    cursor = at
  }
  return result + source.slice(cursor)

}
