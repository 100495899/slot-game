import { Tween } from 'https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js';
import { BARx1, BARx2, BARx3, Cherry, IgnoreStartSymbolCount, ModeFixed, Seven } from './constants.js';
import { createEmptyArray, hexToObject } from './utils.mjs';

/**
 * import { Tween, Easing } from './types.mjs';
 * import { Reel } from './reel.mjs';
 */

/**
 * @description Slot Modes class. It's responsible for the slot modes
 *
 * @class Modes
 *
 * @constructor
 */
export function Modes(reel) {
  /**
   * @private
   * @readonly
   * @description Get random symbol from the reel symbols
   * @returns {ReelSymbol}
   */
  this.getRandomSymbol = () => {
    const totalSymbols = reel.symbolKeys.length;
    const randomIndex = Math.floor(Math.random() * totalSymbols);

    return reel.symbolKeys[randomIndex];
  };

  /**
   * @private
   * @readonly
   * @returns {void}
   */
  this.genReelSymbols = () => {
    const visibleBlocks = reel.options.rows;
    // Calculated to Y position to start the animation
    const startY = Math.abs((visibleBlocks + IgnoreStartSymbolCount - reel.totalBlocks) * reel.options.block.height);

    /**
     * @description Create an array of next symbols with their animation coordinates
     * @type {BlockType[]}
     */
    const nextSymbols = createEmptyArray(reel.totalBlocks).map((index) => {
      const coords = { yOffset: (index - reel.totalBlocks + visibleBlocks) * reel.options.block.height };
      const symbol = this.getRandomSymbol();
      const isFirst = index === 0;

      const animation = new Tween(coords)
        .to(
          {
            yOffset: startY + coords.yOffset,
          },
          reel.options.animationTime,
        )
        .easing(reel.options.animationFunction)
        .start();

      // Just one Tween event to handle the completion, they all will finish at the same time
      if (isFirst) {
        animation.onComplete(() => {
          reel.isSpinning = false;
        });
      }

      reel.animations.add(animation);

      const block = { ...reel.options.block }; // Copy the block options
      block.color = hexToObject(reel.options.color.background, 16);

      return {
        symbol,
        coords,
        block,
      };
    });
    // During the initial animation, there are no previous symbols to replace, so we use the nextSymbols array as a placeholder
    const prevSymbols = reel.blocks.length > 0 ? reel.blocks : nextSymbols;
    const size = prevSymbols.length;
    // Replace the last visible blocks on the nextSymbols array to keep the animation smooth
    for (let i = 0; i < visibleBlocks; i++) {
      nextSymbols[size - visibleBlocks + i].symbol = prevSymbols[i + IgnoreStartSymbolCount].symbol;
    }

    // Update the animation blocks
    reel.blocks = nextSymbols;
  };

  /**
   * @description Get fixed symbols from the reel options. We only replace the symbols that will be visible on the screen.
   * @private
   * @readonly
   */
  this.getFixedSymbols = (valores) => {
    for (let i = 0; i < reel.options.rows; i++) {
      console.log(i);
      console.log(valores);
      console.log(reel.options.fixedSymbols[i]);

      if (reel.options.fixedSymbols[i] === undefined) {
        reel.blocks[IgnoreStartSymbolCount + i].symbol = this.getRandomSymbol();
      }
      else if (reel.options.fixedSymbols[i] === null) {
        let simbolo = null;

        if ((valores[i][0] == BARx1 || valores[i][0] == BARx2 || valores[i][0] == BARx3) && (valores[i][1] == BARx1 || valores[i][1] == BARx2 || valores[i][1] == BARx3)){
          let eleccion = Math.floor(Math.random() * 2);
          if (eleccion == 0){
            simbolo = Cherry;
            console.log("cereza: " + simbolo);
          }
          else{
            simbolo = Seven;
            console.log("seven: " + simbolo);
          }
        }
        else{
        
          do {
            simbolo = this.getRandomSymbol();
            console.log("Simbolo: " + simbolo);
            console.log("Valores: " + valores[i]);
            
          } while (valores[i].includes(simbolo));

        }
        reel.blocks[IgnoreStartSymbolCount + i].symbol = simbolo;
      }
      else{
        reel.blocks[IgnoreStartSymbolCount + i].symbol = reel.options.fixedSymbols[i];
      }
    }
  };

  /**
   * @public
   * @readonly
   * @param {Mode} mode
   */
  this.genByMode = (mode, valores) => {
    this.genReelSymbols();
    if (mode === ModeFixed) {
      this.getFixedSymbols(valores);
    }
  };
}
