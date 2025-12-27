/**
 * Weekly Heatmap Component
 * =========================
 * Phase 7: Visualize check-in patterns across week and time segments
 * 
 * Shows:
 * - Grid of day × segment with color-coded harmony/success rates
 * - Helps users identify their best times visually
 * - Interactive cells with details
 */

import { DarkTheme } from '@/constants/DarkTheme';
import { TimeSegment } from '@/types/divine-timing-personal';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

/**
 * Cell data for heatmap
 */
interface HeatmapCell {
  dayOfWeek: number; // 0=Sunday
  segment: TimeSegment;
  value: number; // 0-100 (harmony score or success rate)
  count: number; // Number of check-ins
}

/**
 * Weekly Heatmap Props
 */
interface WeeklyHeatmapProps {
  data: HeatmapCell[];
  metric: 'harmony' | 'success'; // What to visualize
  onCellPress?: (cell: HeatmapCell) => void;
}

/**
 * Weekly Heatmap Component
 */
export function WeeklyHeatmap({
  data,
  metric = 'harmony',
  onCellPress,
}: WeeklyHeatmapProps) {
  const segments: TimeSegment[] = [
    'preDawn',
    'morning',
    'midday',
    'afternoon',
    'evening',
    'night',
  ];
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  /**
   * Get cell data for specific day and segment
   */
  const getCellData = (dayOfWeek: number, segment: TimeSegment): HeatmapCell | null => {
    return data.find(d => d.dayOfWeek === dayOfWeek && d.segment === segment) || null;
  };
  
  /**
   * Get color for cell based on value
   */
  const getCellColor = (value: number, count: number): string => {
    if (count === 0) {
      return DarkTheme.screenBackground; // No data
    }
    
    // Color scale from low to high
    if (value >= 75) {
      return '#10b981'; // Green (excellent)
    } else if (value >= 60) {
      return '#3b82f6'; // Blue (good)
    } else if (value >= 45) {
      return '#8b5cf6'; // Purple (balanced)
    } else if (value >= 30) {
      return '#f59e0b'; // Orange (caution)
    } else {
      return '#ef4444'; // Red (low)
    }
  };
  
  /**
   * Get opacity based on count (more data = more opaque)
   */
  const getCellOpacity = (count: number): number => {
    if (count === 0) return 0.1;
    if (count === 1) return 0.4;
    if (count === 2) return 0.6;
    if (count >= 3) return 0.8;
    return 1.0;
  };
  
  /**
   * Format segment name
   */
  const formatSegmentName = (segment: TimeSegment): string => {
    const names: Record<TimeSegment, string> = {
      preDawn: 'Dawn',
      morning: 'Morn',
      midday: 'Mid',
      afternoon: 'Aft',
      evening: 'Eve',
      night: 'Night',
    };
    return names[segment];
  };
  
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Header Row (Days) */}
        <View style={styles.row}>
          <View style={styles.cornerCell} />
          {days.map((day, index) => (
            <View key={index} style={styles.headerCell}>
              <Text style={styles.headerText}>{day}</Text>
            </View>
          ))}
        </View>
        
        {/* Data Rows (Segments) */}
        {segments.map((segment, segmentIndex) => (
          <View key={segment} style={styles.row}>
            {/* Segment Label */}
            <View style={styles.labelCell}>
              <Text style={styles.labelText}>
                {formatSegmentName(segment)}
              </Text>
            </View>
            
            {/* Cells for each day */}
            {days.map((_, dayIndex) => {
              const cellData = getCellData(dayIndex, segment);
              const value = cellData?.value || 0;
              const count = cellData?.count || 0;
              const color = getCellColor(value, count);
              const opacity = getCellOpacity(count);
              
              return (
                <TouchableOpacity
                  key={dayIndex}
                  style={[
                    styles.dataCell,
                    {
                      backgroundColor: color,
                      opacity,
                    },
                  ]}
                  onPress={() => cellData && onCellPress?.(cellData)}
                  disabled={count === 0}
                >
                  {count > 0 && (
                    <Text style={styles.cellValue}>
                      {Math.round(value)}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
        
        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>
            {metric === 'harmony' ? 'Harmony Score' : 'Success Rate'}
          </Text>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: '#ef4444' }]} />
              <Text style={styles.legendText}>Low</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.legendText}>Fair</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: '#8b5cf6' }]} />
              <Text style={styles.legendText}>Good</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: '#3b82f6' }]} />
              <Text style={styles.legendText}>Great</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: '#10b981' }]} />
              <Text style={styles.legendText}>Excellent</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  cornerCell: {
    width: 60,
    height: 40,
  },
  headerCell: {
    width: 50,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  labelCell: {
    width: 60,
    height: 40,
    justifyContent: 'center',
    paddingRight: 8,
  },
  labelText: {
    fontSize: 11,
    fontWeight: '600',
    color: DarkTheme.textSecondary,
    textAlign: 'right',
  },
  dataCell: {
    width: 50,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginHorizontal: 2,
  },
  cellValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  legend: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: DarkTheme.borderSubtle,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: DarkTheme.textSecondary,
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: DarkTheme.textSecondary,
  },
});
