import { BARx1, BARx2, BARx3, Cherry, ModeFixed, Seven, CherryOrSeven, AllSame, AnyBar} from './constants.js';
import { Easing } from 'https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js';
import { AssetLoader } from './loader.mjs';
import { Slot } from './slot.mjs';
import { Engine } from './engine.mjs';
//import { configureTweakPane } from './gui.mjs';
import { payTable } from './payTable.mjs';
import { createPayTable } from './utils.mjs';

/**
 * @import {ReelSymbols} from './reel.mjs';
 */

const config = {
  assets: [],
  symbols: [],
  ui: {
    /**
     * @type {HTMLCanvasElement}
     */
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
    modalBody: document.querySelector(`#pay-table-modal .modal-body`),
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

  /**
   * @type {ReelSymbols}
   */
  const symbols = {
    [BARx1]: assets.find(({ name }) => name === 'FIAT-PEUGOT').img,
    [BARx2]: assets.find(({ name }) => name === 'PSA').img,
    [BARx3]: assets.find(({ name }) => name === 'FCA').img,
    [Seven]: assets.find(({ name }) => name === 'BLANCO').img,
    [Cherry]: assets.find(({ name }) => name ===  'AZUL').img,
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
    fixedSymbols:  [],
    color: {
      background: '#1a1a1a',
      border: '#1f2023',
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

  // --- INICIO de tu lógica de amaño ---
  async function api_login() {
    try {
      const response = await fetch('api_proxy.php?action=api_login', { method: 'POST' });
      if (!response.ok) throw new Error('Error en proxy');
      const token = await response.text(); // o .json() según respuesta
      console.log(token);
      return token;
    } catch (error) {
      console.error('Error en login:', error);
      return null;
    }

  }


    async function momento_ganador(valor) {
    try {
      console.log('Llamando a momento_ganador con token:', valor);
      const response = await fetch(`api_proxy.php?action=momento_ganador&token=${valor}&name=${id}`, { method: 'POST' });
      if (!response.ok) throw new Error('Error en proxy');
      const resultado = await response.text(); // o .json() según respuesta
      console.log(resultado);
      return resultado;
    } catch (error) {
      console.error('Error en obtener_momento_ganador:', error);
      return null;
    }

  }


  function setResultForNextSpin(premio) {

    if (!slot.player.hasEnoughCredits()) return;
    if (slot.isSpinning || slot.checking) return;

    if (premio == 'Premio 1') {
      slot.options.fixedSymbols = [
        null, BARx1, null
      ];
    } else if (premio == 'Premio 2') {
      slot.options.fixedSymbols = [
        null, BARx2, null
      ];
    }  else if (premio == 'Premio 3') {
      slot.options.fixedSymbols = [
        null, BARx3, null
      ];
    } else if (premio == 'Premio 4') {
      slot.options.fixedSymbols = [
        null, Seven, null
      ];
    } else if (premio == 'Premio 5') {
      slot.options.fixedSymbols = [
        null, Cherry, null
      ];
    }else{
      slot.options.fixedSymbols = [
        null, null, null
      ];
    }

    slot.reset();
  }

  let value = null;
  var token = api_login();
  token.then((valor) => {
      console.log('Token obtenido:', valor);
      value = valor;
    });


  
  // 3. Sobrescribe el método subscribeSpinButton
  slot.subscribeSpinButton = function () {
    const options = this.options;
    options.buttons.spinManual.onclick = () => {
      if (!this.player.hasEnoughCredits()) return;
      let resultado = momento_ganador(value);
      resultado.then((result) => {
        let premioObj = JSON.parse(result);
        const premio = premioObj.prize && typeof premioObj.prize === 'object'
          ? premioObj.prize.prize
          : null;

        setResultForNextSpin(premio);
        console.log('Spin button clicked');
        this.spin();
        console.log(`Premio obtenido`);
        
        this.player.onWin(0);
      });

    };
  };

  slot.updateCanvasSize();
  slot.subscribeEvents();

  engine.start();

  //configureTweakPane(slot, engine);
  createPayTable(symbols, payTable, config.ui.modalBody);
});

assetLoader.start();
