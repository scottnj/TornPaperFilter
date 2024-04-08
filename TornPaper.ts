/*!
 * TornPaper.js v0.0.1
 * Copyright(c)2024 Wakana Y.K./happy358
 * Site:https://github.com/happy358/TornPaper/
 * Released under the MIT license.
 * see https://github.com/happy358/TornPaper/blob/master/LICENSE
 */

// <script>
//     import TornPaper from 'TornPaper'
//     new TornPaper();
//     // or
//     new TornPaper({
//       seed:1, // default:random number
//       tornFrequency : 0.05,
//       tornScale : 10,
//       grungeFrequency : 0.03,
//       grungeScale : 3
//     });
// </script>

// <style>
//   .your-class {
//     filter: url(#filter_torn-paper);
//   }
//   .your-class {
//     filter: url(#filter_torn-paper);
//     background-color: peachpuff;
//   }
//   .your-class {
//     filter: url(#filter_torn-paper);
//     background: url("https://source.unsplash.com/random/") center/cover;
//   }
// </style>

export interface TornPaperOptions {
  seed: number
  grungeFrequency: number
  grungeScale: number
  tornFrequency: number
  tornScale: number
}

// noinspection JSUnusedGlobalSymbols
export class TornPaper {
  seed: number
  grungeFrequency: number
  grungeScale: number
  tornFrequency: number
  tornScale: number
  private SVG_ID: string = 'torn-paper'

  constructor(options: TornPaperOptions | null = null) {
    this.seed = Math.floor(
      1e7 * Math.random()
    )
    this.grungeFrequency = .03
    this.grungeScale = 3
    this.tornFrequency = .05
    this.tornScale = 10

    options?.seed && (this.seed = options.seed)
    options?.grungeFrequency && (this.grungeFrequency = options.grungeFrequency)
    options?.grungeScale && (this.grungeScale = options.grungeScale)
    options?.tornFrequency && (this.tornFrequency = options.tornFrequency)
    options?.tornScale && (this.tornScale = options.tornScale)

    this.style()
    this.tornPaper()
  }

  tornPaper() {
    const svgElement: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svgElement.id = this.SVG_ID
    svgElement.innerHTML = `
      <filter id="filter_torn-paper">
        <feTurbulence 
          type="fractalNoise" 
          baseFrequency="${this.grungeFrequency}" 
          result="paper_noise" 
          numOctaves="10" 
          seed="${this.seed}" />
        <feDiffuseLighting 
          in="paper_noise" 
          lighting-color="white" 
          surfaceScale="${this.grungeScale}" 
          result="paper">
          <feDistantLight 
            azimuth="45" 
            elevation="60" />
        </feDiffuseLighting>
        <feTurbulence 
          baseFrequency="${this.tornFrequency}" 
          type="turbulence" 
          numOctaves="10" 
          seed="${this.seed}" 
          result="edge_noise" />
        <feGaussianBlur 
          stdDeviation="0.5" 
          in="SourceAlpha" />
        <feMorphology 
          operator="erode" 
          radius="5" />
        <feOffset 
          dx="-2" 
          dy="-2" />
        <feDisplacementMap 
          scale="${this.tornScale}" 
          xChannelSelector="B" 
          yChannelSelector="G" 
          in2="edge_noise" 
          result="edge" />
        <feComposite 
          in="paper" 
          in2="edge" 
          operator="atop" 
          result="result_rough" />
        <feComposite 
          in="SourceGraphic" 
          in2="edge" 
          operator="atop" 
          result="result_sg" />
        <feBlend 
          mode="multiply" 
          in="result_rough" 
          in2="result_sg" />
      </filter>
    `
    document.body.appendChild(svgElement)
  }

  style() {
    const element: HTMLStyleElement = document.createElement('style')
    const styles: string = [
      'position: fixed;',
      'top: 0;',
      'left: 0;',
      'width: 0;',
      'height: 0;',
      'z-index: -1;'
    ].join(' ')
    document.head.appendChild(element)
    element.sheet?.insertRule(`svg#${this.SVG_ID}{${styles}}`)
  }
}
