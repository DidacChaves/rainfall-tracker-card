import { css } from 'lit'

export default css`
  .with-fixed-footer {
    overflow: hidden;
  }

  ha-card {
    height: 100%;
    padding: 16px 0;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    outline: 0;
    position: relative;
  }

  .header {
    display: flex;
    padding: 0 16px 16px;
    justify-content: space-between;
    position: relative;
    z-index: 1;
    font-size: 14px;

    .name {
      color: var(--secondary-text-color);
      font-size: 1.2em;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding-right: 5px;
      text-shadow: 1px 1px 2px var(--ha-card-background);
    }
    
    .ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .icon {
      color: var(--paper-item-icon-color, #44739e);
      --state-inactive-color: var(--paper-item-icon-color, #44739e);
    }
  }

  .info {
    display: flex;
    padding: 0 16px 16px;
    font-weight: 300;
    align-items: flex-start;
    justify-content: space-between;
    line-height: 30px;

    .value {
      font-size: 2.4em;
      margin-right: .25rem;
      font-weight: 300;
      text-shadow: 0 0 4px var(--ha-card-background);
    }

    .measurement {
      font-size: 1.4em;
      font-weight: 400;
      opacity: .6;
      text-shadow: 0 0 4px var(--ha-card-background);
    }

    .value2 {
      font-size: 2.0em;
      margin-right: .25rem;
      font-weight: 300;
      text-shadow: 0 0 4px var(--ha-card-background);
    }

    .measurement2 {
      font-size: 1.1em;
      font-weight: 400;
      opacity: .6;
      text-shadow: 0 0 4px var(--ha-card-background);
    }
  }

  .footer {
    overflow: hidden;
    position: absolute;
    height: 100%;
    right: 0;
    left: 0;
    bottom: 0;
    border-radius: var(--ha-card-border-radius, 12px);
    border-top-right-radius: 0;
    border-top-left-radius: 0;
  }

  .waves {
    position: relative;
    height: 100%;
    width: 100%;
    margin-bottom: -7px; /*Fix for safari gap*/
    min-height: 100px;
    max-height: 100%;
    transition: height 0.5s ease-in-out;
  }

  .parallax > use {
    animation: move-forever 25s cubic-bezier(.55, .5, .45, .5) infinite;
  }

  .parallax > use:nth-child(1) {
    animation-delay: -2s;
    animation-duration: 7s;
  }

  .parallax > use:nth-child(2) {
    animation-delay: -4s;
    animation-duration: 10s;
  }

  .parallax > use:nth-child(3) {
    animation-delay: -6s;
    animation-duration: 13s;
  }

  .parallax > use:nth-child(4) {
    animation-delay: -7s;
    animation-duration: 20s;
  }

  @keyframes move-forever {
    0% {
      transform: translate3d(-90px, 0, 0);
    }
    100% {
      transform: translate3d(85px, 0, 0);
    }
  }


  hr {
    width: 0;
    border-color: transparent;
    border-right-color: rgba(123, 156, 232, 0.7);
    border-right-width: 30px;
    position: absolute;
    bottom: 100%;
    transform-origin: 100% 50%;
    animation-name: rain;
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  @keyframes rain {
    from {
      transform: rotate(93deg) translateX(0);
    }
    to {
      transform: rotate(93deg) translateX(530px);
    }
  }
`;
