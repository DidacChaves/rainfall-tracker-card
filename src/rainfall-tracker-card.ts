/* eslint-disable @typescript-eslint/no-explicit-any */
import { CSSResultGroup, html, LitElement, PropertyValues, TemplateResult} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {
  ActionHandlerEvent,
  getLovelace,
  handleAction,
  hasAction,
  hasConfigOrEntityChanged,
  HomeAssistant,
  LovelaceCardEditor,
  LovelaceCard
} from 'custom-card-helpers'; // This is a community maintained npm module with common helper functions/types. https://github.com/custom-cards/custom-card-helpers
import type {RainfallTrackerCardConfig} from './types';
import {actionHandler} from './action-handler-directive';
import {CARD_VERSION} from './const';
import {localize} from './localize/localize';
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

  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  // Add any properities that should cause your element to re-render here
  // https://lit.dev/docs/components/properties/
  @property({attribute: false}) public hass!: HomeAssistant;

  @state() private config!: RainfallTrackerCardConfig;

  // https://lit.dev/docs/components/properties/#accessors-custom
  public setConfig(config: RainfallTrackerCardConfig): void {
    if (!config) {
      throw new Error(localize('ERROR.INVALID_CONFIG'));
    }

    if (!config.entity) {
      throw new Error(localize('ERROR.NO_ENTITY'));
    }

    if (config.test_gui) {
      getLovelace().setEditMode(true);
    }

    this.config = {
      name: 'Rainfall Tracker',
      ...config,
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

    return hasConfigOrEntityChanged(this, changedProps, false);
  }

  private createRaindrops(): void {
    const rainContent = this.shadowRoot?.querySelector('.rain-content') as HTMLElement | null;
    if (!rainContent) return;

    const containerWidth = this.offsetWidth || window.innerWidth;
    rainContent.innerHTML = '';

    const counter = 20;
    for (let i = 0; i < counter; i++) {
      const hrElement = document.createElement("HR");
      hrElement.style.left = `${Math.random() * containerWidth - 40}px`;
      hrElement.style.animationDuration = `${0.2 + Math.random() * 0.9}s`;
      hrElement.style.animationDelay = `${Math.random() * 2}s`;
      rainContent.appendChild(hrElement);
    }
  }

  protected firstUpdated(): void {
    this.createRaindrops();
  }

  protected updated(changedProps: PropertyValues): void {
    if (changedProps.has('config') || changedProps.has('hass')) {
      this.createRaindrops();
    }
  }

  // https://lit.dev/docs/components/rendering/
  protected render(): TemplateResult | void {
    if (!this.config.entity) {
      return this._showError(localize('ERROR.NO_ENTITY'));
    }

    const {entity, rainfall_intensity_entity, max_level, isImperial} = this.config;
    const rainfallState = entity ? this.hass.states[entity] : undefined;
    const rainfallValue = rainfallState ? parseFloat(rainfallState.state) : 0;
    const maxRainfallValue = max_level ? parseFloat(max_level) : 50;
    const rainfallIntensityState = rainfall_intensity_entity ? this.hass.states[rainfall_intensity_entity] : undefined;
    const rainfallIntensityValue = rainfallIntensityState ? parseFloat(rainfallIntensityState.state) : 0;

    const rainfallValueCap = Math.min(rainfallValue, maxRainfallValue);

    // Function: f(x) = 20% if x <= 0.2 * max, 20% + 30% * (x - 0.2 * max) / (0.3 * max) si x <= 0.5 * max, 50% + 50% * (x - 0.5 * max) / (0.5 * max) si x <= max
    const percentage = Math.min(
      rainfallValueCap <= 0.2 * maxRainfallValue
        ? (rainfallValueCap / (0.2 * maxRainfallValue)) * 20 // Primer 20% con valores bajos
        : rainfallValueCap <= 0.5 * maxRainfallValue
          ? 20 + ((rainfallValueCap - 0.2 * maxRainfallValue) / (0.3 * maxRainfallValue)) * 30 // De 20% a 50%
          : 50 + ((rainfallValueCap - 0.5 * maxRainfallValue) / (0.5 * maxRainfallValue)) * 50, // De 50% a 100%
      100
    );

    return html`
        <ha-card
                class="with-fixed-footer"
                @action=${this._handleAction}
                .actionHandler=${actionHandler({
                    hasHold: hasAction(this.config.hold_action),
                    hasDoubleClick: hasAction(this.config.double_tap_action),
                })}
                tabindex="0"
                .label=${`Rainfall Tracker: ${this.config.entity || localize('ERROR.NO_ENTITY')}`}
        >
            <div class="header">
                <div class="name" title="${this.config.name}">${this.config.name}</div>
                <div class="icon">
                    <ha-icon class="icon" icon="mdi:weather-pouring"></ha-icon>
                </div>
            </div>
            <div class="info">
                <div>
                    <span class="value">${rainfallValue}</span>
                    <span class="measurement">${isImperial ? 'in': 'mm'}</span>
                </div>
                ${rainfallIntensityState ? html`
                    <div>
                        <span class="value2">${rainfallIntensityValue}</span>
                        <span class="measurement2">${isImperial ? 'in': 'mm'}/h</span>
                    </div>
                `: ''}
            </div>
            <div class="rain-content" style="${rainfallIntensityValue === 0 ? 'display: none;' : ''}"></div>
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
