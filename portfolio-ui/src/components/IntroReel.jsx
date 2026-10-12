import { useCallback, useEffect, useRef, useState } from "react";

/**
 * IntroReel
 * Plays your reel in a centered frame when the site opens.
 *
 * - Waits until the video is buffered, then starts by itself (no button)
 * - Volume starts at 60%. If the browser blocks sound autoplay (normal on a
 *   first visit), it starts muted and one click on the video / speaker
 *   turns the sound on at 60%. A volume slider lets the visitor go higher
 * - "Skip intro" button (or the Esc key) closes it quickly
 * - Calls onFinish() as the intro starts to fade so the site can mount then
 *
 * Props
 *   src                 video file URL (e.g. "/Intro_nawyes.mp4")
 *   onFinish            called once when the intro ends or is skipped
 *   startVolume         0 to 1, default 0.6
 *   maxWidth            max width of the video frame in px (default 860)
 *   aspectRatio         frame ratio, e.g. "16 / 9" or "9 / 16"
 *   poster              optional image shown before the video loads
 *   playOncePerSession  true = don't show again on refresh in the same tab
 */

const ACCENT = "#e5202e"; // match this to the red used on your site
const SEEN_KEY = "reel-intro-seen";
const FADE_MS = 400;

const ICONS = {
    off: "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z",
    low: "M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z",
    high: "M3 9v6h4l5 4V5L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z",
};

function VolumeIcon({ level }) {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path d={ICONS[level]} fill="currentColor" />
        </svg>
    );
}

