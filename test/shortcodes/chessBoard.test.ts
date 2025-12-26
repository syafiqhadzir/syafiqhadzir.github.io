import { describe, it, expect } from 'vitest';
import { chessBoard } from '../../src/shortcodes/chessBoard';

describe('chessBoard shortcode', () => {
    it('generates amp-script component', () => {
        const result = chessBoard();
        expect(result).toContain('<amp-script');
        expect(result).toContain('script="chess-worker"');
        expect(result).toContain('layout="responsive"');
        expect(result).toContain('class="chess-board"');
    });

    it('uses custom fen string', () => {
        const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
        const result = chessBoard({ fen });
        expect(result).toContain(`data-fen="${fen}"`);
    });

    it('uses custom id', () => {
        const id = 'my-board';
        const result = chessBoard({ id });
        expect(result).toContain(`id="${id}"`);
    });
});
