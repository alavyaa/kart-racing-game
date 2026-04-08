import { GAME_CONFIG } from '../utils/constants';

export class InputHandler {
  constructor() {
    this.inputState = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      drift: false,
    };

    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  handleKeyDown(event) {
    switch (event.key.toLowerCase()) {
      case 'w':
      case 'arrowup':
        this.inputState.forward = true;
        event.preventDefault();
        break;
      case 's':
      case 'arrowdown':
        this.inputState.backward = true;
        event.preventDefault();
        break;
      case 'a':
      case 'arrowleft':
        this.inputState.left = true;
        event.preventDefault();
        break;
      case 'd':
      case 'arrowright':
        this.inputState.right = true;
        event.preventDefault();
        break;
      case ' ':
        this.inputState.drift = true;
        event.preventDefault();
        break;
      default:
        break;
    }
  }

  handleKeyUp(event) {
    switch (event.key.toLowerCase()) {
      case 'w':
      case 'arrowup':
        this.inputState.forward = false;
        event.preventDefault();
        break;
      case 's':
      case 'arrowdown':
        this.inputState.backward = false;
        event.preventDefault();
        break;
      case 'a':
      case 'arrowleft':
        this.inputState.left = false;
        event.preventDefault();
        break;
      case 'd':
      case 'arrowright':
        this.inputState.right = false;
        event.preventDefault();
        break;
      case ' ':
        this.inputState.drift = false;
        event.preventDefault();
        break;
      default:
        break;
    }
  }

  getInputState() {
    return { ...this.inputState };
  }

  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
  }
}