# Rainfall tracker card by [@DidacChaves](https://www.github.com/DidacChaves)

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)

![Downloads][downloads]
![Project Maintenance][maintenance-shield]
[![GitHub Activity][commits-shield]][commits]

[![Community Forum][forum-shield]][forum]

🌧️ Rainfall Tracker: Custom Home Assistant card to display current and accumulated rainfall data in a clear and interactive way.

![Default](https://github.com/didacchaves/rainfall-tracker-card/blob/master/docs/images/rain-meter-card.png?raw=true)

## Options

| Name              | Type    | Requirement  | Description                                     | Default             |
| ----------------- | ------- | ------------ |-------------------------------------------------|---------------------|
| type              | string  | **Required** | `custom:rainfall-tracker-card`                  |                     | 
| name              | string  | **Optional** | Card name                                       | `Rainfall Tracker`  |
| show_error        | boolean | **Optional** | Show what an error looks like for the card      | `false`             |
| show_warning      | boolean | **Optional** | Show what a warning looks like for the card     | `false`             |
| entity            | string  | **Optional** | Home Assistant entity ID.                       | `none`              |
| tap_action        | object  | **Optional** | Action to take on tap                           | `action: more-info` |
| hold_action       | object  | **Optional** | Action to take on hold                          | `none`              |
| double_tap_action | object  | **Optional** | Action to take on double tap                    | `none`              |

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
```
