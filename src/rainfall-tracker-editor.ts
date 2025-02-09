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

  @state() private _helpers?: any;

  private _initialized = false;

  public setConfig(config: RainfallTrackerCardConfig): void {
    this._config = config;
    this.loadCardHelpers();
  }

  protected shouldUpdate(): boolean {
    if (!this._initialized) {
      this._initialize();
    }

    return true;
  }

  get _name(): string {
    return this._config?.name || '';
  }

  get _entity(): string {
    return this._config?.entity || '';
  }

  get _rainfall_intensity_entity(): string {
    return this._config?.rainfall_intensity_entity || '';
  }

  get _area(): string {
    return this._config?.area || '';
  }


  protected render(): TemplateResult | void {
    if (!this.hass || !this._helpers) {
      return html``;
    }

    return html`
        <ha-selector
                .hass=${this.hass}
                .selector=${{entity: {domain: ["sensor"]}}}
                .value=${this._entity}
                .configValue=${'entity'}
                name="entity"
                label="${localize('COMMON.ENTITY')}"
                @value-changed=${this._valueChanged}
        ></ha-selector>
        <ha-selector
                .hass=${this.hass}
                .selector=${{entity: {domain: ["sensor"]}}}
                .value=${this._rainfall_intensity_entity}
                .configValue=${'rainfall_intensity_entity'}
                .required=${false}
                name="rainfall_intensity_entity"
                label="${localize('COMMON.RAINFALL_INTENSITY_ENTITY')}"
                @value-changed=${this._valueChanged}
        ></ha-selector>
        <ha-area-picker
                .curValue=${this._area}
                .hass=${this.hass}
                .value=${this._area}
                .configValue=${'area'}
                label="${localize('COMMON.AREA')}"
                @value-changed=${this._valueChanged}
        >
        </ha-area-picker>
        <ha-textfield
                label="${localize('COMMON.NAME')}"
                .value=${this._name}
                .configValue=${'name'}
                @input=${this._valueChanged}>
        </ha-textfield>
        </ha-form-col>
    `;
  }

  private _initialize(): void {
    if (this.hass === undefined) return;
    if (this._config === undefined) return;
    if (this._helpers === undefined) return;
    this._initialized = true;
  }

  private async loadCardHelpers(): Promise<void> {
    this._helpers = await (window as any).loadCardHelpers();
  }

  private _valueChanged(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;

    let value = ev.detail?.value || target.value;
    if (!target.configValue) {
      return;
    }

    if (value === this[`_${target.configValue}`]) {
      value = ''; // Forzar el valor a null
    }

    if (target.configValue) {
      if (value === '') {
        const tmpConfig = {...this._config};
        delete tmpConfig[target.configValue];
        this._config = tmpConfig;
      } else {
        this._config = {
          ...this._config,
          [target.configValue]: target.checked !== undefined ? target.checked : value,
        };
      }
    }
    fireEvent(this, 'config-changed', {config: this._config});
  }

  // https://lit.dev/docs/components/styles/
  static get styles(): CSSResultGroup {
    return styles;
  }
}
