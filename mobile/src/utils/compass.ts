/**
 * Calculate the bearing between two geographic points
 * @param lat1 Latitude of first point in degrees
 * @param lng1 Longitude of first point in degrees
 * @param lat2 Latitude of second point in degrees
 * @param lng2 Longitude of second point in degrees
 * @returns Bearing in degrees (0-360)
 */
export function calculateBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;

  const y = Math.sin(dLng) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
            Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);

  let bearing = Math.atan2(y, x) * 180 / Math.PI;
  
  // Normalize to 0-360 degrees
  bearing = (bearing + 360) % 360;
  
  return bearing;
}

/**
 * Calculate the distance between two geographic points using the Haversine formula
 * @param lat1 Latitude of first point in degrees
 * @param lng1 Longitude of first point in degrees
 * @param lat2 Latitude of second point in degrees
 * @param lng2 Longitude of second point in degrees
 * @returns Distance in kilometers
 */
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

/**
 * Convert bearing degrees to cardinal direction
 * @param bearing Bearing in degrees (0-360)
 * @returns Cardinal direction string
 */
export function getBearingDirection(bearing: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}

/**
 * Check if device is aligned with target bearing within threshold
 * @param deviceHeading Current device heading in degrees
 * @param targetBearing Target bearing in degrees
 * @param threshold Alignment threshold in degrees (default: 15)
 * @returns True if aligned
 */
export function isAligned(deviceHeading: number, targetBearing: number, threshold: number = 15): boolean {
  const relativeBearing = Math.abs(getRelativeBearing(deviceHeading, targetBearing));
  return relativeBearing <= threshold;
}

/**
 * Calculate the relative bearing (difference between device heading and target bearing)
 * @param deviceHeading Current device heading in degrees
 * @param targetBearing Target bearing in degrees
 * @returns Relative bearing (-180 to 180 degrees)
 */
export function getRelativeBearing(deviceHeading: number, targetBearing: number): number {
  let relative = targetBearing - deviceHeading;
  
  // Normalize to -180 to 180 degrees
  if (relative > 180) {
    relative -= 360;
  } else if (relative < -180) {
    relative += 360;
  }
  
  return relative;
}