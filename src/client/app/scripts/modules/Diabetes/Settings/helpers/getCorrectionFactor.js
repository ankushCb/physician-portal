/**
 * method to calculate the correct corrction factor on the basis of correctionalOn condition of timeWindow,
 * hyperglycemiaThresholdEmergency. correctionTarget and correctionFactor
 */

export default (correctionalOn, settings) => (
  correctionalOn ? settings.correctionFactor : settings.hyperglycemiaThresholdEmergency - settings.correctionTarget
);
