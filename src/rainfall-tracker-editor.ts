/* eslint-disable @typescript-eslint/no-explicit-any */
import {LitElement, html, TemplateResult, CSSResultGroup} from 'lit';
import {HomeAssistant, fireEvent, LovelaceCardEditor} from 'custom-card-helpers';

import {RainfallTrackerCardConfig} from './types';
import {customElement, property, state} from 'lit/decorators.js';
import {localize} from "./localize/localize";
import styles from './styles/rainfall-tracker-editor.css'

@customElement('rainfall-tracker-card-editor')
export class RainfallTrackerCardEditor extends LitElement implements LovelaceCardEditor {
  @property({attribute: false}) public hass?: HomeAssistant;

  @state() private _config?: RainfallTrackerCardConfig;

  @state() private _componentsReady = false;

  public setConfig(config: RainfallTrackerCardConfig): void {
    this._config = config;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._loadComponents();
  }

  /**
   * HA loads `ha-form` (and the selectors) lazily, only when some built-in editor needs them.
   * Opening the editor of a built-in card forces that load.
   */
  private async _loadComponents(): Promise<void> {
    if (!customElements.get('ha-form')) {
      try {
        const helpers = await (window as any).loadCardHelpers();
        const card = await helpers.createCardElement({type: 'entities', entities: []});
        await card?.constructor?.getConfigElement?.();
      } catch (err) {
        console.warn('rainfall-tracker-card: could not preload HA form components', err);
      }
      await Promise.race([
        customElements.whenDefined('ha-form'),
        new Promise((resolve) => setTimeout(resolve, 3000)),
      ]);
    }
    this._componentsReady = true;
  }

  private _schema() {
    return [
      {name: 'name', selector: {text: {}}},
      {
        name: 'entity',
        required: true,
        selector: {entity: {domain: 'sensor', device_class: 'precipitation'}},
      },
      {
        name: 'rainfall_intensity_entity',
        selector: {entity: {domain: 'sensor', device_class: 'precipitation_intensity'}},
      },
      {name: 'max_level', selector: {number: {min: 0.1, step: 'any', mode: 'box'}}},
      {
        type: 'expandable',
        title: localize('COMMON.INTERACTIONS', this.hass?.language),
        schema: [
          {name: 'tap_action', selector: {ui_action: {}}},
          {name: 'hold_action', selector: {ui_action: {}}},
          {name: 'double_tap_action', selector: {ui_action: {}}},
        ],
      },
    ];
  }

  // `ha-form` also calls this for the expandable group, which has a `title` instead of a `name`
  private _computeLabel = (schema: {name?: string; title?: string}): string =>
    schema.name ? localize(`COMMON.${schema.name.toUpperCase()}`, this.hass?.language) : schema.title ?? '';

  protected render(): TemplateResult | void {
    if (!this.hass || !this._config || !this._componentsReady) {
      return html``;
    }

    return html`
        <ha-form
                .hass=${this.hass}
                .data=${this._config}
                .schema=${this._schema()}
                .computeLabel=${this._computeLabel}
                @value-changed=${this._valueChanged}
        ></ha-form>
    `;
  }

  private _valueChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) return;

    // Empty fields are removed so the card falls back to its defaults
    const config = {...ev.detail.value} as Record<string, unknown>;
    for (const key of Object.keys(config)) {
      if (config[key] === '' || config[key] === undefined || config[key] === null) delete config[key];
    }

    this._config = config as RainfallTrackerCardConfig;
    fireEvent(this, 'config-changed', {config: this._config});
  }

  // https://lit.dev/docs/components/styles/
  static get styles(): CSSResultGroup {
    return styles;
  }
}
