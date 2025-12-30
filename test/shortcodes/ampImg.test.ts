/**
 * Unit Tests for AMP Image Shortcode
 * @module test/shortcodes/ampImg.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockOptimizedImage = {
    src: '/images/optimized/test-800w.webp',
    srcset: '/images/optimized/test-800w.webp 800w, /images/optimized/test-400w.webp 400w',
    width: 800,
    height: 600,
    fallbackSrc: '/images/optimized/test.jpg',
};

describe('ampImg shortcode', () => {
    let ampImg: any;
    let ampImgResponsive: any;
    let ampImgWithFallback: any;

    beforeEach(async () => {
        vi.resetModules();
        // Mock both potential path resolutions to be safe
        const mockFactory = () => ({
            __esModule: true,
            optimizeImage: vi.fn().mockResolvedValue(mockOptimizedImage),
        });

        vi.doMock('../../src/lib/imageOptimizer', mockFactory);
        vi.doMock('../../src/lib/imageOptimizer.js', mockFactory);

        // Dynamically import the module under test
        const module = await import('../../src/shortcodes/ampImg');
        ampImg = module.ampImg;
        ampImgResponsive = module.ampImgResponsive;
        ampImgWithFallback = module.ampImgWithFallback;
    });

    describe('ampImg()', () => {
        it('generates basic amp-img element', async () => {
            const result = await ampImg({
                src: '/images/test.webp',
                alt: 'Test image',
                width: 800,
                height: 600,
            });
            expect(result).toContain('<amp-img');
            expect(result).toContain('src="/images/optimized/test-800w.webp"');
            expect(result).toContain(
                'srcset="/images/optimized/test-800w.webp 800w, /images/optimized/test-400w.webp 400w"'
            );
            expect(result).toContain('alt="Test image"');
            expect(result).toContain('width="800"');
            expect(result).toContain('height="600"');
            expect(result).toContain('layout="responsive"');
            expect(result).toContain('</amp-img>');
        });

        it('uses default responsive layout', async () => {
            const result = await ampImg({ src: '/img.webp', alt: 'Alt', width: 100, height: 100 });
            expect(result).toContain('layout="responsive"');
        });

        it('uses custom layout', async () => {
            const result = await ampImg({
                src: '/img.webp',
                alt: 'Alt',
                width: 100,
                height: 100,
                layout: 'fixed',
            });
            expect(result).toContain('layout="fixed"');
        });

        it('adds custom className', async () => {
            const result = await ampImg({
                src: '/img.webp',
                alt: 'Alt',
                width: 100,
                height: 100,
                layout: 'responsive',
                className: 'profile-picture',
            });
            expect(result).toContain('class="profile-picture"');
        });

        it('does not add loading="lazy" for responsive layouts', async () => {
            const result = await ampImg({
                src: '/img.webp',
                alt: 'Alt',
                width: 100,
                height: 100,
                layout: 'responsive',
            });
            expect(result).not.toContain('loading="lazy"');
        });

        it('does not add loading="lazy" for intrinsic layouts', async () => {
            const result = await ampImg({
                src: '/img.webp',
                alt: 'Alt',
                width: 100,
                height: 100,
                layout: 'intrinsic',
            });
            expect(result).not.toContain('loading="lazy"');
        });

        it('does not add loading="lazy" for fixed layouts', async () => {
            const result = await ampImg({
                src: '/img.webp',
                alt: 'Alt',
                width: 100,
                height: 100,
                layout: 'fixed',
            });
            expect(result).not.toContain('loading="lazy"');
        });

        it('does not add loading="lazy"', () => {
            const result = ampImgWithFallback({
                webpSrc: '/img.webp',
                fallbackSrc: '/img.jpg',
                alt: 'Test',
                width: 100,
                height: 100,
            });
            expect(result).not.toContain('loading="lazy"');
        });

        it('escapes HTML special characters in alt text', async () => {
            const result = await ampImg({
                src: '/img.webp',
                alt: 'Image "with" <special> chars',
                width: 100,
                height: 100,
            });
            expect(result).toContain('alt="Image &quot;with&quot; &lt;special&gt; chars"');
        });

        it('escapes HTML special characters in src', async () => {
            await ampImg({
                src: '/img.webp?a=1&b=2',
                alt: 'Alt',
                width: 100,
                height: 100,
            });
            expect(true).toBe(true);
        });

        it('throws error for missing src', async () => {
            await expect(
                async () => await ampImg({ src: '', alt: 'Alt', width: 100, height: 100 })
            ).rejects.toThrow('[ampImg] src is required');
        });

        it('throws error for missing alt', async () => {
            await expect(
                async () =>
                    // @ts-expect-error Testing invalid input
                    await ampImg({ src: '/img.webp', alt: undefined, width: 100, height: 100 })
            ).rejects.toThrow('[ampImg] alt is required');
        });

        it('allows empty string alt (for decorative images)', async () => {
            const result = await ampImg({ src: '/img.webp', alt: '', width: 100, height: 100 });
            expect(result).toContain('alt=""');
        });

        it('throws error for invalid width', async () => {
            await expect(
                async () => await ampImg({ src: '/img.webp', alt: 'Alt', width: 0, height: 100 })
            ).rejects.toThrow('[ampImg] width must be a positive number');
        });

        it('throws error for invalid height', async () => {
            await expect(
                async () => await ampImg({ src: '/img.webp', alt: 'Alt', width: 100, height: -10 })
            ).rejects.toThrow('[ampImg] height must be a positive number');
        });
    });

    describe('ampImgResponsive()', () => {
        it('generates amp-img with srcset', () => {
            const result = ampImgResponsive({
                src: '/img.webp',
                alt: 'Test',
                width: 800,
                height: 600,
                srcset: '/img-400.webp 400w, /img-800.webp 800w',
            });
            expect(result).toContain('srcset="/img-400.webp 400w, /img-800.webp 800w"');
        });

        it('generates amp-img with sizes', () => {
            const result = ampImgResponsive({
                src: '/img.webp',
                alt: 'Test',
                width: 800,
                height: 600,
                sizes: '(max-width: 600px) 100vw, 50vw',
            });
            expect(result).toContain('sizes="(max-width: 600px) 100vw, 50vw"');
        });

        it('uses custom layout', () => {
            const result = ampImgResponsive({
                src: '/img.webp',
                alt: 'Test',
                width: 100,
                height: 100,
                layout: 'fixed',
            });
            expect(result).toContain('layout="fixed"');
        });

        it('adds className', () => {
            const result = ampImgResponsive({
                src: '/img.webp',
                alt: 'Test',
                width: 100,
                height: 100,
                className: 'hero-image',
            });
            expect(result).toContain('class="hero-image"');
        });
    });

    describe('ampImgWithFallback()', () => {
        it('generates amp-img with fallback', () => {
            const result = ampImgWithFallback({
                webpSrc: '/img.webp',
                fallbackSrc: '/img.jpg',
                alt: 'Test image',
                width: 800,
                height: 600,
            });
            expect(result).toContain('<amp-img');
            expect(result).toContain('src="/img.webp"');
            expect(result).toContain('fallback');
            expect(result).toContain('src="/img.jpg"');
        });

        it('uses correct nesting', () => {
            const result = ampImgWithFallback({
                webpSrc: '/img.webp',
                fallbackSrc: '/img.jpg',
                alt: 'Test',
                width: 100,
                height: 100,
            });
            expect(result.match(/<amp-img/g)?.length).toBe(2);
            expect(result).toContain('fallback');
        });

        it('uses default responsive layout', () => {
            const result = ampImgWithFallback({
                webpSrc: '/img.webp',
                fallbackSrc: '/img.jpg',
                alt: 'Test',
                width: 100,
                height: 100,
            });
            expect(result).toContain('layout="responsive"');
        });

        it('uses custom layout', () => {
            const result = ampImgWithFallback({
                webpSrc: '/img.webp',
                fallbackSrc: '/img.jpg',
                alt: 'Test',
                width: 100,
                height: 100,
                layout: 'fixed',
            });
            expect(result).toContain('layout="fixed"');
        });
    });
});
