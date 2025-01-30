import { useEffect, useRef, useState } from 'react'

interface Point {
  x: number
  y: number
}

interface ColorWheelProps {
  size?: number
  onColorSelect?: (color: string) => void
}

export default function ColorWheel({ size = 400, onColorSelect }: ColorWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedColor, setSelectedColor] = useState('#AA4C39')
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw color wheel
    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2 - 20

    for (let angle = 0; angle < 360; angle++) {
      const startAngle = (angle - 2) * Math.PI / 180
      const endAngle = (angle + 2) * Math.PI / 180

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()

      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      )

      const hue = angle
      gradient.addColorStop(0, '#FFFFFF')
      gradient.addColorStop(0.5, `hsl(${hue}, 100%, 50%)`)
      gradient.addColorStop(1, '#000000')

      ctx.fillStyle = gradient
      ctx.fill()
    }
  }, [size])

  const getColorAtPoint = (point: Point): string => {
    const canvas = canvasRef.current
    if (!canvas) return '#000000'

    const ctx = canvas.getContext('2d')
    if (!ctx) return '#000000'

    const pixel = ctx.getImageData(point.x, point.y, 1, 1).data
    return `#${[pixel[0], pixel[1], pixel[2]].map(x => x.toString(16).padStart(2, '0')).join('')}`
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const color = getColorAtPoint({ x, y })
    setSelectedColor(color)
    onColorSelect?.(color)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const color = getColorAtPoint({ x, y })
    setSelectedColor(color)
    onColorSelect?.(color)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="cursor-crosshair"
      />
      
      {/* Display the selected color */}
      <div className="absolute top-2 right-2 p-2 rounded bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div 
            className="w-6 h-6 rounded-full border"
            style={{ backgroundColor: selectedColor }}
          />
          <code className="text-sm">{selectedColor}</code>
        </div>
      </div>
    </div>
  );
}
