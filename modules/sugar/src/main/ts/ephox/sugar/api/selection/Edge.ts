import { Option } from '@ephox/katamari';
import * as Compare from '../dom/Compare';
import { SugarElement } from '../node/SugarElement';
import * as Awareness from './Awareness';
import * as CursorPosition from './CursorPosition';

// not sure where the "correct" interface is declared, doesn't seem to be in Sugar
interface SelectionStart {
  startContainer: () => SugarElement<Node>;
  startOffset: () => number;
}

type DescentFn = (element: SugarElement<Node>) => Option<SugarElement<Node & ChildNode>>;
type AwarenessFn = (element: SugarElement<Node>, offset: number) => boolean;

const isAtEdge = (parent: SugarElement<Node>, current: SugarElement<Node>, currentOffset: number, descent: DescentFn, awareness: AwarenessFn) =>
  descent(parent).fold(
    () => true,
    (element) => Compare.eq(current, element) && awareness(current, currentOffset)
  );

const isLeft = (parent: SugarElement<Node>, selection: SelectionStart) =>
  isAtEdge(parent, selection.startContainer(), selection.startOffset(), CursorPosition.first, Awareness.isStart);

// This is doing exactly the same thing as the above isLeft method, checking to see if an element/offset selection endpoint is at the left edge of its parent
// after ascending up to that parent except we explicitly provide the element and its offset instead of just using the selection object.
const isAtLeftEdge = (parent: SugarElement<Node>, element: SugarElement<Node>, offset: number) =>
  isAtEdge(parent, element, offset, CursorPosition.first, Awareness.isStart);

const isRight = (parent: SugarElement<Node>, selection: SelectionStart) =>
  isAtEdge(parent, selection.startContainer(), selection.startOffset(), CursorPosition.last, Awareness.isEnd);

// This is doing exactly the same thing as the above isRight method, checking to see if an element/offset selection endpoint is at the right edge of its parent
// after ascending up to that parent except we explicitly provide the element and its offset instead of just using the selection object.
const isAtRightEdge = (parent: SugarElement<Node>, element: SugarElement<Node>, offset: number) =>
  isAtEdge(parent, element, offset, CursorPosition.last, Awareness.isEnd);

export {
  isLeft,
  isAtLeftEdge,
  isRight,
  isAtRightEdge
};
