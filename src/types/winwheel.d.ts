declare module 'winwheel' {
  interface WinwheelOptions {
    canvasId: string
    numSegments: number
    segments: Array<{
      fillStyle: string
      text: string
      textFontSize: number
      textFillStyle: string
      textFontFamily: string
      textFontWeight: string
      textOrientation: string
      textAlignment: string
      textMargin: number
      size: number
      prize: any
      segmentNumber: number
    }>
    outerRadius: number
    centerX: number
    centerY: number
    innerRadius: number
    drawMode: string
    drawText: boolean
    textFontSize: number
    textOrientation: string
    textAlignment: string
    textMargin: number
    textFontFamily: string
    textFontWeight: string
    textFillStyle: string
    strokeStyle: string
    lineWidth: number
    clearTheCanvas: boolean
    animation: {
      type: string
      duration: number
      spins: number
      callbackFinished: (indicatedSegment: any) => void
      callbackAfter: () => void
    }
    pointerAngle: number
    ctx: CanvasRenderingContext2D
  }

  interface Winwheel {
    ctx: CanvasRenderingContext2D
    segments: Array<{
      segmentNumber: number
      prize: any
    }>
    animation: {
      stopAngle: number
    }
    startAnimation: () => void
    stopAnimation: () => void
  }

  class Winwheel {
    constructor(options: WinwheelOptions)
  }

  export default Winwheel
} 