export default function IntroReel({
    src,
    poster,
    onFinish,
    startVolume = 0.6,
    maxWidth = 860,
    aspectRatio = "16 / 9",
    playOncePerSession = false,
}) {
    const videoRef = useRef(null);
    const timers = useRef([]);
    const finishing = useRef(false);
    const onFinishRef = useRef(onFinish);
    onFinishRef.current = onFinish;

    const [open, setOpen] = useState(() => {
        if (!playOncePerSession) return true;
        try {
            return sessionStorage.getItem(SEEN_KEY) !== "1";
        } catch {
            return true;
        }
    });
    const [leaving, setLeaving] = useState(false);
    const [ready, setReady] = useState(false); // enough data buffered to play through
    const [buffering, setBuffering] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(startVolume);
    const [muted, setMuted] = useState(false);
    const [autoMuted, setAutoMuted] = useState(false); // browser forced muted start

    // Already seen this session: tell the parent to show the site right away
    useEffect(() => {
        if (!open) onFinishRef.current?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Close quickly: pause now, fade, mount the site a moment later
    const finish = useCallback(() => {
        if (finishing.current) return;
        finishing.current = true;
        setLeaving(true);
        videoRef.current?.pause();
        try {
            sessionStorage.setItem(SEEN_KEY, "1");
        } catch {
            /* storage can be unavailable; ignore */
        }
        timers.current.push(setTimeout(() => onFinishRef.current?.(), 60));
        timers.current.push(setTimeout(() => setOpen(false), FADE_MS));
    }, []);

    // Wait for the video to be buffered (with multiple ready checks)
    useEffect(() => {
        if (!open) return;
        const v = videoRef.current;
        if (v && v.readyState >= 2) setReady(true);
    }, [open]);

    // Safety timeout: intro NEVER blocks the user from reaching the site.
    // If the video fails or doesn't start playing within 5s, gracefully proceed to main content.
    useEffect(() => {
        if (!open) return;
        const safetyTimer = setTimeout(() => {
            const v = videoRef.current;
            if (!v || v.paused || v.currentTime === 0 || v.readyState < 2) {
                console.warn("Intro reel timeout (5s): skipping intro to main content.");
                finish();
            }
        }, 5000);
        return () => clearTimeout(safetyTimer);
    }, [open, finish]);

    // Once ready: attempt playback. On mobile, muted autoplay is guaranteed.
    useEffect(() => {
        if (!open || !ready) return;
        const v = videoRef.current;
        if (!v) return;

        v.volume = startVolume;
        // Start playback (muted autoplay is universally supported on iOS/Android)
        v.play().catch((err) => {
            console.warn("Autoplay blocked or failed, retrying muted:", err);
            v.muted = true;
            setMuted(true);
            setAutoMuted(true);
            v.play().catch(() => {
                // If playback still cannot proceed, don't trap the user
                finish();
            });
        });
    }, [open, ready, startVolume, finish]);

    // Lock page scroll while the intro is on screen
    useEffect(() => {
        if (!open) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, [open]);

    // Esc = skip
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && finish();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, finish]);

    useEffect(
        () => () => timers.current.forEach(clearTimeout),
        []
    );

    // ---- Volume controls -----------------------------------------------
    const setLevel = (val) => {
        const v = videoRef.current;
        if (!v) return;
        const n = Math.min(1, Math.max(0, val));
        v.volume = n;
        v.muted = n === 0;
        setVolume(n);
        setMuted(n === 0);
        setAutoMuted(false);
    };

    const toggleMute = () => {
        const v = videoRef.current;
        if (!v) return;
        if (v.muted || v.volume === 0) {
            setLevel(volume > 0 ? volume : startVolume);
        } else {
            v.muted = true;
            setMuted(true);
            setAutoMuted(false);
        }
    };

    // First click on the video while the browser forced muted: turn sound on
    const unmuteOnFirstTouch = () => {
        if (autoMuted) setLevel(volume > 0 ? volume : startVolume);
    };

    if (!open) return null;

    const showSpinner = !ready || buffering;
    const level = muted || volume === 0 ? "off" : volume <= 0.5 ? "low" : "high";

    return (
        <div
            role="dialog"
            aria-label="Introduction reel"
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                background: "#000",
                display: "grid",
                placeItems: "center",
                opacity: leaving ? 0 : 1,
                transition: `opacity ${FADE_MS}ms ease`,
                pointerEvents: leaving ? "none" : "auto",
            }}
        >
            <style>{`
        @keyframes introreel-spin { to { transform: rotate(360deg); } }
        @keyframes introreel-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(229,32,46,0.55); }
          100% { box-shadow: 0 0 0 12px rgba(229,32,46,0); }
        }

        .introreel-skip {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 24px;
          border: none;
          border-radius: 999px;
          background: #fff;
          color: #0a0a0a;
          font: inherit;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.01em;
          cursor: pointer;
          touch-action: manipulation;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.25), 0 10px 30px rgba(0,0,0,0.55);
          transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }
        .introreel-skip svg { transition: transform 0.2s ease; }
        .introreel-skip:hover { background: ${ACCENT}; color: #fff; transform: translateY(-1px); }
        .introreel-skip:hover svg { transform: translateX(3px); }
        .introreel-skip:active { transform: scale(0.97); }
        .introreel-skip:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

        .introreel-vol {
          -webkit-appearance: none;
          appearance: none;
          width: 96px;
          height: 4px;
          border-radius: 999px;
          outline: none;
          cursor: pointer;
          background: linear-gradient(to right, ${ACCENT} var(--v), rgba(255,255,255,0.25) var(--v));
        }
        .introreel-vol::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px; height: 14px;
          border-radius: 50%;
          background: #fff;
          border: none;
        }
        .introreel-vol::-moz-range-thumb {
          width: 14px; height: 14px;
          border-radius: 50%;
          background: #fff;
          border: none;
        }
      `}</style>

            {/* Video frame */}
            <div
                onPointerDown={unmuteOnFirstTouch}
                style={{
                    position: "relative",
                    width: `min(86vw, ${maxWidth}px)`,
                    aspectRatio,
                    maxHeight: "72vh",
                    borderRadius: 14,
                    overflow: "hidden",
                    background: "#000",
                    border: "1px solid rgba(255,255,255,0.1)",
                    cursor: autoMuted ? "pointer" : "default",
                    transform: leaving ? "scale(0.98)" : "scale(1)",
                    transition: `transform ${FADE_MS}ms ease`,
                }}
            >
                <video
                    ref={videoRef}
                    src={src}
                    poster={poster || "/nawres.png"}
                    autoPlay
                    muted={muted}
                    playsInline
                    preload="auto"
                    onLoadedData={() => setReady(true)}
                    onCanPlay={() => setReady(true)}
                    onCanPlayThrough={() => setReady(true)}
                    onWaiting={() => setBuffering(true)}
                    onPlaying={() => {
                        setBuffering(false);
                        setReady(true);
                    }}
                    onEnded={finish}
                    onError={() => {
                        console.warn("Video failed to load; gracefully showing main content.");
                        finish();
                    }}
                    onTimeUpdate={(e) => {
                        const { currentTime, duration } = e.currentTarget;
                        if (duration) setProgress(currentTime / duration);
                    }}
                    style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        background: "#000",
                    }}
                />

                {/* Loading / buffering */}
                {showSpinner && (
                    <div
                        aria-label="Loading"
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            width: 36,
                            height: 36,
                            marginTop: -18,
                            marginLeft: -18,
                            borderRadius: "50%",
                            border: "3px solid rgba(255,255,255,0.15)",
                            borderTopColor: ACCENT,
                            animation: "introreel-spin 0.8s linear infinite",
                        }}
                    />
                )}

                {/* Volume */}
                <div
                    onPointerDown={(e) => e.stopPropagation()}
                    style={{
                        position: "absolute",
                        left: 16,
                        bottom: 18,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "4px 14px 4px 4px",
                        borderRadius: 999,
                        background: "rgba(0,0,0,0.6)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        color: "#fff",
                        fontSize: 13,
                        animation: autoMuted ? "introreel-pulse 1.6s ease-out infinite" : "none",
                    }}
                >
                    <button
                        onClick={toggleMute}
                        aria-label={muted ? "Unmute" : "Mute"}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            minHeight: 44,
                            minWidth: 44,
                            padding: autoMuted ? "0 8px 0 10px" : "0 10px",
                            border: "none",
                            borderRadius: 999,
                            background: "transparent",
                            color: "inherit",
                            font: "inherit",
                            cursor: "pointer",
                        }}
                    >
                        <VolumeIcon level={level} />
                        {autoMuted && <span>Tap for sound</span>}
                    </button>

                    {!autoMuted && (
                        <input
                            className="introreel-vol"
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={muted ? 0 : volume}
                            onChange={(e) => setLevel(parseFloat(e.target.value))}
                            aria-label="Volume"
                            style={{ "--v": `${(muted ? 0 : volume) * 100}%` }}
                        />
                    )}
                </div>

                {/* Progress */}
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: 3,
                        background: "rgba(255,255,255,0.12)",
                    }}
                >
                    <div
                        style={{
                            height: "100%",
                            width: `${progress * 100}%`,
                            background: ACCENT,
                            transition: "width 200ms linear",
                        }}
                    />
                </div>
            </div>

            {/* Skip */}
            <button
                className="introreel-skip"
                onClick={finish}
                style={{
                    position: "absolute",
                    top: "max(28px, env(safe-area-inset-top))",
                    right: "max(28px, env(safe-area-inset-right))",
                }}
            >
                Skip intro
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" fill="currentColor" />
                </svg>
            </button>
        </div>
    );
}