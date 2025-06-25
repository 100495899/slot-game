import { BARx1, BARx2, BARx3, Cherry, ModeFixed, Seven, CherryOrSeven, AllSame, AnyBar } from './constants.js';
import { Easing } from 'https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js';
import { AssetLoader } from './loader.mjs';
import { Slot } from './slot.mjs';
import { Engine } from './engine.mjs';
// import { configureTweakPane } from './gui.mjs';
import { payTable } from './payTable.mjs';
import { createPayTable } from './utils.mjs';

const config = {
  assets: [],
  symbols: [],
  ui: {
    canvas: document.querySelector('#slot'),
    btn: {
      spinManual: document.querySelector('#spin-manual'),
      spinAuto: document.querySelector('#spin-auto'),
      minusBet: document.querySelector('#minus-bet'),
      plusBet: document.querySelector('#plus-bet'),
    },
    text: {
      credits: document.querySelector('#credits'),
      bet: document.querySelector('#bet'),
      winAmount: document.querySelector('#win-amount'),
    },
    modalBody: document.querySelector('#pay-table-modal .modal-body'),
  },
};

const assetLoader = new AssetLoader([
  './img/FIAT-PEUGOT.png',
  './img/PSA.png',
  './img/FCA.png',
  './img/BLANCO.png',
  './img/AZUL.png',
]);

assetLoader.onLoadFinish((assets) => {
  console.info('All assets loaded', assets);

  const symbols = {
    [BARx1]: assets.find(({ name }) => name === 'FIAT-PEUGOT').img,
    [BARx2]: assets.find(({ name }) => name === 'PSA').img,
    [BARx3]: assets.find(({ name }) => name === 'FCA').img,
    [Seven]: assets.find(({ name }) => name === 'BLANCO').img,
    [Cherry]: assets.find(({ name }) => name === 'AZUL').img,
  };

  const slot = new Slot({
    player: {
      credits: tiradas,
      bet: 1,
      MAX_BET: 15,
    },
    volume: {
      background: 0.02,
      win: 0.3,
      spin: 0.1,
    },
    canvas: config.ui.canvas,
    buttons: config.ui.btn,
    text: config.ui.text,
    mode: ModeFixed,
    fixedSymbols: [],
    color: {
      background: '#ffffff', // fondo blanco real
      border: '#0075f6',
    },
    reel: {
      rows: 3,
      cols: 3,
      animationTime: 1500,
      animationFunction: Easing.Back.Out,
      padding: {
        x: 1,
      },
    },
    block: {
      width: 141,
      height: 121,
      lineWidth: 0,
      padding: 16,
    },
    symbols,
  });

  const engine = new Engine(slot, { FPS: 60 });

  // -- AUTENTICACIÓN API --
  async function api_login() {
    try {
      const response = await fetch('api_proxy.php?action=api_login', { method: 'POST' });
      if (!response.ok) throw new Error('Error en proxy');
      return await response.text();
    } catch (error) {
      console.error('Error en login:', error);
      return null;
    }
  }

  async function momento_ganador(token) {
    try {
      const response = await fetch(`api_proxy.php?action=momento_ganador&token=${token}&name=${id}`, { method: 'POST' });
      if (!response.ok) throw new Error('Error en proxy');
      return await response.text();
    } catch (error) {
      console.error('Error en obtener momento ganador:', error);
      return null;
    }
  }

  function setResultForNextSpin(premio) {
    if (!slot.player.hasEnoughCredits()) return;
    if (slot.isSpinning || slot.checking) return;

    const mapping = {
      'Premio 1': [null, BARx1, null],
      'Premio 2': [null, BARx2, null],
      'Premio 3': [null, BARx3, null],
      'Premio 4': [null, Seven, null],
      'Premio 5': [null, Cherry, null],
    };

    slot.options.fixedSymbols = mapping[premio] || [null, null, null];
    slot.reset();
  }

  let value = null;
  api_login().then((token) => {
    value = token;
  });

  let momento = false;

  slot.subscribeSpinButton = function () {
    const options = this.options;
    options.buttons.spinManual.onclick = () => {
      if (!this.player.hasEnoughCredits() || momento) return;
      document.getElementById('spin-giro').classList.add('d-none');
      document.getElementById('spin-loading').classList.remove('d-none');
      momento = true;
      momento_ganador(value).then((result) => {
        let premioObj = JSON.parse(result);
        const premio = premioObj.prize?.prize ?? null;

        setResultForNextSpin(premio);
        this.spin();
        document.getElementById('spin-loading').classList.add('d-none');
        document.getElementById('spin-giro').classList.remove('d-none');
        momento = false;

        if (premio !== null) {
          const formData = new FormData();
          formData.append('module', 'promos');
          formData.append('reference_id', '1');
          formData.append('id', id);
          formData.append('premio', premio);
          formData.append('token', value);

          fetch('api_proxy.php?action=guardar_premio', {
            method: 'POST',
            body: formData
          }).catch(error => {console.error('Error guardando premio:', error);
          document.getElementById('spin-loading').classList.add('d-none');
          document.getElementById('spin-giro').classList.remove('d-none');
        });
        }

        this.player.onWin(0);
      });
    };
  };

  slot.updateCanvasSize();

  // ✅ Limpia el canvas con fondo blanco al inicio
  const ctx = config.ui.canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, config.ui.canvas.width, config.ui.canvas.height);

  slot.subscribeEvents();
  engine.start();

  // configureTweakPane(slot, engine);
  createPayTable(symbols, payTable, config.ui.modalBody);
});

assetLoader.start();
