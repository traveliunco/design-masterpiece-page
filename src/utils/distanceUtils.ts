// دوال حساب المسافات والأدوات الجغرافية

/**
 * حساب المسافة بين نقطتين باستخدام صيغة Haversine
 * @returns المسافة بالكيلومترات
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // نصف قطر الأرض بالكيلومترات
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * تحويل الدرجات إلى راديان
 */
function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * تقدير وقت الطيران بناءً على المسافة
 * متوسط سرعة الطائرة: 850 كم/ساعة
 */
export function estimateFlightTime(distanceKm: number): {
  hours: number;
  minutes: number;
  formatted: string;
  formattedAr: string;
} {
  const avgSpeed = 850; // كم/ساعة
  const totalHours = distanceKm / avgSpeed;
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);
  
  return {
    hours,
    minutes,
    formatted: `${hours}h ${minutes}m`,
    formattedAr: `${hours} ساعة و ${minutes} دقيقة`
  };
}

/**
 * تحويل الإحداثيات الجغرافية إلى موقع على الكرة ثلاثية الأبعاد
 * @param lat خط العرض
 * @param lng خط الطول
 * @param radius نصف قطر الكرة
 */
export function latLngToPosition(
  lat: number,
  lng: number,
  radius: number = 1
): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return [x, y, z];
}

/**
 * الحصول على نقاط منحنى بين نقطتين على الكرة (لمسار الطيران)
 */
export function getArcPoints(
  start: [number, number, number],
  end: [number, number, number],
  numPoints: number = 50,
  arcHeight: number = 0.3
): [number, number, number][] {
  const points: [number, number, number][] = [];
  
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    
    // Spherical interpolation
    const x = start[0] + (end[0] - start[0]) * t;
    const y = start[1] + (end[1] - start[1]) * t;
    const z = start[2] + (end[2] - start[2]) * t;
    
    // Normalize to get point on sphere surface
    const length = Math.sqrt(x * x + y * y + z * z);
    
    // Add arc height (parabolic)
    const heightFactor = 1 + arcHeight * Math.sin(t * Math.PI);
    
    points.push([
      (x / length) * heightFactor,
      (y / length) * heightFactor,
      (z / length) * heightFactor
    ]);
  }
  
  return points;
}

/**
 * تنسيق المسافة للعرض
 */
export function formatDistance(km: number): string {
  if (km >= 1000) {
    return `${(km / 1000).toFixed(1)} ألف كم`;
  }
  return `${Math.round(km)} كم`;
}

/**
 * الحصول على لون بناءً على المسافة
 */
export function getDistanceColor(km: number): string {
  if (km < 3000) return '#10B981'; // أخضر - قريب
  if (km < 6000) return '#3B82F6'; // أزرق - متوسط
  if (km < 9000) return '#F59E0B'; // برتقالي - بعيد
  return '#EF4444'; // أحمر - بعيد جداً
}
