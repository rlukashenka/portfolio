import { useCallback, useEffect, useRef, useState } from 'react'
import { useReadLocalStorage } from 'usehooks-ts'
import { THEME_STORAGE_KEY } from '~constants/theme'

type BlobNode = {
    x: number
    y: number
    vx: number
    vy: number
    mass: number
    restMass: number
    rPhase: number
    wobbleA: number
    wobbleB: number
    seed: number
}

const COUNT = 10

const SIZE_SCALE = 1.9
const R_MIN = 80 * SIZE_SCALE
const R_MAX = 180 * SIZE_SCALE

const BLUR_PX = 32
const CONTRAST = 1.6

const K_REP = 0.0011
const MERGE_RATE = 0.00045
const RELAX_RATE = 0.00006
const VISC = 0.9993

const SPEED_Y_BASE = 0.038
const SPEED_Y_JIT = 0.015
const SPEED_X_BASE = 0.008
const H_WOBBLE = 0.00002

const INV_MASS_SPEED = 10
const INV_MASS_IMP = 120

const MAX_SPEED = 0.09
const WARMUP_MS = 1400

const IMPULSE_STRENGTH = 10
const IMPULSE_RADIUS = 1000

function getScales(w: number) {
    if (w < 480) return { rK: 0.65, speedK: 0.92 }
    if (w < 768) return { rK: 0.75, speedK: 0.95 }
    if (w < 1024) return { rK: 0.85, speedK: 0.98 }
    return { rK: 1, speedK: 1 }
}

const getFillValue = (isDark: boolean) => {
    const root = document.documentElement
    const cs = getComputedStyle(root)
    return isDark
        ? cs.getPropertyValue('--blob-dark').trim()
        : cs.getPropertyValue('--blob-light').trim()
}

const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))

type Props = { paused?: boolean }

