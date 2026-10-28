/* eslint-disable @typescript-eslint/no-explicit-any */
import { CSSResultGroup, html, LitElement, PropertyValues, TemplateResult} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {
  ActionHandlerEvent,
  formatNumber,
  handleAction,
  hasAction,
  HomeAssistant,
  LovelaceCardEditor,
  LovelaceCard
} from 'custom-card-helpers'; // This is a community maintained npm module with common helper functions/types. https://github.com/custom-cards/custom-card-helpers
import type {RainfallTrackerCardConfig} from './types';
import {actionHandler} from './action-handler-directive';
import {CARD_VERSION} from './const';
import {localize} from './localize/localize';
import {createDrops, defaultMaxLevel, levelPercentage, parseMaxLevel, parseState} from './utils/rainfall';
import styles from './styles/rainfall-tracker-card.css'

/* eslint no-console: 0 */
console.info(
  `%c RAINFALL-TRACKER-CARD %c ${CARD_VERSION} `,
  'color: white; font-weight: 800; background: #015294',
  'color: #015294; font-weight: 800; background: white',
);

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'rainfall-tracker-card',
  name: 'Rainfall tracker card',
  description: 'This custom card displays accumulated rainfall and hourly rainfall intensity in millimeters (mm). It integrates with Home Assistant to show real-time data from your weather or rainfall sensor.',
});

@customElement('rainfall-tracker-card')
export class RainfallTrackerCard extends LitElement implements LovelaceCard {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import('./rainfall-tracker-editor');
    return document.createElement('rainfall-tracker-card-editor');
  }

  public static getStubConfig(hass?: HomeAssistant): Record<string, unknown> {
    const sensors = Object.values(hass?.states ?? {}).filter(
      (s) => s.entity_id.startsWith('sensor.') && s.attributes.device_class === 'precipitation',
    );
    return {entity: sensors[0]?.entity_id ?? ''};
  }

  // Add any properities that should cause your element to re-render here
  // https://lit.dev/docs/components/properties/
  @property({attribute: false}) public hass!: HomeAssistant;

  @state() private config!: RainfallTrackerCardConfig;

  // Raindrops are random but fixed for the life of the card, so the animation is not restarted on updates
  private _drops = createDrops();

  // https://lit.dev/docs/components/properties/#accessors-custom
  public setConfig(config: RainfallTrackerCardConfig): void {
    if (!config) {
      throw new Error(localize('ERROR.INVALID_CONFIG', this.hass?.language));
    }

    if (!config.entity) {
      throw new Error(localize('ERROR.NO_ENTITY', this.hass?.language));
    }

    if ('isImperial' in config || 'area' in config) {
      console.warn('rainfall-tracker-card: `isImperial` and `area` are no longer used. The unit is read from the entity.');
    }

    this.config = {
      ...config,
      max_level: parseMaxLevel(config.max_level),
    };
  }

  public async getCardSize(): Promise<number> {
    return 2;
  }

  public getGridOptions(): any {
    return {
      columns: 12,
      rows: 2,
      min_columns: 6,
      min_rows: 2,
      max_rows: 4,
    };
  }

  // https://lit.dev/docs/components/lifecycle/#reactive-update-cycle-performing
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.config) {
      return false;
    }
    if (changedProps.has('config')) {
      return true;
    }

    const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
    if (!oldHass) {
      return true;
    }

    // `hass` changes with every state update in HA: only repaint when one of our entities changed
    return [this.config.entity, this.config.rainfall_intensity_entity].some(
      (id) => id !== undefined && oldHass.states[id] !== this.hass.states[id],
    );
  }

  private _format(value: number | null): string {
    return value === null ? '—' : formatNumber(value, this.hass.locale, {maximumFractionDigits: 2});
  }

  // https://lit.dev/docs/components/rendering/
  protected render(): TemplateResult | void {
    if (!this.config || !this.hass) {
      return html``;
    }

    const lang = this.hass.language;
    const {entity, rainfall_intensity_entity} = this.config;
    const rainfallState = entity ? this.hass.states[entity] : undefined;

    if (!rainfallState) {
      return this._showError(localize('ERROR.ENTITY_NOT_FOUND', lang, {entity: entity ?? ''}));
    }

    const unit: string = rainfallState.attributes.unit_of_measurement || 'mm';
    const rainfallValue = parseState(rainfallState.state);
    const maxRainfallValue = this.config.max_level ?? defaultMaxLevel(unit);
    const percentage = rainfallValue === null ? 0 : levelPercentage(rainfallValue, maxRainfallValue);

    const intensityState = rainfall_intensity_entity ? this.hass.states[rainfall_intensity_entity] : undefined;
    const intensityValue = intensityState ? parseState(intensityState.state) : null;
    const intensityUnit: string = intensityState?.attributes.unit_of_measurement || `${unit}/h`;
    const isRaining = (intensityValue ?? 0) > 0;

    const title = this.config.name || localize('CARD.DEFAULT_NAME', lang);

    return html`
        <ha-card
                class="with-fixed-footer"
                @action=${this._handleAction}
                .actionHandler=${actionHandler({
                    hasHold: hasAction(this.config.hold_action),
                    hasDoubleClick: hasAction(this.config.double_tap_action),
                })}
                tabindex="0"
                role="button"
                aria-label="${title}: ${this._format(rainfallValue)} ${unit}"
        >
            <div class="header">
                <div class="name ellipsis" title="${title}">${title}</div>
                <div class="icon">
                    <ha-icon icon="mdi:weather-pouring"></ha-icon>
                </div>
            </div>
            <div class="info">
                <div>
                    <span class="value">${this._format(rainfallValue)}</span>
                    <span class="measurement">${unit}</span>
                </div>
                ${intensityState ? html`
                    <div>
                        <span class="value2">${this._format(intensityValue)}</span>
                        <span class="measurement2">${intensityUnit}</span>
                    </div>
                `: ''}
            </div>
            ${isRaining ? html`
                <div class="rain-content">
                    ${this._drops.map((drop) => html`
                        <hr style="left: ${drop.left}%; animation-duration: ${drop.duration}s; animation-delay: ${drop.delay}s;"/>
                    `)}
                </div>
            ` : ''}
            <div class="footer">
                <svg class="waves" style="transform: translateY(${100 - percentage}%);" xmlns="http://www.w3.org/2000/svg"
                     xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 125 28" preserveAspectRatio="none" shape-rendering="auto">
                    <defs>
                        <path id="gentle-wave" d="M-160 8c30 0 58-8 88-8s 58 8 88 8 58-8 88-8 58 8 88 8 v100h-352z"></path>
                    </defs>
                    <g class="parallax">
                        <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(69, 117, 230,0.7)"/>
                        <use xlink:href="#gentle-wave" x="48" y="1" fill="rgba(69, 117, 230,0.5)"/>
                        <use xlink:href="#gentle-wave" x="48" y="2" fill="rgba(69, 117, 230,0.3)"/>
                        <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(69, 117, 230, 1)"/>
                    </g>
                </svg>
            </div>
        </ha-card>
    `;
  }

  private _handleAction(ev: ActionHandlerEvent): void {
    if (this.hass && this.config && ev.detail.action) {
      handleAction(this, this.hass, this.config, ev.detail.action);
    }
  }

  private _showError(error: string): TemplateResult {
    const errorCard = document.createElement('hui-error-card');
    errorCard.setConfig({
      type: 'error',
      error,
      origConfig: this.config,
    });

    return html` ${errorCard} `;
  }

  // https://lit.dev/docs/components/styles/
  static get styles(): CSSResultGroup {
    return styles;
  }
}
