/**
 * Chess Board Shortcode for AMP
 * Embeds the amp-script component for interactive chess
 * @module shortcodes/chessBoard
 */

interface ChessBoardOptions {
    fen?: string;
    id?: string;
}

/**
 * Generates an AMP-compatible chess board component
 * @param options - Configuration options for the chess board
 * @returns HTML string containing the amp-script chess board component
 */
export function chessBoard(options: ChessBoardOptions = {}): string {
    const { fen = 'start', id = 'chess-board-1' } = options;

    // Layout needs fixed height for amp-script usually, or responsive with ratio
    return `
    <amp-script layout="responsive" width="300" height="300" script="chess-worker" class="chess-board">
        <div id="${id}" class="board-container">
            <div id="status">Ready</div>
            <div class="board" data-fen="${fen}">
                <!-- Board rendering placeholder -->
                <button id="play-btn">Make Move</button>
            </div>
        </div>
    </amp-script>
    <script id="chess-worker" type="text/plain" target="amp-script">
        /**
         * Inline worker code or reference to external
         * For external: <script src="..."> but amp-script requires specific headers
         * We used inline for simplicity in this demo template,
         * but typically we serve the worker file.
         */
        // Logic from ChessBoard.worker.js would be inlined or served.
    </script>
    `;
}