export function GooLayerCanvas({ paused = false }: Props) {
    const theme = useReadLocalStorage<'light' | 'dark'>(THEME_STORAGE_KEY)
    const isDark = theme === 'dark'
    const [fill, setFill] = useState(() => getFillValue(isDark))
    const wrapRef = useRef<HTMLDivElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
    const rafRef = useRef<number | undefined>(undefined)
    const blobsRef = useRef<BlobNode[]>([])
    const collidedRef = useRef<boolean[]>([])
    const pausedRef = useRef<boolean>(paused)
    useEffect(() => {
        pausedRef.current = paused
    }, [paused])

    useEffect(() => setFill(getFillValue(isDark)), [isDark])

    const sizeRef = useRef({ w: 0, h: 0 })
    const startRef = useRef<number>(performance.now())
    const baseRef = useRef<{ w: number; h: number; init: boolean }>({
        w: 0,
        h: 0,
        init: false,
    })
    const scaleRef = useRef<{ sx: number; sy: number }>({ sx: 1, sy: 1 })

    const radiusScaleRef = useRef(1)
    const speedScaleRef = useRef(1)

    useEffect(() => {
        init()
        seed(COUNT)
        loop()

        const onResize = () => layout()
        window.addEventListener('resize', onResize)

        const ro = new ResizeObserver(() => layout())
        ro.observe(document.body)

        const onPointerDown = (e: PointerEvent) => {
            applyImpulse(e.pageX, e.pageY)
        }
        const captureOpts: AddEventListenerOptions = { capture: true }
        window.addEventListener('pointerdown', onPointerDown, captureOpts)

        return () => {
            if (rafRef.current !== undefined)
                cancelAnimationFrame(rafRef.current)
            window.removeEventListener('resize', onResize)
            window.removeEventListener(
                'pointerdown',
                onPointerDown,
                captureOpts
            )
            ro.disconnect()
        }
    }, [fill])

    function init() {
        layout()
        const cvs = canvasRef.current
        if (!cvs) return
        const ctx = cvs.getContext('2d', { alpha: true })
        if (!ctx) return
        ctxRef.current = ctx
    }

    function layout() {
        const newW = Math.max(
            document.documentElement.clientWidth,
            document.documentElement.scrollWidth
        )
        const newH = Math.max(
            0,
            Math.max(
                document.documentElement.scrollHeight,
                document.documentElement.clientHeight
            )
        )
        const cvs = canvasRef.current
        const wrap = wrapRef.current
        if (!cvs || !wrap) return

        const { rK, speedK } = getScales(newW)
        radiusScaleRef.current = rK
        speedScaleRef.current = speedK

        if (!baseRef.current.init) {
            baseRef.current = { w: newW, h: newH, init: true }
            sizeRef.current = { w: newW, h: newH }

            cvs.width = Math.max(1, Math.floor(newW * dpr))
            cvs.height = Math.max(1, Math.floor(newH * dpr))
            cvs.style.width = `${newW}px`
            cvs.style.height = `${newH}px`

            wrap.style.width = `${newW}px`
            wrap.style.height = `${newH}px`
            wrap.style.transformOrigin = 'top left'
            wrap.style.transform = 'scale(1,1)'

            scaleRef.current = { sx: 1, sy: 1 }
            return
        }

        const { w: baseW, h: baseH } = baseRef.current
        const sx = newW / baseW
        const sy = newH / baseH
        scaleRef.current = { sx, sy }

        wrap.style.transformOrigin = 'top left'
        wrap.style.transform = `scale(${sx}, ${sy})`
        wrap.style.width = `${baseW}px`
        wrap.style.height = `${baseH}px`

        blobsRef.current.forEach((b) => {
            const r = currentRadius(b)
            b.x = clamp(b.x, r + 2, baseW - r - 2)
            b.y = clamp(b.y, r + 2, baseH - r - 2)
        })
    }

    function seed(n: number) {
        const { w, h } = sizeRef.current
        const blobs: BlobNode[] = []

        const rMin = R_MIN * radiusScaleRef.current
        const rMax = R_MAX * radiusScaleRef.current

        for (let i = 0; i < n; i++) {
            const r0 = rMin + Math.random() * (rMax - rMin)
            const mass0 = r0 * r0

            const x = clamp(Math.random() * w, r0 + 2, w - r0 - 2)
            const y = clamp(Math.random() * h, r0 + 2, h - r0 - 2)

            const invMass = 1 / Math.sqrt(mass0)
            const dirY = Math.random() < 0.5 ? -1 : 1
            const vy =
                dirY *
                (SPEED_Y_BASE + Math.random() * SPEED_Y_JIT) *
                (INV_MASS_SPEED * invMass)
            const vx =
                (Math.random() * 2 - 1) *
                SPEED_X_BASE *
                (INV_MASS_SPEED * invMass)

            blobs.push({
                x,
                y,
                vx,
                vy,
                mass: mass0,
                restMass: mass0,
                rPhase: Math.random() * Math.PI * 2,
                wobbleA: 0.6 + Math.random() * 0.5,
                wobbleB: 0.3 + Math.random() * 0.4,
                seed: Math.random() * Math.PI * 2,
            })
        }
        blobsRef.current = blobs
    }

    function loop() {
        let last = performance.now()
        const tick = (t: number) => {
            const dt = Math.min(32, t - last)
            last = t
            if (!pausedRef.current) {
                step(dt, t)
                draw()
            }
            rafRef.current = requestAnimationFrame(tick)
        }
        rafRef.current = requestAnimationFrame(tick)
    }

    function warmupFactor(now: number) {
        const u = Math.max(0, Math.min(1, (now - startRef.current) / WARMUP_MS))
        const s = u * u * (3 - 2 * u)
        return Math.max(0.6, s)
    }

    function step(dt: number, now: number) {
        const collided = collidedRef.current
        if (collided.length !== blobsRef.current.length) {
            collided.length = blobsRef.current.length
        }
        collided.fill(false)
        const s = warmupFactor(now)
        const { w, h } = sizeRef.current
        const blobs = blobsRef.current
        const speedK = speedScaleRef.current

        for (let i = 0; i < blobs.length; i++) {
            const a = blobs[i]
            a.x += a.vx * dt * s * speedK
            a.y += a.vy * dt * s * speedK
            a.vx += Math.sin(now * 0.001 + a.seed) * H_WOBBLE * dt * s * speedK

            const rNow = currentRadius(a)
            if (a.x - rNow < 0) {
                a.x = rNow
                a.vx = Math.abs(a.vx)
            }
            if (a.x + rNow > w) {
                a.x = w - rNow
                a.vx = -Math.abs(a.vx)
            }
            if (a.y + rNow > h) {
                a.y = h - rNow
                a.vy = -Math.abs(a.vy)
            }
            if (a.y - rNow < 0) {
                a.y = rNow
                a.vy = Math.abs(a.vy)
            }

            a.vx *= VISC
            a.vy *= VISC

            const sp = Math.hypot(a.vx, a.vy)
            if (sp > MAX_SPEED) {
                const k = MAX_SPEED / sp
                a.vx *= k
                a.vy *= k
            }

            a.rPhase += 0.0006 * dt * s
        }

        for (let i = 0; i < blobs.length; i++) {
            const a = blobs[i]
            const ra = currentRadius(a)
            for (let j = i + 1; j < blobs.length; j++) {
                const b = blobs[j]
                const rb = currentRadius(b)
                const dx = b.x - a.x,
                    dy = b.y - a.y
                const dist = Math.hypot(dx, dy) || 0.0001
                const minD = (ra + rb) * 0.72
                if (dist < minD) {
                    const nx = dx / dist,
                        ny = dy / dist
                    const f = (1 - dist / minD) * (K_REP * s) * dt
                    a.vx -= nx * f
                    a.vy -= ny * f
                    b.vx += nx * f
                    b.vy += ny * f

                    const overlap = (minD - dist) / minD
                    const Ma = a.mass,
                        Mb = b.mass
                    const transfer =
                        MERGE_RATE * s * overlap * dt * Math.min(Ma, Mb)
                    if (Ma >= Mb) {
                        a.mass = clampMass(Ma + transfer)
                        b.mass = clampMass(Mb - transfer)
                    } else {
                        a.mass = clampMass(Ma - transfer)
                        b.mass = clampMass(Mb + transfer)
                    }

                    collided[i] = collided[j] = true
                }
            }
        }

        for (let i = 0; i < blobs.length; i++) {
            if (!collided[i]) {
                const b = blobs[i]
                const delta = b.restMass - b.mass
                b.mass = clampMass(b.mass + delta * (RELAX_RATE * s) * dt)
            }
        }
    }

    function applyImpulse(px: number, py: number) {
        const { sx, sy } = scaleRef.current
        const pxBase = px / (sx || 1)
        const pyBase = py / (sy || 1)

        const { w: baseW, h: baseH } = baseRef.current
        if (pxBase < 0 || pxBase > baseW || pyBase < 0 || pyBase > baseH) return

        const blobs = blobsRef.current
        const Rimp = IMPULSE_RADIUS * radiusScaleRef.current
        const sigma2 = Rimp * Rimp * 0.5

        for (const b of blobs) {
            const dx = b.x - pxBase
            const dy = b.y - pyBase
            const d2 = dx * dx + dy * dy
            const gauss = Math.exp(-d2 / sigma2) * IMPULSE_STRENGTH
            if (gauss < 1e-4) continue

            const len = Math.sqrt(d2) || 1
            const nx = dx / len,
                ny = dy / len

            const invMass = 1 / Math.sqrt(b.mass)
            const scale = gauss * (INV_MASS_IMP * invMass)

            const jitter = (Math.random() * 2 - 1) * 0.12
            b.vx += (nx + -ny * jitter) * scale
            b.vy += (ny + nx * jitter) * scale

            const sp = Math.hypot(b.vx, b.vy)
            if (sp > MAX_SPEED) {
                const k = MAX_SPEED / sp
                b.vx *= k
                b.vy *= k
            }
        }
    }

    function currentRadius(b: BlobNode) {
        const base = Math.sqrt(b.mass)
        const k = radiusScaleRef.current
        return base * k * (1 + 0.06 * Math.sin(b.rPhase + b.seed))
    }

    function clampMass(m: number) {
        const k = radiusScaleRef.current
        const mMin = R_MIN * k * (R_MIN * k)
        const mMax = R_MAX * k * (R_MAX * k)
        return Math.max(mMin, Math.min(mMax, m))
    }

    const drawOrganicBlob = useCallback(
        (ctx: CanvasRenderingContext2D, b: BlobNode, t: number) => {
            const steps = 24
            const r0 = currentRadius(b)
            ctx.beginPath()
            for (let i = 0; i <= steps; i++) {
                const ang = (i / steps) * Math.PI * 2
                const r =
                    r0 *
                    (1 +
                        0.1 * b.wobbleA * Math.sin(ang * 3 + t + b.seed) +
                        0.07 *
                            b.wobbleB *
                            Math.sin(ang * 5 - t * 1.1 + b.seed * 1.7))
                const x = b.x + Math.cos(ang) * r
                const y = b.y + Math.sin(ang) * r * (1 - 0.02)
                if (i === 0) ctx.moveTo(x, y)
                else ctx.lineTo(x, y)
            }
            ctx.closePath()
            ctx.fill()
        },
        []
    )

    const draw = useCallback(() => {
        const { w, h } = sizeRef.current
        const ctx = ctxRef.current
        if (!ctx) return

        const scale = dpr
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, w * scale, h * scale)
        ctx.setTransform(scale, 0, 0, scale, 0, 0)

        ctx.filter = `blur(${BLUR_PX}px)`
        ctx.globalCompositeOperation = 'source-over'
        ctx.fillStyle = fill || 'rgba(0,0,0,.18)'

        const t = performance.now() * 0.00012
        for (const b of blobsRef.current) drawOrganicBlob(ctx, b, t)

        ctx.filter = 'none'
    }, [drawOrganicBlob, fill])

    return (
        <div
            ref={wrapRef}
            className="pointer-events-none absolute left-0 top-0 z-0 w-full"
            style={{ transformOrigin: 'top left' }}
            aria-hidden="true"
        >
            <canvas
                ref={canvasRef}
                className="block w-full h-full"
                style={{ filter: `contrast(${CONTRAST})` }}
            />
            <div className="glass-overlay" />
        </div>
    )
}

function clamp(v: number, a: number, b: number) {
    return Math.max(a, Math.min(b, v))
}
