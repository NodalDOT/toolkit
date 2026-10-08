import { Visitor, type ESTree } from 'vite'
import type { Probe } from './wrap-probe.ts'

const FUNCTIONS = new Set(['ArrowFunctionExpression', 'FunctionExpression', 'ClassExpression'])

export const collectProbes = (program: ESTree.Program) => {
  const probes: Probe[] = []
  const addProbe = ({ start, end }: ESTree.Span) => probes.push({ start, end })

  new Visitor({
    IfStatement: (node) => addProbe(node.test),
    ReturnStatement: (node) => {
      if (node.argument) addProbe(node.argument)
    },
    WhileStatement: (node) => addProbe(node.test),
    DoWhileStatement: (node) => addProbe(node.test),
    ForStatement: (node) => {
      if (node.test) addProbe(node.test)
    },
    SwitchStatement: (node) => addProbe(node.discriminant),
    ThrowStatement: (node) => addProbe(node.argument),
    ConditionalExpression: (node) => addProbe(node.test),
    VariableDeclarator: (node) => {
      if (node.init && !FUNCTIONS.has(node.init.type)) addProbe(node.init)
    },
    ArrowFunctionExpression: (node) => {
      if (node.expression) addProbe(node.body)
    },
    ExpressionStatement: (node) => {
      if (!node.directive) addProbe(node.expression)
    },
  }).visit(program)

  return probes
}
