export const Tokens = {
    ColorBackground: '#000000',
} as const;

export function GlobalStyles()
{
    return <style style={{ display: 'none' }}>{GlobalCss}</style>;
}

const GlobalCss = `
    :root {
        color-scheme: dark;
        background: ${Tokens.ColorBackground};
    }

    * {
        box-sizing: border-box;
    }

    html,
    body,
    #root,
    .AppShell,
    .TrackingPanel,
    .PreviewSection,
    .PreviewViewport {
        width: 100%;
        height: 100%;
        margin: 0;
        overflow: hidden;
        background: ${Tokens.ColorBackground};
    }

    .PreviewViewport {
        position: relative;
    }

    .PreviewViewport video {
        position: absolute;
        width: 1px;
        height: 1px;
        opacity: 0;
        pointer-events: none;
    }

    .PreviewViewport canvas {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
        background: ${Tokens.ColorBackground};
    }
`;
