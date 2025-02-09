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
  test_gui?: boolean;
  entity?: string;
  rainfall_intensity_entity?: string;
  area?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}
