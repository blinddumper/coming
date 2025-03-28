import { ResizeObservation } from '../ResizeObservation';
import { ResizeObserverDetail } from '../ResizeObserverDetail';
import { resizeObservers } from '../utils/resizeObservers';
import { calculateDepthForNode } from './calculateDepthForNode';

/**
 * Finds all active observations at a give depth
 * 
 * https://drafts.csswg.org/resize-observer-1/#gather-active-observations-h
 */
let gatherActiveObservationsAtDepth = (depth: number): void => {
  resizeObservers.forEach(function processObserver(ro: ResizeObserverDetail): void {
    ro.activeTargets.splice(0, ro.activeTargets.length);
    ro.skippedTargets.splice(0, ro.skippedTargets.length);
    ro.observationTargets.forEach(function processTarget(ot: ResizeObservation): void {
      if (ot.isActive()) {
        if (calculateDepthForNode(ot.target) > depth) {
          ro.activeTargets.push(ot);
        }
        else {
          ro.skippedTargets.push(ot);
        }
      }
    })
  })
}

export { gatherActiveObservationsAtDepth };
