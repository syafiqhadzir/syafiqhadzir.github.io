/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
/**
 * Chess Board Worker for AMP Script
 * Handles chess logic in a Web Worker to keep main thread free
 * @module components/chessBoardWorker
 */

/** @type {{ turn: string; fen: string }} */
const boardState = {
    turn: 'white',
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
};

/**
 * Handle incoming messages from main thread
 * @param {MessageEvent} event - Message event from main thread
 */
function handleMessage(event) {
    const data = event.data;

    if (data.action === 'move') {
        // Validate and apply move
        // This is where heavy chess logic would live
        console.log(`Processing move: ${String(data.move)}`);

        // Update board state
        boardState.turn = boardState.turn === 'white' ? 'black' : 'white';

        // Post update back to DOM via AMP Worker DOM
        const statusEl = document.querySelector('#status');
        if (statusEl) {
            statusEl.textContent = `Moved: ${String(data.move)}`;
        }
    }
}

// AMP Script entry point - self is defined in worker context
// @ts-expect-error - self is available in Web Worker context
if (typeof self !== 'undefined' && self.addEventListener) {
    // @ts-expect-error - postMessage origin validation handled by AMP runtime
    self.addEventListener('message', handleMessage);
}

// DOM interaction example
const button = document.querySelector('#play-btn');
if (button) {
    button.addEventListener('click', () => {
        const statusEl = document.querySelector('#status');
        if (statusEl) {
            statusEl.textContent = 'Thinking...';
        }
    });
}
