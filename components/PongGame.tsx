"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/utils/utils"

type GameState = "idle" | "playing" | "paused" | "goal" | "gameover"

interface MatchResult {
  playerScore: number
  aiScore: number
  winner: "player" | "ai"
  date: string
}

const CANVAS_W = 800
const CANVAS_H = 600
const PADDLE_W = 12
const PADDLE_H = 80
const BALL_SIZE = 12
const WINNING_SCORE = 7
const AI_SPEED = 4.5
const BALL_SPEED_INITIAL = 5
const BALL_MAX_SPEED = 10
const PADDLE_SPEED = 6

const STORAGE_KEY = "voltris-pong-history"

function loadHistory(): MatchResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveHistory(history: MatchResult[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch { /* noop */ }
}

interface PongGameProps {
  onScoreChange?: (player: number, ai: number) => void
  onMatchEnd?: (result: MatchResult) => void
  className?: string
}

export default function PongGame({ onScoreChange, onMatchEnd, className }: PongGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const keysRef = useRef<Set<string>>(new Set())
  const mouseYRef = useRef<number | null>(null)
  const gameStateRef = useRef<GameState>("idle")
  const frameRef = useRef<number>(0)

  const playerYRef = useRef(CANVAS_H / 2 - PADDLE_H / 2)
  const aiYRef = useRef(CANVAS_H / 2 - PADDLE_H / 2)

  const ballRef = useRef({ x: CANVAS_W / 2, y: CANVAS_H / 2, dx: BALL_SPEED_INITIAL, dy: BALL_SPEED_INITIAL })
  const scoresRef = useRef({ player: 0, ai: 0 })
  const goalTimerRef = useRef<number>(0)
  const scaleRef = useRef(1)

  const [gameState, setGameState] = useState<GameState>("idle")
  const [scores, setScores] = useState({ player: 0, ai: 0 })
  const [matchHistory, setMatchHistory] = useState<MatchResult[]>(loadHistory())

  const scaleCanvas = useCallback(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const w = container.clientWidth
    const s = Math.min(w, CANVAS_W) / CANVAS_W
    scaleRef.current = s
    canvas.style.width = `${CANVAS_W * s}px`
    canvas.style.height = `${CANVAS_H * s}px`
  }, [])

  useEffect(() => {
    scaleCanvas()
    const onResize = () => scaleCanvas()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [scaleCanvas])

  const resetBall = useCallback((dir: 1 | -1) => {
    const b = ballRef.current
    b.x = CANVAS_W / 2
    b.y = CANVAS_H / 2
    b.dx = BALL_SPEED_INITIAL * dir
    b.dy = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2 + 2)
  }, [])

  const checkGoal = useCallback(() => {
    const b = ballRef.current
    if (b.x <= 0) {
      scoresRef.current.ai++
      setScores({ ...scoresRef.current })
      onScoreChange?.(scoresRef.current.player, scoresRef.current.ai)
      if (scoresRef.current.ai >= WINNING_SCORE) {
        gameStateRef.current = "gameover"
        setGameState("gameover")
        return
      }
      gameStateRef.current = "goal"
      setGameState("goal")
      goalTimerRef.current = 60
      resetBall(-1)
    } else if (b.x + BALL_SIZE >= CANVAS_W) {
      scoresRef.current.player++
      setScores({ ...scoresRef.current })
      onScoreChange?.(scoresRef.current.player, scoresRef.current.ai)
      if (scoresRef.current.player >= WINNING_SCORE) {
        gameStateRef.current = "gameover"
        setGameState("gameover")
        return
      }
      gameStateRef.current = "goal"
      setGameState("goal")
      goalTimerRef.current = 60
      resetBall(1)
    }
  }, [onScoreChange, resetBall])

  const updateBall = useCallback(() => {
    const b = ballRef.current
    b.x += b.dx
    b.y += b.dy

    if (b.y <= 0 || b.y + BALL_SIZE >= CANVAS_H) {
      b.dy *= -1
      b.y = b.y <= 0 ? 0 : CANVAS_H - BALL_SIZE
    }

    const playerRect = { x: 0, y: playerYRef.current, w: PADDLE_W, h: PADDLE_H }
    const aiRect = { x: CANVAS_W - PADDLE_W, y: aiYRef.current, w: PADDLE_W, h: PADDLE_H }

    const bx = b.x, by = b.y, bs = BALL_SIZE

    if (b.dx < 0 && bx <= playerRect.x + playerRect.w && bx + bs >= playerRect.x &&
        by + bs >= playerRect.y && by <= playerRect.y + playerRect.h) {
      b.dx = Math.min(Math.abs(b.dx) + 0.5, BALL_MAX_SPEED)
      const hit = (by + bs / 2 - (playerRect.y + playerRect.h / 2)) / (playerRect.h / 2)
      b.dy = hit * 5
      b.x = playerRect.x + playerRect.w
    }

    if (b.dx > 0 && bx + bs >= aiRect.x && bx <= aiRect.x + aiRect.w &&
        by + bs >= aiRect.y && by <= aiRect.y + aiRect.h) {
      b.dx = -Math.min(Math.abs(b.dx) + 0.5, BALL_MAX_SPEED)
      const hit = (by + bs / 2 - (aiRect.y + aiRect.h / 2)) / (aiRect.h / 2)
      b.dy = hit * 5
      b.x = aiRect.x - bs
    }

    checkGoal()
  }, [checkGoal])

  const updateAI = useCallback(() => {
    const target = ballRef.current.y + BALL_SIZE / 2
    const aiCenter = aiYRef.current + PADDLE_H / 2
    const diff = target - aiCenter

    if (Math.abs(diff) > 15) {
      aiYRef.current += Math.sign(diff) * AI_SPEED
    }
    aiYRef.current = Math.max(0, Math.min(CANVAS_H - PADDLE_H, aiYRef.current))
  }, [])

  const updatePlayer = useCallback(() => {
    const keys = keysRef.current
    let dy = 0
    if (keys.has("w") || keys.has("arrowup")) dy -= PADDLE_SPEED
    if (keys.has("s") || keys.has("arrowdown")) dy += PADDLE_SPEED

    if (dy !== 0) {
      playerYRef.current += dy
      mouseYRef.current = null
    } else if (mouseYRef.current !== null) {
      const s = scaleRef.current
      const target = mouseYRef.current / s - PADDLE_H / 2
      const diff = target - playerYRef.current
      if (Math.abs(diff) > 2) {
        playerYRef.current += Math.sign(diff) * Math.min(Math.abs(diff) * 0.3, PADDLE_SPEED)
      }
    }

    playerYRef.current = Math.max(0, Math.min(CANVAS_H - PADDLE_H, playerYRef.current))
  }, [])

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)

    ctx.fillStyle = "#0a0a0b"
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

    ctx.strokeStyle = "rgba(255,255,255,0.1)"
    ctx.lineWidth = 2
    ctx.setLineDash([10, 10])
    ctx.beginPath()
    ctx.moveTo(CANVAS_W / 2, 0)
    ctx.lineTo(CANVAS_W / 2, CANVAS_H)
    ctx.stroke()
    ctx.setLineDash([])

    const gradient = ctx.createLinearGradient(0, 0, CANVAS_W, 0)
    gradient.addColorStop(0, "#31A8FF")
    gradient.addColorStop(0.5, "#8B31FF")
    gradient.addColorStop(1, "#FF4B6B")

    ctx.fillStyle = gradient
    ctx.shadowColor = "#8B31FF"
    ctx.shadowBlur = 15
    ctx.fillRect(0, playerYRef.current, PADDLE_W, PADDLE_H)
    ctx.fillRect(CANVAS_W - PADDLE_W, aiYRef.current, PADDLE_W, PADDLE_H)
    ctx.shadowBlur = 0

    const b = ballRef.current
    ctx.fillStyle = "#ffffff"
    ctx.shadowColor = "#ffffff"
    ctx.shadowBlur = 20
    ctx.beginPath()
    ctx.arc(b.x + BALL_SIZE / 2, b.y + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0

    if (gameStateRef.current === "idle") {
      ctx.fillStyle = "rgba(255,255,255,0.8)"
      ctx.font = "bold 32px monospace"
      ctx.textAlign = "center"
      ctx.fillText("PONG", CANVAS_W / 2, CANVAS_H / 2 - 40)
      ctx.font = "18px monospace"
      ctx.fillStyle = "rgba(255,255,255,0.5)"
      ctx.fillText("Press SPACE or click to start", CANVAS_W / 2, CANVAS_H / 2 + 20)
    } else if (gameStateRef.current === "paused") {
      ctx.fillStyle = "rgba(0,0,0,0.5)"
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 32px monospace"
      ctx.textAlign = "center"
      ctx.fillText("PAUSED", CANVAS_W / 2, CANVAS_H / 2)
    } else if (gameStateRef.current === "gameover") {
      ctx.fillStyle = "rgba(0,0,0,0.7)"
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
      const won = scoresRef.current.player > scoresRef.current.ai
      ctx.fillStyle = won ? "#4ade80" : "#FF4B6B"
      ctx.font = "bold 40px monospace"
      ctx.textAlign = "center"
      ctx.fillText(won ? "YOU WIN!" : "AI WINS!", CANVAS_W / 2, CANVAS_H / 2 - 20)
      ctx.fillStyle = "rgba(255,255,255,0.6)"
      ctx.font = "18px monospace"
      ctx.fillText("Press SPACE to play again", CANVAS_W / 2, CANVAS_H / 2 + 30)
    }
  }, [])

  const gameLoop = useCallback(() => {
    if (gameStateRef.current === "playing") {
      updatePlayer()
      updateAI()
      updateBall()
    } else if (gameStateRef.current === "goal") {
      if (goalTimerRef.current > 0) {
        goalTimerRef.current--
      } else {
        gameStateRef.current = "playing"
        setGameState("playing")
      }
    }

    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) draw(ctx)
    }

    frameRef.current = requestAnimationFrame(gameLoop)
  }, [draw, updateAI, updateBall, updatePlayer])

  useEffect(() => {
    frameRef.current = requestAnimationFrame(gameLoop)
    return () => cancelAnimationFrame(frameRef.current)
  }, [gameLoop])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase())
      if (e.key === " ") {
        e.preventDefault()
        const gs = gameStateRef.current
        if (gs === "idle" || gs === "gameover") {
          if (gs === "gameover") {
            const result: MatchResult = {
              playerScore: scoresRef.current.player,
              aiScore: scoresRef.current.ai,
              winner: scoresRef.current.player > scoresRef.current.ai ? "player" : "ai",
              date: new Date().toISOString(),
            }
            const updated = [result, ...matchHistory].slice(0, 50)
            setMatchHistory(updated)
            saveHistory(updated)
            onMatchEnd?.(result)
          }
          scoresRef.current = { player: 0, ai: 0 }
          setScores({ player: 0, ai: 0 })
          playerYRef.current = CANVAS_H / 2 - PADDLE_H / 2
          aiYRef.current = CANVAS_H / 2 - PADDLE_H / 2
          resetBall(Math.random() > 0.5 ? 1 : -1)
          gameStateRef.current = "playing"
          setGameState("playing")
        } else if (gs === "playing") {
          gameStateRef.current = "paused"
          setGameState("paused")
        } else if (gs === "paused") {
          gameStateRef.current = "playing"
          setGameState("playing")
        }
      }
    }
    const onKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key.toLowerCase())
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
    }
  }, [matchHistory, onMatchEnd, resetBall])

  const onCanvasClick = useCallback(() => {
    const gs = gameStateRef.current
    if (gs === "idle" || gs === "gameover") {
      if (gs === "gameover") {
        const result: MatchResult = {
          playerScore: scoresRef.current.player,
          aiScore: scoresRef.current.ai,
          winner: scoresRef.current.player > scoresRef.current.ai ? "player" : "ai",
          date: new Date().toISOString(),
        }
        const updated = [result, ...matchHistory].slice(0, 50)
        setMatchHistory(updated)
        saveHistory(updated)
        onMatchEnd?.(result)
      }
      scoresRef.current = { player: 0, ai: 0 }
      setScores({ player: 0, ai: 0 })
      playerYRef.current = CANVAS_H / 2 - PADDLE_H / 2
      aiYRef.current = CANVAS_H / 2 - PADDLE_H / 2
      resetBall(Math.random() > 0.5 ? 1 : -1)
      gameStateRef.current = "playing"
      setGameState("playing")
    } else if (gs === "paused") {
      gameStateRef.current = "playing"
      setGameState("playing")
    }
  }, [matchHistory, onMatchEnd, resetBall])

  const onCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      mouseYRef.current = (e.clientY - rect.top) * (CANVAS_H / rect.height)
    }
  }, [])

  const onCanvasTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const touch = e.touches[0]
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect && touch) {
      mouseYRef.current = (touch.clientY - rect.top) * (CANVAS_H / rect.height)
    }
  }, [])

  return (
    <div ref={containerRef} className={cn("w-full max-w-[800px] mx-auto", className)}>
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        onClick={onCanvasClick}
        onMouseMove={onCanvasMouseMove}
        onTouchMove={onCanvasTouchMove}
        className="rounded-2xl cursor-pointer w-full h-auto shadow-2xl border border-white/10"
        style={{ touchAction: "none" }}
      />
    </div>
  )
}

export type { MatchResult }
