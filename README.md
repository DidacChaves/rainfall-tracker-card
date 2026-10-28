# Rainfall tracker card by [@DidacChaves](https://www.github.com/DidacChaves)

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE)
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)

![Downloads][downloads]
![Project Maintenance][maintenance-shield]
[![GitHub Activity][commits-shield]][commits]

[![Community Forum][forum-shield]][forum]

🌧️ Rainfall Tracker: Custom Home Assistant card to display current and accumulated rainfall data in a clear and interactive way.

![Default](https://github.com/didacchaves/rainfall-tracker-card/blob/master/docs/images/img.png?raw=true)

## Options

| Name                      | Type    | Requirement  | Description                                                                                     | Default                    |
|---------------------------|---------|--------------|-------------------------------------------------------------------------------------------------|----------------------------|
| type                      | string  | **Required** | `custom:rainfall-tracker-card`                                                                  |                            |
| entity                    | string  | **Required** | Accumulated rainfall sensor. The unit (`mm` or `in`) is read from the entity.                   |                            |
| name                      | string  | **Optional** | Card name                                                                                       | `Rainfall Tracker` (translated) |
| rainfall_intensity_entity | string  | **Optional** | Rainfall intensity sensor (`mm/h` or `in/h`). Enables the rain animation when it is above 0.     | `none`                     |
| max_level                 | number  | **Optional** | Rainfall, in the unit of `entity`, at which the card is completely full. Must be greater than 0.  | `50` for mm, `2` for in      |
| tap_action                | object  | **Optional** | Action to take on tap                                                                           | `action: more-info`        |
| hold_action               | object  | **Optional** | Action to take on hold                                                                          | `none`                     |
| double_tap_action         | object  | **Optional** | Action to take on double tap                                                                    | `none`                     |

### How the level is drawn

The water level is not linear, so small amounts of rain are still visible:

| Rainfall (% of `max_level`) | Card filled |
|-----------------------------|-------------|
| 0 – 20 %                    | 0 – 20 %    |
| 20 – 50 %                   | 20 – 50 %   |
| 50 – 100 %                  | 50 – 100 %  |

The animations respect the `prefers-reduced-motion` setting of the device.

### Migrating from 1.x

- `isImperial` was removed: the unit is now read from the sensor. If your sensor reports inches, set `max_level` in inches (or leave it empty for the default of 2).
- `area` was removed: it never had any effect.
- `max_level` is now a number (a numeric string still works).
- The visual editor only lists sensors with the `precipitation` and `precipitation_intensity` device classes. Other sensors can be set in YAML.

## Action Options

| Name            | Type   | Requirement  | Description                                                                                        | Default     |
| --------------- | ------ | ------------ |----------------------------------------------------------------------------------------------------|-------------|
| action          | string | **Required** | Action to perform (more-info, toggle, call-service, navigate url, none)                            | `more-info` |
| navigation_path | string | **Optional** | Path to navigate to (e.g. /lovelace/0/) when action defined as navigate                            | `none`      |
| url             | string | **Optional** | URL to open on click when action is url. The URL will open in a new tab                            | `none`      |
| service         | string | **Optional** | Service to call (e.g. media_player.media_play_pause) when action defined as call-service           | `none`      |
| service_data    | object | **Optional** | Service data to include (e.g. entity_id: media_player.bedroom) when action defined as call-service | `none`      |
| haptic          | string | **Optional** | Haptic feedback _success, warning, failure, light, medium, heavy, selection_                       | `none`      |
| repeat          | number | **Optional** | How often to repeat the `hold_action` in milliseconds.                                             | `none`      |

### Language

The following languages are supported:

| Language | Yaml value | Supported | Translated by                                       |
|----------|------------|-----------|-----------------------------------------------------|
| English  | `en`       | v1.0.0    | [@DidacChaves](https://www.github.com/DidacChaves)  |
| Catalan  | `ca`       | v1.0.0    | [@DidacChaves](https://www.github.com/DidacChaves)  |
| Spanish  | `es`       | v1.0.0    | [@DidacChaves](https://www.github.com/DidacChaves)  |

## Credits

This project is based on the template provided by [@iantrich](https://www.github.com/iantrich).

Special thanks for their valuable contributions to the Home Assistant community and for sharing tools and resources that help others build amazing projects.

[commits-shield]: https://img.shields.io/github/commit-activity/y/DidacChaves/rainfall-tracker-card.svg?style=for-the-badge
[commits]: https://github.com/DidacChaves/rainfall-tracker-card/commits/master
[devcontainer]: https://code.visualstudio.com/docs/remote/containers
[discord-shield]: https://img.shields.io/discord/330944238910963714.svg?style=for-the-badge
[forum-shield]: https://img.shields.io/badge/community-forum-brightgreen.svg?style=for-the-badge
[forum]: https://community.home-assistant.io/c/projects/frontend
[license-shield]: https://img.shields.io/github/license/DidacChaves/rainfall-tracker-card.svg?style=for-the-badge
[maintenance-shield]: https://img.shields.io/maintenance/yes/2025.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/DidacChaves/rainfall-tracker-card.svg?style=for-the-badge
[releases]: https://github.com/DidacChaves/rainfall-tracker-card/releases
[downloads]: https://img.shields.io/github/downloads/DidacChaves/rainfall-tracker-card/total?style=for-the-badge
