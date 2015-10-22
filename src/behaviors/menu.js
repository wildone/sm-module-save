const easings = simpla.constants.easings;

export default {
  observers: [
    '_toggleMenu(menuActive)'
  ],

  _toggleMenu(menuActive) {
    if (menuActive){
      this._openMenu();
    } else {
      this._closeMenu();
    }
  },

  get _menuAnimation() {
    let menu = this.$.menu;

    return {
      target: menu,
      frames: [
        { transform: 'translateY(-100%)' },
        { transform: 'translateY(0)' }
      ],
      opts: {
        open: {
          easing: easings.easeOutBack,
          fill: 'both',
          duration: 200,
          delay: 15
        },
        close: {
          easing: easings.easeOutCubic,
          fill: 'both',
          duration: 180
        }
      }
    }
  },

  _openMenu(){
    let { target, frames, opts } = this._menuAnimation;

    this.toggleAttribute('visible', true, target);
    target.animate(frames, opts.open);
  },

  _closeMenu() {
    let { target, frames, opts } = this._menuAnimation,
        animation;

    animation = target.animate(frames.reverse(), opts.close);
    animation.onfinish = () => {
      this.toggleAttribute('visible', false, target);
    }

  }

};
