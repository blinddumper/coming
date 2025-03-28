import { ResizeObserverSize } from './ResizeObserverSize';
import { ResizeObserverBoxOptions } from './ResizeObserverBoxOptions';
import { calculateBoxSize } from './algorithms/calculateBoxSize';
import { isSVG, isReplacedElement } from './utils/element';

let skipNotifyOnElement = (target: Element): boolean => {
  return !isSVG(target)
  && !isReplacedElement(target)
  && getComputedStyle(target).display === 'inline';
}

/**
 * https://drafts.csswg.org/resize-observer-1/#resize-observation-interface
 */
class ResizeObservation {

  public target: Element;
  public observedBox: ResizeObserverBoxOptions;
  public lastReportedSize: ResizeObserverSize; // Todo: update to FrozenArray

  public constructor (target: Element, observedBox?: ResizeObserverBoxOptions) {
    this.target = target;
    this.observedBox = observedBox || ResizeObserverBoxOptions.CONTENT_BOX;
    this.lastReportedSize = {
      inlineSize: -1,
      blockSize: -1
    }
  }

  public isActive (): boolean {
    let size = calculateBoxSize(this.target, this.observedBox, true);
    if (skipNotifyOnElement(this.target)) {
      this.lastReportedSize = size;
    }
    if (this.lastReportedSize.inlineSize !== size.inlineSize
      || this.lastReportedSize.blockSize !== size.blockSize) {
      return true;
    }
    return false;
  }

}

export { ResizeObservation };
