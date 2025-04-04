import { resizeObservers } from '../utils/resizeObservers';
import { ResizeObserverDetail } from '../ResizeObserverDetail';
import { ResizeObserverEntry } from '../ResizeObserverEntry';
import { ResizeObservation } from '../ResizeObservation';
import { calculateDepthForNode } from './calculateDepthForNode';
import { calculateBoxSize } from './calculateBoxSize';

/**
 * Broadcasts all active observations.
 * 
 * https://drafts.csswg.org/resize-observer-1/#broadcast-resize-notifications-h
 */
var broadcastActiveObservations = (): number => {
  let shallowestDepth = Infinity;
  var callbacks: (() => void)[] = [];
  resizeObservers.forEach(function processObserver(ro: ResizeObserverDetail): void {
    if (ro.activeTargets.length === 0) {
      return;
    }
    var entries: ResizeObserverEntry[] = [];
    ro.activeTargets.forEach(function processTarget(ot: ResizeObservation): void {
      var entry = new ResizeObserverEntry(ot.target);
      var targetDepth = calculateDepthForNode(ot.target);
      entries.push(entry);
      ot.lastReportedSize = calculateBoxSize(ot.target, ot.observedBox);
      if (targetDepth < shallowestDepth) {
        shallowestDepth = targetDepth;
      }
    })
    // Gather all entries before firing callbacks
    // otherwise entries may change in the same loop
    callbacks.push(function resizeObserverCallback(): void {
      // callback.this should be resize observer
      ro.callback.call(ro.observer, entries, ro.observer)
    });
    ro.activeTargets.splice(0, ro.activeTargets.length);
  })
  for (var callback of callbacks) {
    callback();
  }
  return shallowestDepth;
}

export { broadcastActiveObservations };
