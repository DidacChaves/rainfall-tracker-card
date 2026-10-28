import { ActionConfig, LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';

declare global {
  interface HTMLElementTagNameMap {
    'rainfall-tracker-card-editor': LovelaceCardEditor;
    'hui-error-card': LovelaceCard;
  }
}

export interface RainfallTrackerCardConfig extends LovelaceCardConfig {
  type: string;
  name?: string;
  /** Accumulated rainfall sensor */
  entity?: string;
  /** Rainfall intensity sensor (mm/h or in/h) */
  rainfall_intensity_entity?: string;
  /** Rainfall at which the card is completely full, in the unit of `entity` */
  max_level?: number;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}
