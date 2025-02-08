import { css } from 'lit'

export default css`
  ha-form-grid {
    grid-template-columns: repeat(var(--form-grid-column-count, auto-fit), minmax(var(--form-grid-min-width, 200px), 1fr));
    gap: 24px 8px;
    display: grid !important;
  }

  ha-selector,
  ha-area-picker,
  ha-formfield {
    margin-bottom: 24px;
    display: block;
  }

  ha-textfield {
    display: block;
  }

  mwc-formfield {
    padding-bottom: 8px;
  }

  mwc-switch {
    --mdc-theme-secondary: var(--switch-checked-color);
  }
`;
