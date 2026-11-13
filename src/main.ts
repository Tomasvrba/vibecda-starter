import './style.css';

// Both engines ship in the default workspace. Load the one selected in the page.
if (new URLSearchParams(location.search).get('demo') === '3d') {
  import('./three-game').catch(error => {
    document.querySelector('#score')!.textContent = '3D could not start. Try a current browser with WebGL 2 enabled.';
    console.error(error);
  });
} else {
  document.querySelector('a[href="?demo=2d"]')?.setAttribute('aria-current', 'page');
  import('./phaser-game');
}
